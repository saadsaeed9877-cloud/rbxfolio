"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaUrl } from "@/lib/utils";
import Image from "next/image";

interface ProjectDetail {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  visibility: string;
  completionStatus: string;
  tags: string[];
  media: { id: string; type: string; url: string; sortOrder: number }[];
}

export default function ProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch<ProjectDetail>(`/projects/${id}`, { auth: true }).then(setProject);
  }, [id]);

  async function save() {
    if (!project) return;
    await apiFetch(`/users/me/projects/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({
        title: project.title,
        shortDescription: project.shortDescription,
        detailedDescription: project.detailedDescription,
        visibility: project.visibility,
        completionStatus: project.completionStatus,
        tags: project.tags,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function uploadMedia(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    await apiFetch(`/users/me/projects/${id}/media`, {
      method: "POST",
      auth: true,
      body: formData,
    });
    const updated = await apiFetch<ProjectDetail>(`/projects/${id}`, { auth: true });
    setProject(updated);
  }

  async function deleteMedia(mediaId: string) {
    await apiFetch(`/users/me/projects/${id}/media/${mediaId}`, {
      method: "DELETE",
      auth: true,
    });
    setProject((p) => p && { ...p, media: p.media.filter((m) => m.id !== mediaId) });
  }

  if (!project) return <main className="p-8">Loading...</main>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Short description</Label>
              <Textarea value={project.shortDescription} onChange={(e) => setProject({ ...project, shortDescription: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Detailed description</Label>
              <Textarea rows={6} value={project.detailedDescription} onChange={(e) => setProject({ ...project, detailedDescription: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <select value={project.visibility} onChange={(e) => setProject({ ...project, visibility: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select value={project.completionStatus} onChange={(e) => setProject({ ...project, completionStatus: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={project.tags.join(", ")} onChange={(e) => setProject({ ...project, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
            </div>
            <Button onClick={save}>{saved ? "Saved!" : "Save changes"}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Media gallery</CardTitle></CardHeader>
          <CardContent>
            <Input type="file" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0])} />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {project.media.map((m) => {
                const url = getMediaUrl(m.url);
                return (
                  <div key={m.id} className="relative aspect-video overflow-hidden rounded bg-secondary">
                    {m.type === "VIDEO" ? (
                      url && <video src={url} controls className="h-full w-full object-cover" />
                    ) : (
                      url && <Image src={url} alt="" fill className="object-cover" />
                    )}
                    <Button size="sm" variant="destructive" className="absolute right-2 top-2" onClick={() => deleteMedia(m.id)}>Remove</Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
