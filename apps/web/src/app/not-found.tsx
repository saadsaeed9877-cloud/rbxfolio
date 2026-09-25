'use client';

import Link from 'next/link';
import { Code2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <Code2 size={42} className="mx-auto text-[#b7ff3c]" />
        <h1 className="mt-5 font-display text-5xl font-bold">Lost in the map?</h1>
        <p className="mt-3 text-white/40">This page hasn't been built yet.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-[#b7ff3c] px-5 py-3 text-sm font-bold text-black hover:bg-[#c6ff65] transition"
        >
          Back to explore
        </Link>
      </div>
    </div>
  );
}
