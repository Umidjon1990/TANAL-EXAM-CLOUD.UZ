"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Newspaper,
  BarChart3,
  Settings,
  CalendarPlus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Ikonkalar klient tomonda saqlanadi — Server Component'dan faqat matn
// (kalit) uzatiladi, funksiya emas (RSC serializatsiyasi uchun).
const ICONS = {
  dashboard: LayoutDashboard,
  building: Building2,
  users: Users,
  news: Newspaper,
  stats: BarChart3,
  settings: Settings,
  calendarPlus: CalendarPlus,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

export interface NavItem {
  href: string;
  label: string;
  icon: IconKey;
}

export function DashboardNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const active =
          pathname === item.href ||
          (item.href !== "/admin" &&
            item.href !== "/panel" &&
            pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
