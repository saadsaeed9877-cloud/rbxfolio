'use client';

import { useState } from 'react';
import { PageHero, ProjectCard } from '@/components/design-system';

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
  {
    title: 'Crystal Caves',
    creator: 'Sam Ahmed',
    role: 'VFX Artist',
    image: 'https://images.unsplash.com/photo-1555097462-c2dfc508fa1a?w=800&h=600&fit=crop',
    likes: '2.8k',
    views: '7.1k',
  },
  {
    title: 'Cyber Nexus',
    creator: 'Riley Park',
    role: 'Scripter',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    likes: '3.5k',
    views: '10.2k',
  },
  {
    title: 'Magic Realm',
    creator: 'Casey Morgan',
    role: '3D Artist',
    image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b32f?w=800&h=600&fit=crop',
    likes: '2.2k',
    views: '6.9k',
  },
];

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState('Trending');

  const tabs = ['Trending', 'Latest', 'Most appreciated', 'Staff picks'];

  return (
    <>
      <PageHero
        kicker="Community showcase"
        title="Work worth pausing for."
        copy="A live stream of environments, systems, interfaces, animation, audio, and effects from Roblox's sharpest creators."
      />
      <section className="mx-auto max-w-[1380px] px-5 py-10">
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {tabs.map((item, i) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ${
                activeTab === item
                  ? 'bg-[#b7ff3c] text-black'
                  : 'border border-white/8 text-white/45'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((p, i) => (
            <ProjectCard key={p.title} project={p} large={i === 0} />
          ))}
        </div>
      </section>
    </>
  );
}
