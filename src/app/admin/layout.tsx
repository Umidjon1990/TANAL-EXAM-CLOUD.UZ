import { LayoutDashboard, Building2, Users } from "lucide-react";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { DashboardShell } from "@/components/dashboard-shell";
import type { NavItem } from "@/components/dashboard-nav";

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Boshqaruv paneli", icon: LayoutDashboard },
  { href: "/admin/markazlar", label: "Test markazlari", icon: Building2 },
  { href: "/admin/foydalanuvchilar", label: "Foydalanuvchilar", icon: Users },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSuperAdmin();

  return (
    <DashboardShell
      navItems={NAV_ITEMS}
      title="Bosh admin"
      subtitle="Boshqaruv paneli"
      userLabel={`@${session.username}`}
    >
      {children}
    </DashboardShell>
  );
}
