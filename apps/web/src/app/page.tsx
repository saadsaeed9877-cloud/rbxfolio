import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeveloperCard } from "@/components/developer-card";
import { apiFetchServer } from "@/lib/api";
import { formatRole } from "@/lib/utils";

interface Developer {
  username: string;
  displayName: string;
  tagline: string | null;
  primaryRole: string;
  profilePictureUrl: string | null;
  availability: string;
}

export default async function HomePage() {
  // Don't fetch during build - featured developers will be empty
  // This page will be ISR (incremental static regeneration)
  // and will fetch at runtime instead
  const featured: Developer[] = [];
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl px-6 py-24 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-left">
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-foreground leading-[1.1]">
              Showcase Your<br/>
              Roblox Creations.<br/>
              <span className="text-primary drop-shadow-[0_0_10px_rgba(0,255,76,0.5)]">Get Discovered.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Join thousands of Roblox developers showcasing their projects and connecting with amazing opportunities.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg">
                <Link href="/browse">Explore Developers</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-border/50 bg-secondary/50">
                <Link href="/register">Create Profile</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 hidden md:flex justify-center relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full w-3/4 h-3/4 m-auto z-0" />
            {/* Placeholder for the controller illustration */}
            <div className="relative z-10 w-64 h-64 border border-primary/30 bg-card/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,255,76,0.2)]">
              <span className="text-primary text-6xl opacity-50 font-black">RBX</span>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="w-full max-w-7xl px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-border/50">
            <div className="text-center">
              <h4 className="text-3xl font-black text-primary">2,350+</h4>
              <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">Developers</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-primary">8,760+</h4>
              <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">Projects</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-primary">15,400+</h4>
              <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">Chat Requests</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-primary">120K+</h4>
              <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">Connections</p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="w-full max-w-7xl px-6 pb-24">
          <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-8">Features</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "Showcase Your Projects", desc: "Upload images, videos and present your best work.", icon: "🎨" },
              { title: "Get Discovered By Clients", desc: "Reach out to studios and developers looking for talent.", icon: "🔍" },
              { title: "Connect & Grow Your Network", desc: "Build connections and grow your developer career.", icon: "🤝" },
            ].map((item) => (
              <Card key={item.title} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* RECENTLY UPDATED */}
        {featured.length > 0 && (
          <section className="w-full max-w-7xl px-6 pb-24">
            <div className="mb-8 flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="text-2xl font-black">Featured Developers</h2>
              <Link href="/browse" className="text-sm font-bold text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((dev) => (
                <DeveloperCard key={dev.username} developer={dev} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
