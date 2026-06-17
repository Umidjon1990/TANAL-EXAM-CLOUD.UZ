"use client";

import Link from "next/link";
import * as motion from "motion/react-client";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero({ approvedCount }: { approvedCount: number }) {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background">
      <div className="container py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <CalendarCheck className="size-4 text-primary" />
            Rasmiy imtihon sanalari yagona platformada
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            TANAL arab tili sertifikat imtihonlari
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            O'zbekiston bo'ylab vakolatli test markazlarining tasdiqlangan
            imtihon sanalarini bir joyda kuzating. Ro'yxatdan o'tish shart emas.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/imtihonlar">
                Imtihon sanalarini ko'rish
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {approvedCount > 0 ? (
              <p className="text-sm text-muted-foreground">
                Hozirda{" "}
                <span className="font-semibold text-foreground">
                  {approvedCount} ta
                </span>{" "}
                tasdiqlangan sana mavjud
              </p>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
