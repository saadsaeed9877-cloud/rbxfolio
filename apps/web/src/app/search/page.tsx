"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DeveloperCard } from "@/components/developer-card";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<{
    username: string;
    displayName: string;
    tagline: string | null;
    primaryRole: string;
    profilePictureUrl: string | null;
  }[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      apiFetch<{ data: typeof results }>(`/search?q=${encodeURIComponent(query)}`)
        .then((r) => setResults(r.data))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <Input
        placeholder="Search developers, roles, tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-lg"
        aria-label="Search developers"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((dev) => (
          <DeveloperCard key={dev.username} developer={dev} />
        ))}
      </div>
      {query && results.length === 0 && (
        <p className="mt-8 text-muted-foreground">No results for &quot;{query}&quot;</p>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">Search</h1>
        <div className="mt-6">
          <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
            <SearchContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
