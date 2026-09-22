import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateEditProjectForm } from "@/components/projects/CreateEditProjectForm";

/**
 * New Project Page
 * Protected route - form for creating a new project
 */
export default async function NewProjectPage() {
  const session = await auth.api.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <CreateEditProjectForm onSuccess={() => {
          // Redirect handled by client component
        }} />
      </div>
    </div>
  );
}
