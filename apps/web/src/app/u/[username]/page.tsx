'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  MapPin,
  Users,
  Eye,
  Loader,
} from 'lucide-react';
import { ProjectCard } from '@/components/design-system';
import { getProjectPlaceholder, getBannerPlaceholder } from '@/lib/placeholders';
import { getUserProfile, getUserProjects } from '@/lib/api-client';

interface UserProfile {
  userId: string;
  displayName: string;
  username: string;
  profilePictureUrl: string;
  bannerUrl: string;
  tagline: string;
  bio: string;
  primaryRole: string;
  secondaryRoles: string[];
  experienceLevel: string;
  location: string;
  languages: string[];
  socialLinks: Record<string, string>;
  availability: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  userId: string;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  thumbnailUrl: string;
  completionStatus: string;
  tags: Array<{ id: string; name: string }>;
  _count: {
    media: number;
  };
  createdAt: string;
  updatedAt: string;
}

const colorGradients = [
  'bg-gradient-to-br from-emerald-300 to-cyan-700',
  'bg-gradient-to-br from-blue-300 to-purple-600',
  'bg-gradient-to-br from-pink-300 to-rose-600',
  'bg-gradient-to-br from-yellow-300 to-orange-600',
  'bg-gradient-to-br from-violet-300 to-indigo-600',
];

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState('Work');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        const [userProfile, userProjects] = await Promise.all([
          getUserProfile(username),
          getUserProjects(username),
        ]);
        setProfile(userProfile);
        setProjects(userProjects || []);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadProfileData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-[1180px] px-5 py-12 text-center">
        <p className="text-red-400">{error || 'Profile not found'}</p>
      </div>
    );
  }

  const initials = profile.displayName.substring(0, 2).toUpperCase();
  const avatarColor = colorGradients[Math.floor(Math.random() * colorGradients.length)];

  // Convert API projects to ProjectCard format
  const projectsForDisplay = projects.map((proj) => ({
    title: proj.title,
    creator: profile.displayName,
    role: profile.primaryRole || 'Creator',
    image: proj.thumbnailUrl || getProjectPlaceholder(proj.title),
    likes: '0',
    views: '0',
  }));

  return (
    <>
      {/* Banner */}
      <section className="relative h-48 overflow-hidden md:h-72">
        <img
          src={profile.bannerUrl || getBannerPlaceholder(profile.displayName)}
          alt="Profile banner"
          className="h-full w-full object-cover opacity-50 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a08] via-transparent to-black/30" />
      </section>

      {/* Profile Content */}
      <section className="relative mx-auto max-w-[1180px] px-5">
        <div className="-mt-16 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end">
          <div
            className={`grid size-28 shrink-0 place-items-center rounded-3xl border-4 border-[#070a08] ${avatarColor} font-display text-2xl font-black text-black shadow-xl`}
          >
            {initials}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold">{profile.displayName}</h1>
            </div>
            <p className="mt-1 text-sm text-white/35">
              @{profile.username} · {profile.primaryRole || 'Creator'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="grid size-11 place-items-center rounded-xl border border-white/10 hover:bg-white/5">
              <MessageCircle size={18} />
            </button>
            <button
              onClick={() => setFollowing(!following)}
              className={`rounded-xl px-5 text-sm font-bold transition ${
                following
                  ? 'bg-white/10 text-white'
                  : 'bg-[#b7ff3c] text-black'
              }`}
            >
              {following ? 'Following' : `Follow ${profile.displayName.split(' ')[0]}`}
            </button>
          </div>
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            <p className="max-w-2xl text-base leading-7 text-white/65">
              {profile.bio || profile.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-5 text-xs text-white/35">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                <strong className="text-white">{projects.length}</strong> projects
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {profile.availability}
              </span>
            </div>

            {/* Tabs */}
            <div className="mt-10 flex gap-7 border-b border-white/8">
              {['Work', 'About', 'Details'].map((t) => (
                <button
                  onClick={() => setTab(t)}
                  key={t}
                  className={`border-b-2 pb-3 text-sm font-bold ${
                    tab === t
                      ? 'border-[#b7ff3c] text-white'
                      : 'border-transparent text-white/35'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {tab === 'Work' && (
              <div className="mt-5">
                {projects.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {projectsForDisplay.map((p) => (
                      <ProjectCard key={p.title} project={p} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-10 text-center text-sm text-white/40">
                    No projects shared yet.
                  </div>
                )}
              </div>
            )}
            {tab === 'About' && (
              <div className="mt-6 rounded-2xl border border-white/8 bg-[#0c110d] p-6 text-sm leading-7 text-white/50">
                {profile.bio || (
                  <>
                    <p>{profile.displayName} is a {profile.primaryRole || 'creator'} on RbxFolio.</p>
                    {profile.experienceLevel && (
                      <p className="mt-3">Experience Level: {profile.experienceLevel}</p>
                    )}
                    {profile.languages && profile.languages.length > 0 && (
                      <p className="mt-3">Languages: {profile.languages.join(', ')}</p>
                    )}
                  </>
                )}
              </div>
            )}
            {tab === 'Details' && (
              <div className="mt-6 space-y-4">
                {profile.primaryRole && (
                  <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
                    <h4 className="font-display font-bold">Primary Role</h4>
                    <p className="mt-2 text-sm text-white/50">{profile.primaryRole}</p>
                  </div>
                )}
                {profile.secondaryRoles && profile.secondaryRoles.length > 0 && (
                  <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
                    <h4 className="font-display font-bold">Other Roles</h4>
                    <p className="mt-2 text-sm text-white/50">{profile.secondaryRoles.join(', ')}</p>
                  </div>
                )}
                {profile.experienceLevel && (
                  <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
                    <h4 className="font-display font-bold">Experience</h4>
                    <p className="mt-2 text-sm text-white/50">{profile.experienceLevel}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {profile.availability === 'OPEN' && (
              <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display font-bold">Open to work</h3>
                  <span className="size-2 rounded-full bg-[#b7ff3c] shadow-[0_0_8px_#b7ff3c]" />
                </div>
                <p className="text-xs leading-5 text-white/40">
                  {profile.tagline || 'Available for new projects and collaborations.'}
                </p>
                <button className="mt-5 w-full rounded-xl bg-[#b7ff3c] py-3 text-xs font-bold text-black hover:bg-[#c6ff65] transition">
                  Start a conversation
                </button>
              </div>
            )}

            {profile.primaryRole && (
              <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
                <h3 className="font-display font-bold">Specialization</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-white/8 px-2.5 py-1.5 text-[10px] text-white/45">
                    {profile.primaryRole}
                  </span>
                  {profile.secondaryRoles?.map((role) => (
                    <span key={role} className="rounded-lg border border-white/8 px-2.5 py-1.5 text-[10px] text-white/45">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
              <h3 className="font-display font-bold">Profile Stats</h3>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <span>
                  <strong className="block text-lg">{projects.length}</strong>
                  <small className="text-[9px] uppercase text-white/30">Projects</small>
                </span>
                <span>
                  <strong className="block text-lg">{profile.languages?.length || 0}</strong>
                  <small className="text-[9px] uppercase text-white/30">Languages</small>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
