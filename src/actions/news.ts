"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";
import { publishNews } from "@/lib/telegram-service";
import { createNewsSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ActionState } from "./auth";

/** Bosh admin yangilik yaratadi (ixtiyoriy ravishda darhol nashr etadi). */
export async function createNewsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSuperAdmin();

  const parsed = createNewsSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri",
    };
  }

  const { title, excerpt, content, coverImage, published } = parsed.data;

  const baseSlug = slugify(title) || "yangilik";
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.news.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const news = await prisma.news.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      published,
      publishedAt: published ? new Date() : null,
      authorId: session.userId,
    },
  });

  await writeAudit({
    action: published ? "NEWS_PUBLISHED" : "NEWS_CREATED",
    actorId: session.userId,
    detail: `Yangilik: ${title}`,
  });

  if (published) {
    await publishNews(news.id);
  }

  revalidatePath("/admin/yangiliklar");
  revalidatePath("/yangiliklar");
  return { success: true };
}

/** Nashr holatini almashtirish; nashr qilinganda Telegram'ga e'lon. */
export async function toggleNewsPublishedAction(
  newsId: string,
): Promise<ActionState> {
  const session = await requireSuperAdmin();

  const news = await prisma.news.findUnique({ where: { id: newsId } });
  if (!news) return { error: "Yangilik topilmadi" };

  const nowPublished = !news.published;

  await prisma.news.update({
    where: { id: newsId },
    data: {
      published: nowPublished,
      publishedAt: nowPublished ? (news.publishedAt ?? new Date()) : null,
    },
  });

  await writeAudit({
    action: nowPublished ? "NEWS_PUBLISHED" : "NEWS_UPDATED",
    actorId: session.userId,
    detail: `Yangilik holati: ${news.title}`,
  });

  if (nowPublished) {
    await publishNews(newsId);
  }

  revalidatePath("/admin/yangiliklar");
  revalidatePath("/yangiliklar");
  return { success: true };
}

/** Yangilikni o'chirish. */
export async function deleteNewsAction(newsId: string): Promise<ActionState> {
  const session = await requireSuperAdmin();

  const news = await prisma.news.findUnique({ where: { id: newsId } });
  if (!news) return { error: "Yangilik topilmadi" };

  await prisma.news.delete({ where: { id: newsId } });

  await writeAudit({
    action: "NEWS_DELETED",
    actorId: session.userId,
    detail: `Yangilik o'chirildi: ${news.title}`,
  });

  revalidatePath("/admin/yangiliklar");
  revalidatePath("/yangiliklar");
  return { success: true };
}
