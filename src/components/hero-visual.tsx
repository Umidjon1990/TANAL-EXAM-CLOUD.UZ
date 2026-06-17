"use client";

import * as motion from "motion/react-client";
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
} from "lucide-react";

/**
 * Hero uchun jonli "imtihon kartasi" mockup'i — suzuvchi animatsiya bilan.
 * Faqat bezak (aria-hidden), haqiqiy ma'lumot emas.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md">
      {/* Orqa fon nuri */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 to-emerald-400/10 blur-2xl" />

      {/* Asosiy karta */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-2xl border bg-card p-5 shadow-glow"
      >
        <div className="-mx-5 -mt-5 mb-4 h-1.5 rounded-t-2xl bg-gradient-to-r from-primary via-emerald-400 to-primary" />
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-14 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-emerald-500/10 text-primary ring-1 ring-primary/15">
              <span className="text-xl font-bold leading-none">15</span>
              <span className="text-[10px] font-semibold uppercase">iyun</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Yakshanba</p>
              <p className="text-xs text-muted-foreground">2026-yil</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
            <Clock className="size-3" />5 kun qoldi
          </span>
        </div>

        <div className="mt-4 flex items-center gap-1.5 font-semibold">
          <Building2 className="size-4 text-primary" />
          Al-Manhal o'quv markazi
        </div>
        <div className="mt-3 space-y-2 border-t pt-3 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="size-4" /> Toshkent, Chilonzor
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4" /> 300 000 so'm · 50 joy
          </p>
        </div>
      </motion.div>

      {/* Suzuvchi kichik "tasdiqlandi" rozetkasi */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { delay: 0.4, duration: 0.4 },
          scale: { delay: 0.4, duration: 0.4 },
          y: { delay: 1, duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -right-3 -top-4 flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold shadow-soft"
      >
        <CheckCircle2 className="size-4 text-primary" />
        Tasdiqlandi
      </motion.div>

      {/* Suzuvchi pastki mini-karta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 0.6, duration: 0.5 },
          y: { delay: 1.2, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -bottom-6 -left-4 w-44 rounded-xl border bg-card/95 p-3 shadow-soft backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <MapPin className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold">14 viloyat</p>
            <p className="text-[11px] text-muted-foreground">bo'ylab</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
