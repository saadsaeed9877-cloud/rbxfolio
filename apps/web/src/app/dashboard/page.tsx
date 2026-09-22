import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiUrl } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth-server";

async function fetchDashboardStats(sessionToken: string) {
  const cookie = `better-auth.session_token=${sessionToken}`;

  const [projectsRes, requestsRes, profileRes] = await Promise.allSettled([
    fetch(getApiUrl("/users/me/projects"), {
      headers: { cookie },
      cache: "no-store",
    }),
    fetch(getApiUrl("/users/me/contact-requests/count"), {
      headers: { cookie },
      cache: "no-store",
    }),
    fetch(getApiUrl("/users/me/profile"), {
      headers: { cookie },
      cache: "no-store",
    }),
  ]);

  const projects =
    projectsRes.status === "fulfilled" && projectsRes.value.ok
      ? await projectsRes.value.json()
      : [];
  const requests =
    requestsRes.status === "fulfilled" && requestsRes.value.ok
      ? await requestsRes.value.json()
      : { pending: 0 };
  const profile =
    profileRes.status === "fulfilled" && profileRes.value.ok
      ? await profileRes.value.json()
      : null;

  return { projects, requests, profile };
}

export default async function DashboardPage() {
  const session = await getSession();
  const stats = await fetchDashboardStats(session!.session.token);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back, {session!.user.name ?? session!.user.email}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.requests.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Public profile</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.profile ? (
              <Button asChild size="sm" variant="outline">
                <Link href={`/u/${stats.profile.username}`} target="_blank">
                  View portfolio
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/dashboard/profile">Set up profile</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
