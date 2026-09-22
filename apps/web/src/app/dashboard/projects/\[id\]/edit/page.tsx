import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateEditProjectForm } from "@/components/projects/CreateEditProjectForm";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

/**
 * Edit Project Page
 * Protected route - form for editing an existing project
 */
export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await auth.api.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <CreateEditProjectForm projectId={params.id} />
      </div>
    </div>
  );
}
