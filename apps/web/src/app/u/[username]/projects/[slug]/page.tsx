import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { apiFetchServer } from "@/lib/api";
import { formatRole, getMediaUrl } from "@/lib/utils";

interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  completionStatus: string;
  tags: string[];
  media: { id: string; type: string; url: string }[];
  owner: { username: string; displayName: string } | null;
}

async function findProject(username: string, slug: string) {
  const profile = await apiFetchServer<{ projects: { id: string; slug: string }[] }>(
    `/users/${username}`,
  );
  const match = profile.projects.find((p) => p.slug === slug);
  if (!match) return null;
  return apiFetchServer<ProjectDetail>(`/projects/${match.id}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  try {
    const project = await findProject(username, slug);
    if (!project) return { title: "Project not found" };
    return {
      title: project.title,
      description: project.shortDescription,
    };
  } catch {
    return { title: "Project not found" };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  let project: ProjectDetail;
  try {
    const result = await findProject(username, slug);
    if (!result) notFound();
    project = result;
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
        <Link href={`/u/${username}`} className="text-sm text-accent hover:underline">
          ← Back to {project.owner?.displayName ?? username}
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{project.title}</h1>
        <p className="mt-2 text-muted-foreground">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded bg-secondary px-2 py-1 text-xs">{tag}</span>
          ))}
          <span className="rounded border border-border px-2 py-1 text-xs">
            {project.completionStatus.replace("_", " ").toLowerCase()}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {project.media.map((m) => {
            const url = getMediaUrl(m.url);
            if (!url) return null;
            return (
              <div key={m.id} className="overflow-hidden rounded-lg bg-secondary">
                {m.type === "VIDEO" ? (
                  <video src={url} controls className="w-full" />
                ) : (
                  <div className="relative aspect-video">
                    <Image src={url} alt={project.title} fill className="object-contain" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {project.detailedDescription && (
          <div className="prose prose-invert mt-8 max-w-none">
            <p className="whitespace-pre-wrap text-muted-foreground">
              {project.detailedDescription}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
