import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  Box,
  BriefcaseBusiness,
  ChevronDown,
  Code2,
  Compass,
  Heart,
  Menu,
  Search,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import type { Creator } from "./data";

const nav = [
  { label: "Explore", to: "/", icon: Compass },
  { label: "Talent", to: "/talent", icon: UserRound },
  { label: "Jobs", to: "/jobs", icon: BriefcaseBusiness },
  { label: "Projects", to: "/projects", icon: Box },
];

export function Shell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[#070a08] text-[#f4f7f4]">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#070a08]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-8 px-5 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="grid size-9 rotate-3 place-items-center rounded-lg bg-[#b7ff3c] text-[#071006] shadow-[0_0_25px_rgba(183,255,60,.18)] transition-transform group-hover:rotate-0">
              <Code2 size={19} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold tracking-[-.04em]">BLOX<span className="text-[#b7ff3c]">FOLIO</span></span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? "bg-white/8 text-white" : "text-white/50 hover:text-white"}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden w-full max-w-xs items-center gap-2 rounded-xl border border-white/8 bg-white/[.04] px-3.5 py-2.5 text-white/35 lg:flex">
            <Search size={16} />
            <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30" placeholder="Search creators, work, skills..." />
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </div>
          <button aria-label="Notifications" className="ml-auto rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white lg:ml-0"><Bell size={19} /></button>
          <Link to="/profile" className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-2 py-1.5 text-sm font-semibold sm:flex">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-[#b7ff3c] to-emerald-700 text-[10px] font-bold text-black">OX</span>
            olix
            <ChevronDown size={14} className="text-white/35" />
          </Link>
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="rounded-lg p-2 md:hidden">{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <nav className="border-t border-white/8 bg-[#0b0f0c] p-4 md:hidden">
            {nav.map((item) => (
              <Link onClick={() => setOpen(false)} key={item.to} to={item.to} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${location.pathname === item.to ? "bg-[#b7ff3c] text-black" : "text-white/60"}`}>
                <item.icon size={17} /> {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main><Outlet /></main>
      <footer className="border-t border-white/8 px-5 py-10">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-5 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display font-bold text-white">BLOX<span className="text-[#b7ff3c]">FOLIO</span></span>
          <p>Built for the people building the Roblox universe.</p>
          <div className="flex gap-5"><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Discord</a></div>
        </div>
      </footer>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy?: string; action?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#b7ff3c]"><span className="h-px w-6 bg-[#b7ff3c]" />{eyebrow}</div>}
        <h2 className="font-display text-3xl font-bold tracking-[-.04em] md:text-4xl">{title}</h2>
        {copy && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">{copy}</p>}
      </div>
      {action && <button className="flex items-center gap-2 text-sm font-semibold text-[#b7ff3c]">{action}<ArrowUpRight size={16} /></button>}
    </div>
  );
}

export function CreatorCard({ creator }: { creator: Creator }) {
  const [following, setFollowing] = useState(false);
  return (
    <article className="group rounded-2xl border border-white/8 bg-[#0c110d] p-5 transition-all hover:-translate-y-1 hover:border-[#b7ff3c]/30">
      <div className="flex items-start justify-between">
        <Link to="/profile" className={`grid size-14 place-items-center rounded-2xl bg-gradient-to-br ${creator.color} font-display text-sm font-black text-black shadow-lg`}>{creator.initials}</Link>
        <button onClick={() => setFollowing(!following)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${following ? "bg-white/10 text-white" : "bg-[#b7ff3c] text-black"}`}>{following ? "Following" : "Follow"}</button>
      </div>
      <Link to="/profile"><h3 className="mt-5 font-display text-lg font-bold">{creator.name}</h3></Link>
      <p className="mt-0.5 text-xs text-white/35">{creator.handle}</p>
      <p className="mt-3 text-sm font-semibold text-[#b7ff3c]">{creator.role}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">{creator.skills.map((s) => <span key={s} className="rounded-md border border-white/8 bg-white/[.03] px-2 py-1 text-[10px] text-white/50">{s}</span>)}</div>
      <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4 text-xs">
        <span className="text-white/35"><strong className="text-white/80">{creator.followers}</strong> followers</span>
        <span className="font-semibold text-white/70">{creator.rate}</span>
      </div>
    </article>
  );
}

export function ProjectCard({ project, large = false }: { project: { title: string; creator: string; role: string; image: string; likes: string; views: string }; large?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className={`group overflow-hidden rounded-2xl border border-white/8 bg-[#0c110d] ${large ? "md:col-span-2" : ""}`}>
      <div className={`relative overflow-hidden ${large ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
        <img src={project.image} alt={`${project.title} project artwork`} className="h-full w-full object-cover saturate-[.75] transition duration-700 group-hover:scale-105 group-hover:saturate-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-md border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">{project.role}</span>
        <button onClick={() => setSaved(!saved)} aria-label="Save project" className={`absolute right-4 top-4 grid size-9 place-items-center rounded-lg border backdrop-blur-md ${saved ? "border-[#b7ff3c] bg-[#b7ff3c] text-black" : "border-white/15 bg-black/50"}`}>
          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-4 left-4">
          <h3 className="font-display text-xl font-bold tracking-tight">{project.title}</h3>
          <p className="mt-1 text-xs text-white/55">by {project.creator}</p>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-3 text-[11px] text-white/55">
          <span className="flex items-center gap-1"><Heart size={13} />{project.likes}</span>
          <span>{project.views} views</span>
        </div>
      </div>
    </article>
  );
}

export function PageHero({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return (
    <section className="border-b border-white/8 px-5 py-14 md:py-20">
      <div className="mx-auto max-w-[1380px]">
        <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-[#b7ff3c]">{kicker}</p>
        <h1 className="font-display max-w-4xl text-5xl font-bold leading-[.95] tracking-[-.055em] md:text-7xl">{title}</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/45">{copy}</p>
      </div>
    </section>
  );
}

export const roleIcons = { "All roles": Sparkles, Scripter: Code2, "3D Artist": Box, "UI Designer": Zap };
