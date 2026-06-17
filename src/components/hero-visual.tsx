"use client";

import * as motion from "motion/react-client";
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
  Users,
  Wallet,
} from "lucide-react";

/**
 * Hero uchun namunaviy "imtihon kartasi" ko'rinishi — to'g'ri, toza va tartibli.
 * Faqat bezak (aria-hidden), haqiqiy ma'lumot emas.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-sm">
      {/* Orqa fon nuri */}
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 to-emerald-400/10 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border bg-card shadow-glow"
      >
        {/* Yuqori gradient chizig'i */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-emerald-400 to-primary" />

        <div className="space-y-4 p-5">
          {/* Sana + holat */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-14 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-emerald-500/10 text-primary ring-1 ring-primary/15">
                <span className="text-xl font-bold leading-none">15</span>
                <span className="text-[10px] font-semibold uppercase">
                  iyun
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">Yakshanba</p>
                <p className="text-xs text-muted-foreground">2026-yil</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              <Clock className="size-3" />5 kun qoldi
            </span>
          </div>

          {/* Markaz */}
          <div className="flex items-center gap-1.5 font-semibold">
            <Building2 className="size-4 shrink-0 text-primary" />
            Al-Manhal o'quv markazi
          </div>

          {/* Tafsilotlar */}
          <div className="space-y-2 border-t pt-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-foreground/40" />
              Toshkent, Chilonzor tumani
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Wallet className="size-4 text-emerald-600" />
                300 000 so'm
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4" />
                50 joy
              </span>
            </div>
          </div>

          {/* Holat qatori */}
          <div className="flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" />
            Administrator tomonidan tasdiqlangan
          </div>
        </div>
      </motion.div>
    </div>
  );
}
