import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { DashboardNav, type NavItem } from "@/components/dashboard-nav";

interface DashboardShellProps {
  navItems: NavItem[];
  title: string;
  subtitle: string;
  userLabel: string;
  children: React.ReactNode;
}

export function DashboardShell({
  navItems,
  title,
  subtitle,
  userLabel,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      {/* Yon panel */}
      <aside className="flex flex-col border-b bg-background lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <DashboardNav items={navItems} />

        <div className="mt-auto border-t p-3">
          <p className="px-3 pb-2 text-xs text-muted-foreground">{userLabel}</p>
          <LogoutButton />
          <Link
            href="/"
            className="mt-1 block px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            Saytga qaytish
          </Link>
        </div>
      </aside>

      {/* Asosiy kontent */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
