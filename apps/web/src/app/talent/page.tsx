'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Filter } from 'lucide-react';
import { PageHero, CreatorCard } from '@/components/design-system';

// Mock data - replace with real API calls
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
  {
    initials: 'RP',
    name: 'Riley Park',
    handle: 'rileydev',
    role: 'Full-Stack Developer',
    skills: ['Lua', 'TypeScript', 'Optimization'],
    followers: '3.8k',
    rate: '$160/hr',
    color: 'bg-gradient-to-br from-violet-300 to-indigo-600',
  },
  {
    initials: 'CM',
    name: 'Casey Morgan',
    handle: 'caseyart',
    role: 'Concept Artist',
    skills: ['Conceptualization', 'Design', 'Modeling'],
    followers: '2.5k',
    rate: '$120/hr',
    color: 'bg-gradient-to-br from-red-300 to-pink-600',
  },
];

const roles = ['All roles', 'Scripter', '3D Artist', 'UI Designer', 'VFX Artist'];

export default function TalentPage() {
  const [query, setQuery] = useState('');
  const [activeRole, setActiveRole] = useState('All roles');

  const filtered = useMemo(() => {
    return mockCreators.filter((c) => {
      const matchesRole =
        activeRole === 'All roles' ||
        c.role.toLowerCase().includes(activeRole.toLowerCase());
      const matchesQuery =
        `${c.name} ${c.role} ${c.skills.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesRole && matchesQuery;
    });
  }, [query, activeRole]);

  return (
    <>
      <PageHero
        kicker="Creator directory"
        title="Find the right talent."
        copy="Search specialized Roblox creators by craft, toolset, availability, and experience."
      />
      <section className="mx-auto max-w-[1380px] px-5 py-10">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-[#0c110d] p-4 lg:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/8 bg-black/20 px-4">
            <Search size={17} className="text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25"
              placeholder="Search by name, role, or skill"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto">
            {roles.slice(0, 4).map((r) => (
              <button
                key={r}
                onClick={() => setActiveRole(r)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold ${
                  activeRole === r
                    ? 'bg-[#b7ff3c] text-black'
                    : 'bg-white/5 text-white/45'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-bold">
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>
        <div className="mb-6 mt-10 flex items-center justify-between">
          <p className="text-sm text-white/40">
            <strong className="text-white">{filtered.length}</strong> creators found
          </p>
          <button className="flex items-center gap-2 text-xs text-white/40">
            Recommended <Filter size={14} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((c) => (
            <CreatorCard key={c.handle} creator={c} />
          ))}
        </div>
        {!filtered.length && (
          <div className="py-24 text-center text-white/35">
            No creators match those filters.
          </div>
        )}
      </section>
    </>
  );
}
