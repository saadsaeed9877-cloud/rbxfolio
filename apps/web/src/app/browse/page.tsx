'use client';

import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { PageHero, ProjectCard } from '@/components/design-system';
import { getProjectPlaceholder } from '@/lib/placeholders';
import { browseProjects } from '@/lib/api-client';

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

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState<'newest' | 'updated'>('newest');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'newest', label: 'Latest' },
    { id: 'updated', label: 'Recently Updated' },
  ] as const;

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const result = await browseProjects({
          sort: activeTab,
          limit: 12,
        });
        setProjects(result.data || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [activeTab]);

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
      <PageHero
        kicker="Community showcase"
        title="Work worth pausing for."
        copy="A live stream of environments, systems, interfaces, animation, audio, and effects from Roblox's sharpest creators."
      />
      <section className="mx-auto max-w-[1380px] px-5 py-10">
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ${
                activeTab === item.id
                  ? 'bg-[#b7ff3c] text-black'
                  : 'border border-white/8 text-white/45'
              }`}
            >
              {item.label}
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
            {projectsForDisplay.map((p, i) => (
              <ProjectCard key={p.title} project={p} large={i === 0} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/50">
            No projects found. Be the first to share!
          </div>
        )}
      </section>
    </>
  );
}
