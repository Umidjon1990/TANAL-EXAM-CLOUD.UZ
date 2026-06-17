import Link from "next/link";
import { MapPin } from "lucide-react";

/**
 * Viloyat bo'yicha tezkor filtr chiplari — imtihonlar sahifasiga yo'naltiradi.
 */
export function RegionChips({ regions }: { regions: string[] }) {
  if (regions.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {regions.map((region) => (
        <Link
          key={region}
          href={`/imtihonlar?region=${encodeURIComponent(region)}`}
          className="inline-flex items-center gap-1.5 rounded-full border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-soft"
        >
          <MapPin className="size-3.5" />
          {region}
        </Link>
      ))}
    </div>
  );
}
