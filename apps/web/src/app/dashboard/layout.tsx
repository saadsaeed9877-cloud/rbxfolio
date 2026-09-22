import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
