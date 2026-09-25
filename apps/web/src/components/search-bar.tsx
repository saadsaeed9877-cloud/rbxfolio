'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Loader, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { searchDevelopers, browseProjects } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface SearchResult {
  type: 'developer' | 'project';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        
        // Search both developers and projects in parallel
        const [devResults, projResults] = await Promise.all([
          searchDevelopers({ q: query, limit: 3 })
            .then(res => res.data || [])
            .catch(() => []),
          browseProjects({ limit: 3 })
            .then(res => res.data || [])
            .catch(() => [])
        ]);

        // Combine and format results
        const combined: SearchResult[] = [
          ...devResults.map(dev => ({
            type: 'developer' as const,
            id: dev.username,
            title: dev.displayName,
            subtitle: dev.primaryRole,
            href: `/u/${dev.username}`,
          })),
          ...projResults
            .filter(proj => 
              proj.title.toLowerCase().includes(query.toLowerCase()) ||
              proj.user?.displayName.toLowerCase().includes(query.toLowerCase())
            )
            .map(proj => ({
              type: 'project' as const,
              id: proj.id,
              title: proj.title,
              subtitle: proj.user?.displayName || 'Unknown',
              href: `/u/${proj.user?.username}/projects/${proj.id}`,
            }))
        ];

        setResults(combined);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        // Focus input would go here
      }

      if (e.key === 'Enter' && query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [query, router]);

  const handleSearchSubmit = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xs">
      <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.04] px-3.5 py-2.5 text-white/35">
        <Search size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          placeholder="Search creators, work, skills..."
          aria-label="Search"
        />
        {loading && <Loader size={14} className="animate-spin text-white/50" />}
        {!loading && <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-[400px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/8 bg-[#0c110d] shadow-2xl">
          {loading && query.trim() ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-white/50">
              <Loader size={16} className="animate-spin" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="max-h-[400px] overflow-y-auto">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 border-b border-white/8 px-4 py-3 transition-colors hover:bg-white/5 last:border-b-0"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-[#b7ff3c]">
                      {result.type === 'developer' ? '👤' : '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium text-white">{result.title}</div>
                      <div className="truncate text-xs text-white/50">{result.subtitle}</div>
                    </div>
                    <ArrowRight size={14} className="text-white/20 shrink-0" />
                  </Link>
                ))}
              </div>

              <div className="border-t border-white/8 px-4 py-3">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full rounded-lg bg-[#b7ff3c] py-2 text-xs font-bold text-black transition hover:bg-[#c6ff65]"
                >
                  View all results for "{query}"
                </button>
              </div>
            </>
          ) : query.trim() ? (
            <div className="px-4 py-8 text-center text-sm text-white/50">
              No results found for "{query}"
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-white/50">
              Start typing to search...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
