"use client";

import Link from "next/link";
import * as motion from "motion/react-client";
import { ArrowRight, CalendarCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero({ approvedCount }: { approvedCount: number }) {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Fon qatlamlari — gradient mesh + nuqtali naqsh */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.07] via-background to-background" />
      <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute -top-24 left-1/2 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <div className="container py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 shadow-sm">
            <CalendarCheck className="size-4 text-primary" />
            Rasmiy imtihon sanalari yagona platformada
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            TANAL arab tili sertifikat{" "}
            <span className="text-gradient">imtihonlari</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            O'zbekiston bo'ylab vakolatli test markazlarining tasdiqlangan
            imtihon sanalarini bir joyda kuzating. Ro'yxatdan o'tish shart emas.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href="/imtihonlar">
                <Search className="size-4" />
                Imtihon sanalarini ko'rish
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/markazlar">
                Test markazlari
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          {approvedCount > 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">
              Hozirda{" "}
              <span className="font-semibold text-foreground">
                {approvedCount} ta
              </span>{" "}
              tasdiqlangan sana mavjud
            </p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
