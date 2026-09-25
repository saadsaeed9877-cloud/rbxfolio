'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  Sparkles,
} from 'lucide-react';
import {
  SectionTitle,
  ProjectCard,
  CreatorCard,
} from '@/components/design-system';

// Mock data - replace with real API calls
const mockProjects = [
  {
    title: 'Neon District',
    creator: 'Maya Chen',
    role: '3D Artist',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
    likes: '2.4k',
    views: '8.2k',
  },
  {
    title: 'Quantum Interface',
    creator: 'Alex Rodriguez',
    role: 'UI Designer',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    likes: '1.8k',
    views: '5.6k',
  },
  {
    title: 'Pixel Paradise',
    creator: 'Jordan Lee',
    role: '3D Artist',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop',
    likes: '3.1k',
    views: '9.4k',
  },
];

const mockCreators = [
  {
    initials: 'MC',
    name: 'Maya Chen',
    handle: 'mayabuilds',
    role: '3D Environment Artist',
    skills: ['Blender', 'Lighting', 'Modeling'],
    followers: '4.8k',
    rate: '$150/hr',
    color: 'bg-gradient-to-br from-emerald-300 to-cyan-700',
  },
  {
    initials: 'AR',
    name: 'Alex Rodriguez',
    handle: 'alexrodev',
    role: 'UI/UX Designer',
    skills: ['Figma', 'Animation', 'Systems'],
    followers: '3.2k',
    rate: '$125/hr',
    color: 'bg-gradient-to-br from-blue-300 to-purple-600',
  },
  {
    initials: 'JL',
    name: 'Jordan Lee',
    handle: 'jordanscript',
    role: 'Scripter',
    skills: ['Lua', 'Architecture', 'Optimization'],
    followers: '5.1k',
    rate: '$140/hr',
    color: 'bg-gradient-to-br from-pink-300 to-rose-600',
  },
  {
    initials: 'SA',
    name: 'Sam Ahmed',
    handle: 'samvfx',
    role: 'VFX Artist',
    skills: ['Particles', 'Animation', 'Tools'],
    followers: '2.8k',
    rate: '$130/hr',
    color: 'bg-gradient-to-br from-yellow-300 to-orange-600',
  },
];

export default function HomePage() {
  const [role, setRole] = useState('All roles');

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
                <strong className="block font-display text-xl text-white">12.8k</strong>
                creators
              </span>
              <span>
                <strong className="block font-display text-xl text-white">31k</strong>
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
                src="https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop"
                alt="Featured neon environment project"
                className="aspect-[4/3] w-full rounded-[1.15rem] object-cover saturate-[.7]"
              />
              <div className="absolute inset-x-2 bottom-2 rounded-b-[1.15rem] bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-24">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#b7ff3c]">
                      Featured build
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold">Neon District</h2>
                    <p className="mt-1 text-xs text-white/45">Environment by Maya Chen</p>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockProjects.slice(0, 3).map((p, i) => (
            <ProjectCard key={p.title} project={p} large={i === 0} />
          ))}
        </div>
      </section>

      {/* Creators to Watch Section */}
      <section className="border-y border-white/8 bg-[#0a0e0b] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1380px]">
          <SectionTitle
            eyebrow="Creators to watch"
            title="Talent, not titles."
            action="View all creators"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockCreators.map((c) => (
              <CreatorCard key={c.handle} creator={c} />
            ))}
          </div>
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
