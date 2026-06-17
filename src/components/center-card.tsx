import { MapPin, Phone, CalendarCheck, Building2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { telegramUrl, telegramLabel } from "@/lib/utils";
import type { PublicCenter } from "@/lib/queries";

export function CenterCard({ center }: { center: PublicCenter }) {
  const count = center._count.examDates;
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-emerald-500/10 text-primary">
          <Building2 className="size-6" />
        </span>
        <Badge variant={count > 0 ? "success" : "secondary"} className="gap-1">
          <CalendarCheck className="size-3" />
          {count > 0 ? `${count} ta sana` : "Sana yo'q"}
        </Badge>
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug">
        {center.name}
      </h3>

      <div className="mt-auto space-y-2 pt-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-foreground/40" />
          <span>
            {center.region}, {center.city}
            {center.address ? (
              <span className="block text-xs">{center.address}</span>
            ) : null}
          </span>
        </div>
        {center.phone ? (
          <a
            href={`tel:${center.phone}`}
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Phone className="size-4 text-foreground/40" />
            {center.phone}
          </a>
        ) : null}
        {center.telegram ? (
          <a
            href={telegramUrl(center.telegram)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[#229ED9] transition-colors hover:underline"
          >
            <Send className="size-4" />
            {telegramLabel(center.telegram)}
          </a>
        ) : null}
      </div>
    </div>
  );
}
