import Link from "next/link";
import { CalendarSearch, ShieldCheck, Building2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { ExamCard } from "@/components/exam-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicExams } from "@/lib/queries";

// Ma'lumotlar bazasidan jonli o'qiladi (build vaqtida DB talab qilinmaydi)
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

export default async function HomePage() {
  const exams = await getPublicExams();
  const upcoming = exams.slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero approvedCount={exams.length} />

        {/* Xususiyatlar */}
        <section className="container py-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {f.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Yaqin imtihonlar */}
        <section className="container pb-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Yaqinlashayotgan imtihonlar
              </h2>
              <p className="text-sm text-muted-foreground">
                Eng yaqin tasdiqlangan sanalar
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/imtihonlar">Barchasi</Link>
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Hozircha tasdiqlangan imtihon sanalari mavjud emas.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
