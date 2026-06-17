import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CenterCard } from "@/components/center-card";
import { FadeIn } from "@/components/fade-in";
import { TiltCard } from "@/components/tilt-card";
import { EmptyState } from "@/components/empty-state";
import { getPublicCenters } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Test markazlari",
  description:
    "O'zbekiston bo'ylab vakolatli TANAL test markazlari ro'yxati va aloqa ma'lumotlari.",
};

export const dynamic = "force-dynamic";

export default async function MarkazlarPage() {
  const centers = await getPublicCenters();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Test markazlari
            </h1>
            <p className="mt-1 text-muted-foreground">
              Vakolatli markazlar va ulardagi yaqin tasdiqlangan imtihonlar
              soni.
            </p>
          </div>

          {centers.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="Markazlar topilmadi"
              description="Hozircha faol test markazlari mavjud emas."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {centers.map((center, i) => (
                <FadeIn key={center.id} delay={Math.min(i * 0.04, 0.4)}>
                  <TiltCard>
                    <CenterCard center={center} />
                  </TiltCard>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
