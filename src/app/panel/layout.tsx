import { requireTestCenterAdmin } from "@/lib/auth/guards";
import { DashboardShell } from "@/components/dashboard-shell";
import type { NavItem } from "@/components/dashboard-nav";

const NAV_ITEMS: NavItem[] = [
  { href: "/panel", label: "Mening imtihonlarim", icon: "dashboard" },
  {
    href: "/panel/yangi",
    label: "Yangi sana taklif qilish",
    icon: "calendarPlus",
  },
  { href: "/panel/sozlamalar", label: "Sozlamalar", icon: "settings" },
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
