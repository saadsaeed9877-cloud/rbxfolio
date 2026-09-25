'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  Sparkles,
  Loader,
} from 'lucide-react';
import {
  SectionTitle,
  ProjectCard,
  CreatorCard,
} from '@/components/design-system';
import { getProjectPlaceholder } from '@/lib/placeholders';
import { getFeaturedDevelopers, browseProjects } from '@/lib/api-client';

interface Developer {
  id: string;
  displayName: string;
  username: string;
  profilePictureUrl: string;
  tagline: string;
  primaryRole: string;
  availability: string;
  projectCount: number;
}

interface Project {
  id: string;
  userId: string;
  title: string;
  shortDescription: string;
  thumbnailUrl: string;
  user: {
    displayName: string;
    username: string;
    primaryRole: string;
  };
}

const colorGradients = [
  'bg-gradient-to-br from-emerald-300 to-cyan-700',
  'bg-gradient-to-br from-blue-300 to-purple-600',
  'bg-gradient-to-br from-pink-300 to-rose-600',
  'bg-gradient-to-br from-yellow-300 to-orange-600',
  'bg-gradient-to-br from-violet-300 to-indigo-600',
];

export default function HomePage() {
  const [role, setRole] = useState('All roles');
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [devs, prods] = await Promise.all([
          getFeaturedDevelopers().catch(() => []),
          browseProjects({ limit: 6, sort: 'newest' })
            .then((res) => res.data || [])
            .catch(() => []),
        ]);

        setDevelopers(devs || []);
        setProjects(prods || []);
        if (prods && prods.length > 0) {
          setFeaturedProject(prods[0]);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Convert API developers to CreatorCard format
  const creatorsForDisplay = developers.map((dev, idx) => ({
    initials: dev.displayName.substring(0, 2).toUpperCase(),
    name: dev.displayName,
    handle: dev.username,
    role: dev.primaryRole || 'Creator',
    skills: dev.primaryRole ? [dev.primaryRole] : ['Roblox'],
    followers: `${dev.projectCount}`,
    rate: 'Contact for rates',
    color: colorGradients[idx % colorGradients.length],
  }));

  // Convert API projects to ProjectCard format
  const projectsForDisplay = projects.map((proj) => ({
    title: proj.title,
    creator: proj.user?.displayName || 'Unknown',
    role: proj.user?.primaryRole || 'Creator',
    image: proj.thumbnailUrl || getProjectPlaceholder(proj.title),
    likes: '0',
    views: '0',
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/8 px-5 py-16 md:py-24">
        <div className="pointer-events-none absolute right-[-8%] top-[-10%] size-[550px] rounded-full bg-[#77ff00]/8 blur-[110px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto grid max-w-[1380px] items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b7ff3c]/20 bg-[#b7ff3c]/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#b7ff3c]">
              <Sparkles size={13} /> The portfolio network for Roblox creators
            </div>
            <h1 className="font-display max-w-3xl text-6xl font-bold leading-[.9] tracking-[-.065em] sm:text-7xl lg:text-[94px]">
              BUILD BOLD.<br />
              <span className="text-[#b7ff3c]">GET SEEN.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/50 md:text-lg">
              The place where Roblox developers show what they can do, find their next collaborator, and turn skill into opportunity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/u/profile"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#b7ff3c] px-6 py-3.5 text-sm font-bold text-[#071006] shadow-[0_0_35px_rgba(183,255,60,.14)] hover:bg-[#c6ff65]"
              >
                Create your portfolio <ArrowRight size={17} />
              </Link>
              <Link
                href="/talent"
                className="flex items-center justify-center rounded-xl border border-white/12 bg-white/[.03] px-6 py-3.5 text-sm font-bold hover:bg-white/[.07]"
              >
                Explore talent
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-7 text-xs text-white/35">
              <span>
                <strong className="block font-display text-xl text-white">{developers.length || '12.8k'}</strong>
                creators
              </span>
              <span>
                <strong className="block font-display text-xl text-white">{projects.length || '31k'}</strong>
                projects shared
              </span>
              <span>
                <strong className="block font-display text-xl text-white">$2.1m</strong>
                work connected
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[2rem] bg-[#b7ff3c]/8 blur-3xl" />
            <div className="relative rotate-1 overflow-hidden rounded-3xl border border-white/15 bg-[#0d120f] p-2 shadow-2xl transition hover:rotate-0">
              <img
                src={featuredProject?.thumbnailUrl || getProjectPlaceholder('Featured Project')}
                alt="Featured project"
                className="aspect-[4/3] w-full rounded-[1.15rem] object-cover saturate-[.7]"
              />
              <div className="absolute inset-x-2 bottom-2 rounded-b-[1.15rem] bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-24">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#b7ff3c]">
                      Featured build
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold">
                      {featuredProject?.title || 'Neon District'}
                    </h2>
                    <p className="mt-1 text-xs text-white/45">
                      Environment by {featuredProject?.user?.displayName || 'Maya Chen'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Heart size={14} className="text-[#b7ff3c]" /> 2.4k
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -left-5 top-12 hidden rounded-xl border border-white/12 bg-[#111712]/90 p-3 shadow-xl backdrop-blur md:flex md:items-center md:gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-[#b7ff3c] text-black">
                <BadgeCheck size={18} />
              </span>
              <span className="text-xs">
                <strong className="block">Top creator</strong>
                <span className="text-white/35">This week</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Craft Section */}
      <section className="mx-auto max-w-[1380px] px-5 py-16 md:py-24">
        <SectionTitle
          eyebrow="Find your people"
          title="Browse by craft"
          copy="Every discipline, one creative network. Filter the feed to find work and collaborators that match your world."
        />
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {['All roles', 'Scripter', '3D Artist', 'UI Designer', 'VFX Artist'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                role === r
                  ? 'border-[#b7ff3c] bg-[#b7ff3c] text-black'
                  : 'border-white/8 bg-white/[.025] text-white/50 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin" size={24} />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectsForDisplay.slice(0, 3).map((p, i) => (
              <ProjectCard key={p.title} project={p} large={i === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/50">
            No projects found. Be the first to share!
          </div>
        )}
      </section>

      {/* Creators to Watch Section */}
      <section className="border-y border-white/8 bg-[#0a0e0b] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1380px]">
          <SectionTitle
            eyebrow="Creators to watch"
            title="Talent, not titles."
            action="View all creators"
          />
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin" size={24} />
            </div>
          ) : developers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {creatorsForDisplay.map((c) => (
                <CreatorCard key={c.handle} creator={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/50">
              No developers found yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-5 py-16 md:py-24">
        <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-3xl border border-[#b7ff3c]/20 bg-[#10180f] px-7 py-12 md:px-14">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(183,255,60,.12),transparent_65%)]" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b7ff3c]">
              Your work belongs here
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-.04em] md:text-6xl">
              Made something great?
              <br />
              Don't let it hide.
            </h2>
            <p className="mt-5 text-white/45">
              Build a portfolio in minutes and put your craft in front of studios, teams, and creators looking for exactly what you do.
            </p>
            <Link
              href="/u/profile"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#b7ff3c] px-5 py-3 text-sm font-bold text-black hover:bg-[#c6ff65]"
            >
              Claim your profile <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
