import { MapPin, Phone, Users, Wallet, Clock, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { PublicExam } from "@/lib/queries";

const DAY_MS = 24 * 60 * 60 * 1000;

export function ExamCard({ exam }: { exam: PublicExam }) {
  const date = new Date(exam.examDate);
  const day = new Intl.DateTimeFormat("uz-UZ", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("uz-UZ", { month: "short" })
    .format(date)
    .replace(".", "");
  const weekday = new Intl.DateTimeFormat("uz-UZ", { weekday: "long" }).format(
    date,
  );
  const year = date.getFullYear();

  const daysLeft = Math.ceil((date.getTime() - Date.now()) / DAY_MS);
  const countdown =
    daysLeft <= 0
      ? "Bugun"
      : daysLeft === 1
        ? "Ertaga"
        : `${daysLeft} kun qoldi`;
  const soon = daysLeft <= 7;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
      {/* Yuqori gradient chizig'i */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-emerald-400 to-primary" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Sana bloki + hisoblagich */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary ring-1 ring-primary/15">
              <span className="text-2xl font-bold leading-none">{day}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                {month}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold capitalize text-foreground">
                {weekday}
              </p>
              <p className="text-xs text-muted-foreground">{year}-yil</p>
            </div>
          </div>

          <Badge
            variant={soon ? "default" : "secondary"}
            className="shrink-0 gap-1"
          >
            <Clock className="size-3" />
            {countdown}
          </Badge>
        </div>

        {/* Markaz */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-base font-semibold leading-snug">
            <Building2 className="size-4 shrink-0 text-primary" />
            {exam.testCenter.name}
          </div>
          <p className="pl-[22px] text-sm text-muted-foreground">
            {exam.testCenter.region}, {exam.testCenter.city}
          </p>
        </div>

        {/* Tafsilotlar */}
        <div className="mt-auto space-y-2 border-t pt-4 text-sm">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-foreground/40" />
            <span>{exam.location}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {exam.price !== null ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Wallet className="size-4 text-emerald-600" />
                {formatPrice(exam.price)}
              </span>
            ) : null}
            {exam.capacity ? (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Users className="size-4" />
                {exam.capacity} joy
              </span>
            ) : null}
            {exam.testCenter.phone ? (
              <a
                href={`tel:${exam.testCenter.phone}`}
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="size-4" />
                {exam.testCenter.phone}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
