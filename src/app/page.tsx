import Link from "next/link";
import {
  CalendarSearch,
  ShieldCheck,
  Building2,
  CalendarCheck,
  MapPin,
  FileEdit,
  BadgeCheck,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { ExamCard } from "@/components/exam-card";
import { FadeIn } from "@/components/fade-in";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { getPublicCenters, getPublicExams } from "@/lib/queries";

export const dynamic = "force-dynamic";

const FEATURES = [
  {
    icon: CalendarSearch,
    title: "Yagona kalendar",
    description:
      "Barcha test markazlarining tasdiqlangan imtihon sanalari bir joyda.",
  },
  {
    icon: ShieldCheck,
    title: "Faqat tasdiqlangan ma'lumot",
    description:
      "Har bir sana bosh administrator tomonidan tekshiriladi va tasdiqlanadi.",
  },
  {
    icon: Building2,
    title: "Vakolatli markazlar",
    description:
      "Faqat rasmiy ro'yxatdan o'tgan test markazlari ma'lumot kiritadi.",
  },
];

const STEPS = [
  {
    icon: FileEdit,
    title: "Markaz taklif qiladi",
    description: "Vakolatli test markazi imtihon sanasini tizimga kiritadi.",
  },
  {
    icon: BadgeCheck,
    title: "Administrator tasdiqlaydi",
    description: "Bosh administrator sanani tekshirib, tasdiqlaydi.",
  },
  {
    icon: Megaphone,
    title: "Hammaga e'lon qilinadi",
    description: "Tasdiqlangan sana saytda va Telegram kanalda paydo bo'ladi.",
  },
];

export default async function HomePage() {
  const [exams, centers] = await Promise.all([
    getPublicExams(),
    getPublicCenters(),
  ]);
  const upcoming = exams.slice(0, 6);
  const regionCount = new Set(centers.map((c) => c.region)).size;

  const stats = [
    { icon: CalendarCheck, value: exams.length, label: "Tasdiqlangan sana" },
    { icon: Building2, value: centers.length, label: "Test markazi" },
    { icon: MapPin, value: regionCount, label: "Viloyat" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero approvedCount={exams.length} />

        {/* Statistika lentasi */}
        <section className="border-b bg-muted/30">
          <div className="container grid grid-cols-3 divide-x py-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 px-2 text-center"
              >
                <s.icon className="mb-1 size-5 text-primary sm:size-6" />
                <span className="text-2xl font-bold tabular-nums sm:text-4xl">
                  {s.value}
                </span>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Yaqin imtihonlar */}
        <section className="container py-14 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Yaqinlashayotgan imtihonlar
              </h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Eng yaqin tasdiqlangan sanalar
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/imtihonlar">
                Barchasini ko'rish
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarSearch}
              title="Hozircha imtihon sanalari yo'q"
              description="Tasdiqlangan sanalar paydo bo'lishi bilan shu yerda ko'rinadi."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((exam, i) => (
                <FadeIn key={exam.id} delay={i * 0.06}>
                  <ExamCard exam={exam} />
                </FadeIn>
              ))}
            </div>
          )}
        </section>

        {/* Qanday ishlaydi */}
        <section className="border-y bg-muted/30">
          <div className="container py-14 sm:py-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Qanday ishlaydi?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Uch oddiy bosqichda ishonchli imtihon ma'lumoti
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <FadeIn key={step.title} delay={i * 0.1}>
                  <div className="relative h-full rounded-2xl border bg-card p-6 text-center">
                    <span className="absolute -top-3 left-1/2 flex size-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="mx-auto mb-4 mt-2 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-6" />
                    </span>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Xususiyatlar */}
        <section className="container py-14 sm:py-20">
          <div className="grid gap-5 sm:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-emerald-500/10 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-20">
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-emerald-600 px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
            <div className="bg-grid absolute inset-0 opacity-20" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Imtihon sanasini qidiryapsizmi?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-primary-foreground/90">
                Viloyatingiz bo'yicha eng yaqin TANAL imtihon sanasini bir necha
                soniyada toping. Ro'yxatdan o'tish shart emas.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="mt-6 shadow-lg"
              >
                <Link href="/imtihonlar">
                  <CalendarSearch className="size-4" />
                  Imtihonlarni ko'rish
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
