import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedNews } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Yangiliklar",
  description: "TANAL imtihon platformasi yangiliklari va e'lonlari.",
};

export const dynamic = "force-dynamic";

export default async function YangiliklarPage() {
  const news = await getPublishedNews();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Yangiliklar</h1>
            <p className="mt-1 text-muted-foreground">
              Platforma va imtihonlarga oid so'nggi xabarlar.
            </p>
          </div>

          {news.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="Yangiliklar yo'q"
              description="Hozircha nashr qilingan yangiliklar mavjud emas."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <Link key={item.id} href={`/yangiliklar/${item.slug}`}>
                  <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
                    <CardHeader>
                      <p className="text-xs text-muted-foreground">
                        {item.publishedAt ? formatDate(item.publishedAt) : ""}
                      </p>
                      <CardTitle className="text-lg leading-snug group-hover:text-primary">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      {item.excerpt ? (
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {item.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Batafsil <ArrowRight className="size-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
