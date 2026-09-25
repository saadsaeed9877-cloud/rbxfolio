'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Filter, Loader } from 'lucide-react';
import { PageHero, CreatorCard } from '@/components/design-system';
import { searchDevelopers } from '@/lib/api-client';

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

const roles = ['All roles', 'Scripter', '3D Artist', 'UI Designer', 'VFX Artist'];
const colorGradients = [
  'bg-gradient-to-br from-emerald-300 to-cyan-700',
  'bg-gradient-to-br from-blue-300 to-purple-600',
  'bg-gradient-to-br from-pink-300 to-rose-600',
  'bg-gradient-to-br from-yellow-300 to-orange-600',
  'bg-gradient-to-br from-violet-300 to-indigo-600',
  'bg-gradient-to-br from-red-300 to-pink-600',
];

export default function TalentPage() {
  const [query, setQuery] = useState('');
  const [activeRole, setActiveRole] = useState('All roles');
  const [allDevelopers, setAllDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load developers on component mount
  useEffect(() => {
    async function loadDevelopers() {
      try {
        setLoading(true);
        const result = await searchDevelopers({ limit: 100 });
        setAllDevelopers(result.data || []);
      } catch (err) {
        console.error('Failed to load developers:', err);
        setError('Failed to load developers');
      } finally {
        setLoading(false);
      }
    }

    loadDevelopers();
  }, []);

  // Filter developers locally based on search and role
  const filtered = useMemo(() => {
    return allDevelopers.filter((dev) => {
      const matchesRole =
        activeRole === 'All roles' ||
        dev.primaryRole?.toLowerCase().includes(activeRole.toLowerCase());
      const matchesQuery =
        `${dev.displayName} ${dev.primaryRole} ${dev.tagline}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesRole && matchesQuery;
    });
  }, [query, activeRole, allDevelopers]);

  // Convert API developers to CreatorCard format
  const creatorsForDisplay = filtered.map((dev, idx) => ({
    initials: dev.displayName.substring(0, 2).toUpperCase(),
    name: dev.displayName,
    handle: dev.username,
    role: dev.primaryRole || 'Creator',
    skills: dev.primaryRole ? [dev.primaryRole] : ['Roblox'],
    followers: `${dev.projectCount}`,
    rate: 'Contact for rates',
    color: colorGradients[idx % colorGradients.length],
  }));

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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin" size={24} />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">{error}</div>
        ) : (
          <>
            <div className="mb-6 mt-10 flex items-center justify-between">
              <p className="text-sm text-white/40">
                <strong className="text-white">{filtered.length}</strong> creators found
              </p>
              <button className="flex items-center gap-2 text-xs text-white/40">
                Recommended <Filter size={14} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {creatorsForDisplay.map((c) => (
                <CreatorCard key={c.handle} creator={c} />
              ))}
            </div>
            {!filtered.length && (
              <div className="py-24 text-center text-white/35">
                No creators match those filters.
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
