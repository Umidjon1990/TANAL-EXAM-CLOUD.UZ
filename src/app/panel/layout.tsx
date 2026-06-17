import { LayoutDashboard, CalendarPlus } from "lucide-react";
import { requireTestCenterAdmin } from "@/lib/auth/guards";
import { DashboardShell } from "@/components/dashboard-shell";
import type { NavItem } from "@/components/dashboard-nav";

const NAV_ITEMS: NavItem[] = [
  { href: "/panel", label: "Mening imtihonlarim", icon: LayoutDashboard },
  { href: "/panel/yangi", label: "Yangi sana taklif qilish", icon: CalendarPlus },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireTestCenterAdmin();

  return (
    <DashboardShell
      navItems={NAV_ITEMS}
      title="Test markazi"
      subtitle="Admin panel"
      userLabel={`@${session.username}`}
    >
      {children}
    </DashboardShell>
  );
}
