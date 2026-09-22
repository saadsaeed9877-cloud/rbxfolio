import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { EditProfileForm } from "@/components/profile/EditProfileForm";

/**
 * Profile Edit Page
 * Protected route - requires authentication
 */
export default async function ProfilePage() {
  const session = await auth.api.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <EditProfileForm />
      </div>
    </div>
  );
}
