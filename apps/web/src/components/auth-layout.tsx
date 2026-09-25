'use client';

import Link from 'next/link';
import { Code2 } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070a08] text-[#f4f7f4] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/8 px-5 py-6">
        <div className="mx-auto max-w-[1440px]">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="grid size-9 rotate-3 place-items-center rounded-lg bg-[#b7ff3c] text-[#071006] shadow-[0_0_25px_rgba(183,255,60,.18)] transition-transform group-hover:rotate-0">
              <Code2 size={19} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold tracking-[-.04em]">
              RBXFOLIO
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 px-5 py-6">
        <div className="mx-auto max-w-[1440px] text-center text-xs text-white/35">
          <p>&copy; 2024 RbxFolio. Built for Roblox creators.</p>
        </div>
      </footer>
    </div>
  );
}

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/45">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function AuthInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-white/8 bg-white/[.04] px-4 py-3 text-sm outline-none placeholder:text-white/25 transition focus:border-[#b7ff3c] focus:bg-white/[.08]"
      />
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function AuthButton({
  children,
  loading,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="w-full rounded-xl bg-[#b7ff3c] py-3 text-sm font-bold text-[#071006] shadow-[0_0_35px_rgba(183,255,60,.14)] hover:bg-[#c6ff65] disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex-1 border-t border-white/8" />
      <span className="text-xs text-white/35">OR</span>
      <div className="flex-1 border-t border-white/8" />
    </div>
  );
}

export function AuthLink({
  text,
  link,
  href,
}: {
  text: string;
  link: string;
  href: string;
}) {
  return (
    <p className="mt-6 text-center text-sm text-white/45">
      {text}{' '}
      <Link href={href} className="font-semibold text-[#b7ff3c] hover:text-[#c6ff65]">
        {link}
      </Link>
    </p>
  );
}
