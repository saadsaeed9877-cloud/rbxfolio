import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Eye,
  Filter,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { CreatorCard, PageHero, ProjectCard, SectionTitle, roleIcons } from "./components";
import { creators, images, jobs, projects } from "./data";

const roles = ["All roles", "Scripter", "3D Artist", "UI Designer", "VFX Artist"];

export function ExplorePage() {
  const [role, setRole] = useState("All roles");
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/8 px-5 py-16 md:py-24">
        <div className="pointer-events-none absolute right-[-8%] top-[-10%] size-[550px] rounded-full bg-[#77ff00]/8 blur-[110px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto grid max-w-[1380px] items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b7ff3c]/20 bg-[#b7ff3c]/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#b7ff3c]">
              <Sparkles size={13} /> The portfolio network for Roblox creators
            </div>
            <h1 className="font-display max-w-3xl text-6xl font-bold leading-[.9] tracking-[-.065em] sm:text-7xl lg:text-[94px]">
              BUILD BOLD.<br /><span className="text-[#b7ff3c]">GET SEEN.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/50 md:text-lg">
              The place where Roblox developers show what they can do, find their next collaborator, and turn skill into opportunity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/profile" className="flex items-center justify-center gap-2 rounded-xl bg-[#b7ff3c] px-6 py-3.5 text-sm font-bold text-[#071006] shadow-[0_0_35px_rgba(183,255,60,.14)] hover:bg-[#c6ff65]">Create your portfolio <ArrowRight size={17} /></Link>
              <Link to="/talent" className="flex items-center justify-center rounded-xl border border-white/12 bg-white/[.03] px-6 py-3.5 text-sm font-bold hover:bg-white/[.07]">Explore talent</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-7 text-xs text-white/35">
              <span><strong className="block font-display text-xl text-white">12.8k</strong>creators</span>
              <span><strong className="block font-display text-xl text-white">31k</strong>projects shared</span>
              <span><strong className="block font-display text-xl text-white">$2.1m</strong>work connected</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[2rem] bg-[#b7ff3c]/8 blur-3xl" />
            <div className="relative rotate-1 overflow-hidden rounded-3xl border border-white/15 bg-[#0d120f] p-2 shadow-2xl transition hover:rotate-0">
              <img src={images.alley} alt="Featured neon environment project" className="aspect-[4/3] w-full rounded-[1.15rem] object-cover saturate-[.7]" />
              <div className="absolute inset-x-2 bottom-2 rounded-b-[1.15rem] bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-24">
                <div className="flex items-end justify-between">
                  <div><span className="text-[10px] font-bold uppercase tracking-widest text-[#b7ff3c]">Featured build</span><h2 className="mt-1 font-display text-2xl font-bold">Neon District</h2><p className="mt-1 text-xs text-white/45">Environment by Maya Chen</p></div>
                  <div className="flex items-center gap-1 text-xs"><Heart size={14} className="text-[#b7ff3c]" /> 2.4k</div>
                </div>
              </div>
            </div>
            <div className="absolute -left-5 top-12 hidden rounded-xl border border-white/12 bg-[#111712]/90 p-3 shadow-xl backdrop-blur md:flex md:items-center md:gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-[#b7ff3c] text-black"><BadgeCheck size={18} /></span>
              <span className="text-xs"><strong className="block">Top creator</strong><span className="text-white/35">This week</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1380px] px-5 py-16 md:py-24">
        <SectionTitle eyebrow="Find your people" title="Browse by craft" copy="Every discipline, one creative network. Filter the feed to find work and collaborators that match your world." />
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {roles.map((r) => {
            const Icon = roleIcons[r as keyof typeof roleIcons] || Sparkles;
            return <button key={r} onClick={() => setRole(r)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${role === r ? "border-[#b7ff3c] bg-[#b7ff3c] text-black" : "border-white/8 bg-white/[.025] text-white/50 hover:text-white"}`}><Icon size={15} />{r}</button>;
          })}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.filter((p) => role === "All roles" || p.role.includes(role.split(" ")[0])).slice(0, 5).map((p, i) => <ProjectCard key={p.title} project={p} large={role === "All roles" && i === 0} />)}
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0a0e0b] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-[1380px]">
          <SectionTitle eyebrow="Creators to watch" title="Talent, not titles." action="View all creators" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{creators.map((c) => <CreatorCard key={c.handle} creator={c} />)}</div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-3xl border border-[#b7ff3c]/20 bg-[#10180f] px-7 py-12 md:px-14">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(183,255,60,.12),transparent_65%)]" />
          <div className="relative max-w-2xl"><p className="text-xs font-bold uppercase tracking-widest text-[#b7ff3c]">Your work belongs here</p><h2 className="mt-4 font-display text-4xl font-bold tracking-[-.04em] md:text-6xl">Made something great?<br />Don’t let it hide.</h2><p className="mt-5 text-white/45">Build a portfolio in minutes and put your craft in front of studios, teams, and creators looking for exactly what you do.</p><Link to="/profile" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#b7ff3c] px-5 py-3 text-sm font-bold text-black">Claim your profile <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </>
  );
}

export function TalentPage() {
  const [query, setQuery] = useState("");
  const [activeRole, setActiveRole] = useState("All roles");
  const filtered = useMemo(() => creators.filter((c) => (activeRole === "All roles" || c.role.includes(activeRole.split(" ")[0])) && `${c.name} ${c.role} ${c.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query, activeRole]);
  return (
    <>
      <PageHero kicker="Creator directory" title="Find the right talent." copy="Search specialized Roblox creators by craft, toolset, availability, and experience." />
      <section className="mx-auto max-w-[1380px] px-5 py-10">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-[#0c110d] p-4 lg:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/8 bg-black/20 px-4"><Search size={17} className="text-white/30" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25" placeholder="Search by name, role, or skill" /></label>
          <div className="flex gap-2 overflow-x-auto">
            {roles.slice(0, 4).map((r) => <button key={r} onClick={() => setActiveRole(r)} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold ${activeRole === r ? "bg-[#b7ff3c] text-black" : "bg-white/5 text-white/45"}`}>{r}</button>)}
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-bold"><SlidersHorizontal size={15} /> Filters</button>
        </div>
        <div className="mb-6 mt-10 flex items-center justify-between"><p className="text-sm text-white/40"><strong className="text-white">{filtered.length}</strong> creators found</p><button className="flex items-center gap-2 text-xs text-white/40">Recommended <Filter size={14} /></button></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((c) => <CreatorCard key={c.handle} creator={c} />)}</div>
        {!filtered.length && <div className="py-24 text-center text-white/35">No creators match those filters.</div>}
      </section>
    </>
  );
}

export function ProjectsPage() {
  return (
    <>
      <PageHero kicker="Community showcase" title="Work worth pausing for." copy="A live stream of environments, systems, interfaces, animation, audio, and effects from Roblox’s sharpest creators." />
      <section className="mx-auto max-w-[1380px] px-5 py-10">
        <div className="mb-8 flex gap-2 overflow-x-auto">{["Trending", "Latest", "Most appreciated", "Staff picks"].map((item, i) => <button key={item} className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ${i === 0 ? "bg-[#b7ff3c] text-black" : "border border-white/8 text-white/45"}`}>{item}</button>)}</div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{projects.map((p, i) => <ProjectCard key={p.title} project={p} large={i === 0} />)}</div>
      </section>
    </>
  );
}

export function JobsPage() {
  const [saved, setSaved] = useState<string[]>([]);
  return (
    <>
      <PageHero kicker="Opportunity board" title="Good work finds good people." copy="Curated roles and commissions from Roblox studios and independent teams. No noise, just real briefs." />
      <section className="mx-auto grid max-w-[1380px] gap-8 px-5 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/8 bg-[#0c110d] p-5">
          <h3 className="font-display font-bold">Refine jobs</h3>
          {["Role", "Work type", "Experience", "Budget"].map((f) => <button key={f} className="flex w-full items-center justify-between border-b border-white/8 py-4 text-sm text-white/45 last:border-0">{f}<ChevronRight size={15} /></button>)}
          <label className="mt-4 flex items-center gap-3 text-xs text-white/60"><input type="checkbox" defaultChecked className="accent-[#b7ff3c]" /> Only verified studios</label>
        </aside>
        <div>
          <div className="mb-5 flex items-center justify-between"><p className="text-sm text-white/40"><strong className="text-white">184</strong> open opportunities</p><button className="rounded-lg border border-white/10 px-3 py-2 text-xs">Newest first</button></div>
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <article key={job.title} className="rounded-2xl border border-white/8 bg-[#0c110d] p-5 transition hover:border-[#b7ff3c]/30 md:p-6">
                <div className="flex gap-4">
                  <div className="hidden size-12 shrink-0 place-items-center rounded-xl border border-[#b7ff3c]/15 bg-[#b7ff3c]/8 font-display font-black text-[#b7ff3c] sm:grid">{job.studio.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-display text-lg font-bold">{job.title}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-white/40">{job.studio}<BadgeCheck size={13} className="text-[#b7ff3c]" /></p></div><button onClick={() => setSaved(saved.includes(job.title) ? saved.filter((s) => s !== job.title) : [...saved, job.title])} className={`text-xs font-bold ${saved.includes(job.title) ? "text-[#b7ff3c]" : "text-white/35"}`}>{saved.includes(job.title) ? "Saved" : "Save"}</button></div>
                    <div className="mt-5 flex flex-wrap gap-2">{job.tags.map((tag) => <span key={tag} className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] text-white/45">{tag}</span>)}</div>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/8 pt-4 text-xs text-white/40"><span className="font-semibold text-white/75">{job.budget}</span><span className="flex items-center gap-1.5"><BriefcaseBusiness size={13} />{job.type}</span><span className="flex items-center gap-1.5"><Clock3 size={13} />{job.age}</span><button className="ml-auto flex items-center gap-1 font-bold text-[#b7ff3c]">View brief <ArrowRight size={13} /></button></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ProfilePage() {
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState("Work");
  return (
    <>
      <section className="relative h-48 overflow-hidden md:h-72"><img src={images.city} alt="Maya's featured neon environment" className="h-full w-full object-cover opacity-50 saturate-50" /><div className="absolute inset-0 bg-gradient-to-t from-[#070a08] via-transparent to-black/30" /></section>
      <section className="relative mx-auto max-w-[1180px] px-5">
        <div className="-mt-16 flex flex-col gap-5 border-b border-white/8 pb-8 sm:flex-row sm:items-end">
          <div className="grid size-28 shrink-0 place-items-center rounded-3xl border-4 border-[#070a08] bg-gradient-to-br from-emerald-300 to-cyan-700 font-display text-2xl font-black text-black shadow-xl">MC</div>
          <div className="flex-1 pb-1"><div className="flex items-center gap-2"><h1 className="font-display text-3xl font-bold">Maya Chen</h1><BadgeCheck size={20} className="text-[#b7ff3c]" /></div><p className="mt-1 text-sm text-white/35">@mayabuilds · 3D Environment Artist</p></div>
          <div className="flex gap-2"><button className="grid size-11 place-items-center rounded-xl border border-white/10"><MessageCircle size={18} /></button><button onClick={() => setFollowing(!following)} className={`rounded-xl px-5 text-sm font-bold ${following ? "bg-white/10" : "bg-[#b7ff3c] text-black"}`}>{following ? "Following" : "Follow Maya"}</button></div>
        </div>
        <div className="grid gap-10 py-10 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="max-w-2xl text-base leading-7 text-white/65">I build atmospheric worlds for Roblox experiences, with a focus on stylized lighting, modular environments, and spaces that tell a story before the player does anything.</p>
            <div className="mt-5 flex flex-wrap gap-5 text-xs text-white/35"><span className="flex items-center gap-1.5"><MapPin size={14} />Toronto, Canada</span><span className="flex items-center gap-1.5"><Users size={14} /><strong className="text-white">4.8k</strong> followers</span><span className="flex items-center gap-1.5"><Eye size={14} />Available for work</span></div>
            <div className="mt-10 flex gap-7 border-b border-white/8">{["Work", "About", "Appreciations"].map((t) => <button onClick={() => setTab(t)} key={t} className={`border-b-2 pb-3 text-sm font-bold ${tab === t ? "border-[#b7ff3c] text-white" : "border-transparent text-white/35"}`}>{t}</button>)}</div>
            {tab === "Work" && <div className="mt-5 grid gap-4 md:grid-cols-2">{projects.filter((p) => p.creator === "Maya Chen").map((p) => <ProjectCard key={p.title} project={p} />)}</div>}
            {tab === "About" && <div className="mt-6 rounded-2xl border border-white/8 bg-[#0c110d] p-6 text-sm leading-7 text-white/50">Maya has shipped environments for 12 Roblox experiences and contributed to games with more than 80 million combined visits. Her process spans blockout, modeling, UV work, texturing, lighting, and in-Studio optimization.</div>}
            {tab === "Appreciations" && <div className="mt-6 rounded-2xl border border-white/8 bg-[#0c110d] p-10 text-center text-sm text-white/40"><Heart className="mx-auto mb-3 text-[#b7ff3c]" />2,409 appreciations across Maya’s work.</div>}
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-display font-bold">Open to work</h3><span className="size-2 rounded-full bg-[#b7ff3c] shadow-[0_0_8px_#b7ff3c]" /></div><p className="text-xs leading-5 text-white/40">Environment art, lighting, and world building for short or long-term projects.</p><button className="mt-5 w-full rounded-xl bg-[#b7ff3c] py-3 text-xs font-bold text-black">Start a conversation</button></div>
            <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5"><h3 className="font-display font-bold">Core skills</h3><div className="mt-4 flex flex-wrap gap-2">{["Blender", "Roblox Studio", "Substance", "Lighting", "Low-poly", "Optimization"].map((s) => <span key={s} className="rounded-lg border border-white/8 px-2.5 py-1.5 text-[10px] text-white/45">{s}</span>)}</div></div>
            <div className="rounded-2xl border border-white/8 bg-[#0c110d] p-5"><h3 className="font-display font-bold">Reputation</h3><div className="mt-4 grid grid-cols-3 gap-2 text-center"><span><strong className="block text-lg">12</strong><small className="text-[9px] uppercase text-white/30">Projects</small></span><span><strong className="block text-lg">4.9</strong><small className="text-[9px] uppercase text-white/30">Rating</small></span><span><strong className="block text-lg">98%</strong><small className="text-[9px] uppercase text-white/30">Response</small></span></div></div>
          </aside>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return <div className="grid min-h-[70vh] place-items-center px-5 text-center"><div><Code2 size={42} className="mx-auto text-[#b7ff3c]" /><h1 className="mt-5 font-display text-5xl font-bold">Lost in the map?</h1><p className="mt-3 text-white/40">This page hasn’t been built yet.</p><Link to="/" className="mt-6 inline-flex rounded-xl bg-[#b7ff3c] px-5 py-3 text-sm font-bold text-black">Back to explore</Link></div></div>;
}
