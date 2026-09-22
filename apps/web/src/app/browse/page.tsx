import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DeveloperCard } from "@/components/developer-card";
import { apiFetchServer } from "@/lib/api";
import { formatRole } from "@/lib/utils";
import Link from "next/link";

interface BrowseResult {
  data: {
    username: string;
    displayName: string;
    tagline: string | null;
    primaryRole: string;
    profilePictureUrl: string | null;
    availability: string;
  }[];
  pagination: { page: number; total: number; pages: number };
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; role?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.sort) query.set("sort", params.sort);
  if (params.role) query.set("role", params.role);
  if (params.page) query.set("page", params.page);

  let result: BrowseResult = { data: [], pagination: { page: 1, total: 0, pages: 0 } };
  try {
    result = await apiFetchServer<BrowseResult>(`/browse?${query.toString()}`);
  } catch {
    // empty
  }

  const roles = ["BUILDER", "SCRIPTER", "UI_DESIGNER", "ANIMATOR", "MODELER", "VFX_ARTIST"];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold">Browse Developers</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/browse" className={`rounded-full border px-3 py-1 text-sm ${!params.role ? "bg-primary text-primary-foreground" : ""}`}>
            All
          </Link>
          {roles.map((role) => (
            <Link
              key={role}
              href={`/browse?role=${role}${params.sort ? `&sort=${params.sort}` : ""}`}
              className={`rounded-full border px-3 py-1 text-sm ${params.role === role ? "bg-primary text-primary-foreground" : ""}`}
            >
              {formatRole(role)}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Link href={`/browse?sort=newest${params.role ? `&role=${params.role}` : ""}`} className={`text-sm ${params.sort !== "updated" ? "text-accent" : "text-muted-foreground"}`}>
            Newest
          </Link>
          <Link href={`/browse?sort=updated${params.role ? `&role=${params.role}` : ""}`} className={`text-sm ${params.sort === "updated" ? "text-accent" : "text-muted-foreground"}`}>
            Recently updated
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map((dev) => (
            <DeveloperCard key={dev.username} developer={dev} />
          ))}
        </div>

        {result.data.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">No developers found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
