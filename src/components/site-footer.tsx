import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const FOOTER_LINKS = [
  { href: "/imtihonlar", label: "Imtihonlar" },
  { href: "/markazlar", label: "Markazlar" },
  { href: "/yangiliklar", label: "Yangiliklar" },
  { href: "/haqida", label: "Loyiha haqida" },
  { href: "/aloqa", label: "Aloqa" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-5" />
              </span>
              <span className="font-bold">{APP_NAME}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              O'zbekiston bo'ylab rasmiy TANAL arab tili imtihon sanalari yagona
              ishonchli platformada.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} {APP_NAME}. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
