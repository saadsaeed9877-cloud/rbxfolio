import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactRequestForm } from "@/components/contact-request-form";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetchServer } from "@/lib/api";
import { formatRole, getMediaUrl } from "@/lib/utils";

interface PublicProfile {
  displayName: string;
  username: string;
  profilePictureUrl: string | null;
  bannerUrl: string | null;
  tagline: string | null;
  bio: string | null;
  primaryRole: string;
  secondaryRoles: string[];
  experienceLevel: string;
  location: string | null;
  languages: string[];
  availability: string;
  projects: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnailUrl: string | null;
    completionStatus: string;
    tags: string[];
  }[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  try {
    const profile = await apiFetchServer<PublicProfile>(`/users/${username}`);
    return {
      title: `${profile.displayName} — Roblox ${formatRole(profile.primaryRole)}`,
      description: profile.tagline ?? profile.bio ?? `${profile.displayName}'s Roblox portfolio`,
    };
  } catch {
    return { title: "Profile not found" };
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  let profile: PublicProfile;
  try {
    profile = await apiFetchServer<PublicProfile>(`/users/${username}`);
  } catch {
    notFound();
  }

  const avatarUrl = getMediaUrl(profile.profilePictureUrl);
  const bannerUrl = getMediaUrl(profile.bannerUrl);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="relative h-48 w-full bg-secondary sm:h-64">
          {bannerUrl && (
            <Image src={bannerUrl} alt="" fill className="object-cover" priority />
          )}
        </div>
        <div className="mx-auto max-w-4xl px-4">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-secondary">
              {avatarUrl && <Image src={avatarUrl} alt={profile.displayName} fill className="object-cover" />}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <ContactRequestForm username={profile.username} />
          </div>

          {profile.tagline && (
            <p className="mt-4 text-lg text-accent">{profile.tagline}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              {formatRole(profile.primaryRole)}
            </span>
            {profile.secondaryRoles?.map((role) => (
              <span key={role} className="rounded-full bg-secondary px-3 py-1 text-sm">
                {formatRole(role)}
              </span>
            ))}
            <span className="rounded-full border border-border px-3 py-1 text-sm">
              {profile.experienceLevel.replace("_", " ").toLowerCase()}
            </span>
          </div>

          {profile.bio && (
            <p className="mt-6 whitespace-pre-wrap text-muted-foreground">{profile.bio}</p>
          )}

          <section className="mt-12">
            <h2 className="text-xl font-bold">Projects</h2>
            {profile.projects.length === 0 ? (
              <p className="mt-4 text-muted-foreground">No public projects yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {profile.projects.map((project) => {
                  const thumb = getMediaUrl(project.thumbnailUrl);
                  return (
                    <Link key={project.id} href={`/u/${username}/projects/${project.slug}`}>
                      <Card className="h-full transition-colors hover:border-accent/50">
                        <div className="relative aspect-video overflow-hidden rounded-t-lg bg-secondary">
                          {thumb && <Image src={thumb} alt={project.title} fill className="object-cover" />}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {project.shortDescription}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs">{tag}</span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
