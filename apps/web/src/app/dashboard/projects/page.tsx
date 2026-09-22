import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ProjectsList } from "@/components/projects/ProjectsList";
import { Button } from "@/components/ui/button";
import { Heading1 } from "@rbxfolio/design-system";

/**
 * Projects Dashboard Page
 * Protected route - displays user's projects
 */
export default async function ProjectsPage() {
  const session = await auth.api.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Heading1>My Projects</Heading1>
          <Link href="/dashboard/projects/new">
            <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              + New Project
            </Button>
          </Link>
        </div>

        <ProjectsList />
      </div>
    </div>
  );
}
