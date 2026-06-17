import { Suspense } from "react";
import type { Metadata } from "next";
import { CalendarSearch } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ExamFilters } from "@/components/exam-filters";
import { ExamCard } from "@/components/exam-card";
import { FadeIn } from "@/components/fade-in";
import { TiltCard } from "@/components/tilt-card";
import { EmptyState } from "@/components/empty-state";
import { getPublicExams } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Imtihon sanalari",
  description:
    "O'zbekiston bo'ylab tasdiqlangan TANAL arab tili imtihon sanalari ro'yxati.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ region?: string; search?: string }>;
}

async function ExamList({
  region,
  search,
}: {
  region?: string;
  search?: string;
}) {
  const exams = await getPublicExams({ region, search });

  if (exams.length === 0) {
    return (
      <EmptyState
        icon={CalendarSearch}
        title="Mos imtihon topilmadi"
        description="So'rovingizga mos tasdiqlangan imtihon sanasi yo'q. Filtrlarni o'zgartirib ko'ring."
      />
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{exams.length} ta</span>{" "}
        tasdiqlangan sana topildi
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam, i) => (
          <FadeIn key={exam.id} delay={Math.min(i * 0.04, 0.4)}>
            <TiltCard>
              <ExamCard exam={exam} />
            </TiltCard>
          </FadeIn>
        ))}
      </div>
    </>
  );
}

export default async function ImtihonlarPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Sarlavha bandi */}
        <div className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.06] to-background" />
          <div className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
          <div className="container py-12 sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Imtihon sanalari
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Tasdiqlangan TANAL imtihon sanalarini viloyat yoki markaz bo'yicha
              saralang va sizga eng yaqinini toping.
            </p>
          </div>
        </div>

        <div className="container py-8">
          {/* Filtrlar — yopishqoq */}
          <div className="sticky top-16 z-20 mb-8 rounded-xl border bg-background/80 p-3 shadow-sm backdrop-blur">
            <Suspense fallback={null}>
              <ExamFilters />
            </Suspense>
          </div>

          <Suspense
            key={`${params.region}-${params.search}`}
            fallback={
              <p className="py-12 text-center text-muted-foreground">
                Yuklanmoqda...
              </p>
            }
          >
            <ExamList region={params.region} search={params.search} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
