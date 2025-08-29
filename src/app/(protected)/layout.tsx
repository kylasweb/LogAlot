import { MainLayout } from "@/components/layout/main-layout";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getUser();
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    // In a real app, you'd redirect to a login page or an unauthorized page
    // For this demo, we'll redirect to the home page.
    redirect("/");
  }

  return <MainLayout>{children}</MainLayout>;
}
