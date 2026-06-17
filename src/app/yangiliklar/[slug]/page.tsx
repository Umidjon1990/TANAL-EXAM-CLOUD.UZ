import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getNewsBySlug } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return { title: "Yangilik topilmadi" };
  return {
    title: news.title,
    description: news.excerpt ?? undefined,
    openGraph: {
      title: news.title,
      description: news.excerpt ?? undefined,
      images: news.coverImage ? [news.coverImage] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container max-w-3xl py-10">
          <Link
            href="/yangiliklar"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Yangiliklar
          </Link>

          <p className="text-sm text-muted-foreground">
            {news.publishedAt ? formatDate(news.publishedAt) : ""} ·{" "}
            {news.author.fullName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {news.title}
          </h1>

          {news.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={news.coverImage}
              alt={news.title}
              className="mt-6 w-full rounded-xl border object-cover"
            />
          ) : null}

          <div className="prose prose-slate mt-6 max-w-none">
            {news.content.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} className="mb-4 leading-relaxed text-foreground/90">
                  {para}
                </p>
              ) : null,
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
