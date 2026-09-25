'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  MapPin,
  Users,
  Eye,
} from 'lucide-react';
import { ProjectCard } from '@/components/design-system';
import { getProjectPlaceholder, getBannerPlaceholder } from '@/lib/placeholders';

// Mock profile data - replace with real API calls
const mockProfile = {
  initials: 'MC',
  name: 'Maya Chen',
  handle: 'mayabuilds',
  verified: true,
  role: '3D Environment Artist',
  bio: 'I build atmospheric worlds for Roblox experiences, with a focus on stylized lighting, modular environments, and spaces that tell a story before the player does anything.',
  location: 'Toronto, Canada',
  followers: '4.8k',
  availability: 'Available for work',
  following: false,
  skills: [
    'Blender',
    'Roblox Studio',
    'Substance',
    'Lighting',
    'Low-poly',
    'Optimization',
  ],
  reputation: {
    projects: '12',
    rating: '4.9',
    response: '98%',
  },
  bannerImage: getBannerPlaceholder('Maya Chen'),
  avatarColor: 'bg-gradient-to-br from-emerald-300 to-cyan-700',
  projects: [
    {
      title: 'Neon District',
      creator: 'Maya Chen',
      role: '3D Artist',
      image: getProjectPlaceholder('Neon District'),
      likes: '2.4k',
      views: '8.2k',
    },
    {
      title: 'Quantum Interface',
      creator: 'Maya Chen',
      role: 'UI Designer',
      image: getProjectPlaceholder('Quantum Interface'),
      likes: '1.8k',
      views: '5.6k',
    },
  ],
};

export default function PublicProfilePage() {
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState('Work');

  return (
    <>
      {/* Banner */}
      <section className="relative h-48 overflow-hidden md:h-72">
        <img
          src={mockProfile.bannerImage}
          alt="Profile banner"
          className="h-full w-full object-cover opacity-50 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a08] via-transparent to-black/30" />
      </section>

      {/* Profile Content */}
      <section className="relative mx-auto max-w-[1180px] px-5">
        <div className="-mt-16 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end">
          <div
            className={`grid size-28 shrink-0 place-items-center rounded-3xl border-4 border-[#070a08] ${mockProfile.avatarColor} font-display text-2xl font-black text-black shadow-xl`}
          >
            {mockProfile.initials}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold">{mockProfile.name}</h1>
              {mockProfile.verified && (
                <BadgeCheck size={20} className="text-[#b7ff3c]" />
              )}
            </div>
            <p className="mt-1 text-sm text-white/35">
              @{mockProfile.handle} · {mockProfile.role}
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
              {following ? 'Following' : `Follow ${mockProfile.name.split(' ')[0]}`}
            </button>
          </div>
        </div>

        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            <p className="max-w-2xl text-base leading-7 text-white/65">
              {mockProfile.bio}
            </p>
            <div className="mt-5 flex flex-wrap gap-5 text-xs text-white/35">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {mockProfile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                <strong className="text-white">{mockProfile.followers}</strong> followers
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {mockProfile.availability}
              </span>
            </div>

            {/* Tabs */}
            <div className="mt-10 flex gap-7 border-b border-white/8">
              {['Work', 'About', 'Appreciations'].map((t) => (
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
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {mockProfile.projects.map((p) => (
                  <ProjectCard key={p.title} project={p} />
                ))}
              </div>
            )}
            {tab === 'About' && (
              <div className="mt-6 rounded-2xl border border-white/8 bg-[#0c110d] p-6 text-sm leading-7 text-white/50">
                Maya has shipped environments for 12 Roblox experiences and
                contributed to games with more than 80 million combined visits.
                Her process spans blockout, modeling, UV work, texturing,
                lighting, and in-Studio optimization.
              </div>
            )}
            {tab === 'Appreciations' && (
              <div className="mt-6 rounded-2xl border border-white/8 bg-[#0c110d] p-10 text-center text-sm text-white/40">
                <Heart className="mx-auto mb-3 text-[#b7ff3c]" />
                2,409 appreciations across Maya&apos;s work.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display font-bold">Open to work</h3>
                <span className="size-2 rounded-full bg-[#b7ff3c] shadow-[0_0_8px_#b7ff3c]" />
              </div>
              <p className="text-xs leading-5 text-white/40">
                Environment art, lighting, and world building for short or
                long-term projects.
              </p>
              <button className="mt-5 w-full rounded-xl bg-[#b7ff3c] py-3 text-xs font-bold text-black hover:bg-[#c6ff65] transition">
                Start a conversation
              </button>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
              <h3 className="font-display font-bold">Core skills</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {mockProfile.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-white/8 px-2.5 py-1.5 text-[10px] text-white/45"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5">
              <h3 className="font-display font-bold">Reputation</h3>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <span>
                  <strong className="block text-lg">
                    {mockProfile.reputation.projects}
                  </strong>
                  <small className="text-[9px] uppercase text-white/30">
                    Projects
                  </small>
                </span>
                <span>
                  <strong className="block text-lg">
                    {mockProfile.reputation.rating}
                  </strong>
                  <small className="text-[9px] uppercase text-white/30">
                    Rating
                  </small>
                </span>
                <span>
                  <strong className="block text-lg">
                    {mockProfile.reputation.response}
                  </strong>
                  <small className="text-[9px] uppercase text-white/30">
                    Response
                  </small>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
