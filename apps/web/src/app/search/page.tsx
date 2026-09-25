'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { ArrowLeft, Loader, Users, Package } from 'lucide-react';
import Link from 'next/link';
import { PageHero, CreatorCard, ProjectCard, SectionTitle } from '@/components/design-system';
import { searchDevelopers, browseProjects } from '@/lib/api-client';
import { getProjectPlaceholder } from '@/lib/placeholders';

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
  'bg-gradient-to-br from-red-300 to-pink-600',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setDevelopers([]);
      setProjects([]);
      setLoading(false);
      return;
    }

    async function loadResults() {
      try {
        setLoading(true);
        const [devResults, projResults] = await Promise.all([
          searchDevelopers({ q: query, limit: 12 })
            .then(res => res.data || [])
            .catch(err => {
              console.error('Developer search failed:', err);
              return [];
            }),
          browseProjects({ limit: 12 })
            .then(res => res.data || [])
            .catch(err => {
              console.error('Project search failed:', err);
              return [];
            })
        ]);

        // Filter projects by query
        const filteredProjects = projResults.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.user?.displayName.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(query.toLowerCase())
        );

        setDevelopers(devResults);
        setProjects(filteredProjects);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to load search results');
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="mx-auto max-w-[1380px] px-5 py-24 text-center">
        <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
          <Package size={32} className="text-white/30" />
        </div>
        <h2 className="font-display text-2xl font-bold">No search query</h2>
        <p className="mt-2 text-white/50">Enter a search term to find creators and projects.</p>
        <Link
          href="/talent"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#b7ff3c] px-6 py-3 text-sm font-bold text-black hover:bg-[#c6ff65]"
        >
          <ArrowLeft size={16} />
          Browse all talent
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1380px] px-5 py-24 text-center">
        <Loader className="mx-auto animate-spin" size={32} />
        <p className="mt-4 text-white/50">Searching for "{query}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[1380px] px-5 py-24 text-center">
        <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5">
          <Package size={32} className="text-red-500/50" />
        </div>
        <h2 className="font-display text-2xl font-bold">Search error</h2>
        <p className="mt-2 text-red-400">{error}</p>
      </div>
    );
  }

  const totalResults = developers.length + projects.length;

  // Convert developers to CreatorCard format
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

  // Convert projects to ProjectCard format
  const projectsForDisplay = projects.map((proj) => ({
    title: proj.title,
    creator: proj.user?.displayName || 'Unknown',
    role: proj.user?.primaryRole || 'Creator',
    image: proj.thumbnailUrl || getProjectPlaceholder(proj.title),
    likes: '0',
    views: '0',
  }));

  return (
    <div className="mx-auto max-w-[1380px] px-5 py-16">
      {/* Results Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-4xl font-bold">
            Search results for "<span className="text-[#b7ff3c]">{query}</span>"
          </h1>
        </div>
        <p className="text-lg text-white/50">
          Found <strong className="text-white">{totalResults}</strong> result{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-16 text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
            <Package size={32} className="text-white/30" />
          </div>
          <h3 className="font-display text-2xl font-bold">No results found</h3>
          <p className="mt-2 text-white/50">
            We couldn't find any creators or projects matching "{query}". Try a different search term.
          </p>
        </div>
      ) : (
        <>
          {/* Developers Section */}
          {developers.length > 0 && (
            <section className="mb-16 border-b border-white/8 pb-16">
              <SectionTitle
                eyebrow="Creators"
                title="Talented Developers"
                copy={`Found ${developers.length} creator${developers.length !== 1 ? 's' : ''} matching your search`}
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {creatorsForDisplay.map((c) => (
                  <CreatorCard key={c.handle} creator={c} />
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <section>
              <SectionTitle
                eyebrow="Projects"
                title="Work & Portfolios"
                copy={`Found ${projects.length} project${projects.length !== 1 ? 's' : ''} matching your search`}
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projectsForDisplay.map((p, i) => (
                  <ProjectCard key={p.title} project={p} large={i === 0} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Related Searches */}
      {totalResults > 0 && (
        <section className="mt-16 rounded-2xl border border-white/8 bg-[#0c110d] p-8">
          <h3 className="mb-4 font-display text-lg font-bold">Related searches</h3>
          <div className="flex flex-wrap gap-2">
            {['UI Design', '3D Art', 'Scripting', 'Animation', 'VFX'].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-lg border border-white/8 px-3.5 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                {term}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <PageHero
        kicker="Search"
        title="Find creators & projects"
        copy="Discover talented developers and amazing work in the community."
      />
      <Suspense
        fallback={
          <div className="mx-auto max-w-[1380px] px-5 py-24 text-center">
            <Loader className="mx-auto animate-spin" size={32} />
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </>
  );
}
