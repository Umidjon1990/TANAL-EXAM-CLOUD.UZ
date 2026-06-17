import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ExamFilters } from "@/components/exam-filters";
import { ExamCard } from "@/components/exam-card";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          So'rovingizga mos imtihon sanasi topilmadi.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
}

export default async function ImtihonlarPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Imtihon sanalari
            </h1>
            <p className="mt-1 text-muted-foreground">
              Tasdiqlangan TANAL imtihon sanalarini viloyat yoki markaz bo'yicha
              saralang.
            </p>
          </div>

          <div className="mb-8">
            <Suspense fallback={null}>
              <ExamFilters />
            </Suspense>
          </div>

          <Suspense
            key={`${params.region}-${params.search}`}
            fallback={
              <p className="text-center text-muted-foreground">
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
