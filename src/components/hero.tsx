"use client";

import Link from "next/link";
import * as motion from "motion/react-client";
import { ArrowRight, CalendarCheck, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/hero-visual";
import { TiltCard } from "@/components/tilt-card";

export function Hero({ approvedCount }: { approvedCount: number }) {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Fon qatlamlari */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.07] via-background to-background" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
      <div className="absolute -top-24 right-0 -z-10 h-72 w-[36rem] rounded-full bg-primary/15 blur-3xl" />

      <div className="container grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:py-28">
        {/* Chap: matn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <div className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 shadow-sm">
            <ShieldCheck className="size-4 text-primary" />
            Faqat rasmiy va tasdiqlangan sanalar
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            TANAL arab tili imtihonlari{" "}
            <span className="text-gradient">yagona platformada</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground lg:mx-0">
            O'zbekiston bo'ylab vakolatli test markazlarining tasdiqlangan
            imtihon sanalarini bir joyda kuzating. Ro'yxatdan o'tish shart emas.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Button asChild size="lg" className="w-full shadow-glow sm:w-auto">
              <Link href="/imtihonlar">
                <Search className="size-4" />
                Imtihon sanalarini topish
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Link href="/markazlar">
                Test markazlari
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {approvedCount > 0 ? (
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck className="size-4 text-primary" />
              Hozirda{" "}
              <span className="font-semibold text-foreground">
                {approvedCount} ta
              </span>{" "}
              tasdiqlangan sana mavjud
            </div>
          ) : null}
        </motion.div>

        {/* O'ng: toza karta ko'rinishi */}
        <div className="lg:pl-8">
          <TiltCard max={10}>
            <HeroVisual />
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
