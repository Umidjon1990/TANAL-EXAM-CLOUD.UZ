import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { APP_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/imtihonlar", label: "Imtihonlar" },
  { href: "/markazlar", label: "Markazlar" },
  { href: "/yangiliklar", label: "Yangiliklar" },
  { href: "/haqida", label: "Loyiha haqida" },
  { href: "/aloqa", label: "Aloqa" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-sm font-bold leading-tight sm:text-base">
            {APP_NAME}
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/kirish">Kirish</Link>
          </Button>
        </nav>
        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
