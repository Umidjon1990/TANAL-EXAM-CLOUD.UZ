import {
  MapPin,
  Phone,
  Users,
  Wallet,
  Clock,
  Building2,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  telegramUrl,
  telegramLabel,
  googleMapsUrl,
  yandexMapsUrl,
} from "@/lib/utils";
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
        <div className="space-y-2 border-t pt-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-foreground/40" />
            <div className="space-y-1">
              <p className="text-muted-foreground">{exam.location}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={googleMapsUrl(
                    `${exam.location}, ${exam.testCenter.city}`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <MapPin className="size-3" />
                  Google Maps
                </a>
                <a
                  href={yandexMapsUrl(
                    `${exam.location}, ${exam.testCenter.city}`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <MapPin className="size-3" />
                  Yandex
                </a>
              </div>
            </div>
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
          </div>
        </div>

        {/* Aloqa */}
        {exam.testCenter.phone || exam.testCenter.telegram ? (
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            {exam.testCenter.phone ? (
              <a
                href={`tel:${exam.testCenter.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <Phone className="size-4" />
                Qo'ng'iroq
              </a>
            ) : null}
            {exam.testCenter.telegram ? (
              <a
                href={telegramUrl(exam.testCenter.telegram)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-[#229ED9] transition-colors hover:border-[#229ED9]/40 hover:bg-[#229ED9]/5"
              >
                <Send className="size-4" />
                {telegramLabel(exam.testCenter.telegram)}
              </a>
            ) : null}
          </div>
        ) : (
          <div className="mt-auto" />
        )}
      </div>
    </div>
  );
}
