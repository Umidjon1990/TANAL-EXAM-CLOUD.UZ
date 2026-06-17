import { APP_NAME } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="container flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} {APP_NAME}. Barcha huquqlar himoyalangan.
        </p>
        <p>O'zbekiston bo'ylab rasmiy TANAL imtihon sanalari.</p>
      </div>
    </footer>
  );
}
