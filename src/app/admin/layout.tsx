import { requireSuperAdmin } from "@/lib/auth/guards";
import { DashboardShell } from "@/components/dashboard-shell";
import type { NavItem } from "@/components/dashboard-nav";

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Boshqaruv paneli", icon: "dashboard" },
  { href: "/admin/markazlar", label: "Test markazlari", icon: "building" },
  { href: "/admin/foydalanuvchilar", label: "Foydalanuvchilar", icon: "users" },
  { href: "/admin/yangiliklar", label: "Yangiliklar", icon: "news" },
  { href: "/admin/statistika", label: "Statistika", icon: "stats" },
  { href: "/admin/sozlamalar", label: "Sozlamalar", icon: "settings" },
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
