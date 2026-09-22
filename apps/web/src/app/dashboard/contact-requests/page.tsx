import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ContactRequestInbox } from "@/components/contact/ContactRequestInbox";
import { Heading1 } from "@rbxfolio/design-system";

/**
 * Contact Requests Dashboard Page
 * Protected route - displays incoming collaboration requests
 */
export default async function ContactRequestsPage() {
  const session = await auth.api.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <Heading1 className="mb-8">Collaboration Requests</Heading1>
        <ContactRequestInbox />
      </div>
    </div>
  );
}
