"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  links: { href: string; label: string }[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        className={cn(
          "absolute inset-x-0 top-16 origin-top border-b bg-background/95 shadow-lg backdrop-blur transition-all",
          open
            ? "visible scale-y-100 opacity-100"
            : "invisible scale-y-95 opacity-0",
        )}
      >
        <nav className="container flex flex-col gap-1 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-2">
            <Link href="/kirish" onClick={() => setOpen(false)}>
              Kirish
            </Link>
          </Button>
        </nav>
      </div>
    </div>
  );
}
