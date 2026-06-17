import { prisma } from "@/lib/prisma";

/**
 * Ommaviy ko'rinish uchun faqat TASDIQLANGAN va kelajakdagi imtihon sanalari.
 * Hech qachon PENDING/REJECTED ma'lumot oshkor qilinmaydi.
 */
export async function getPublicExams(filters?: {
  region?: string;
  search?: string;
}) {
  return prisma.examDate.findMany({
    where: {
      status: "APPROVED",
      examDate: { gte: new Date() },
      testCenter: {
        isActive: true,
        ...(filters?.region ? { region: filters.region } : {}),
      },
      ...(filters?.search
        ? {
            OR: [
              { location: { contains: filters.search, mode: "insensitive" } },
              {
                testCenter: {
                  name: { contains: filters.search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      testCenter: {
        select: { name: true, region: true, city: true, phone: true },
      },
    },
    orderBy: { examDate: "asc" },
  });
}

export type PublicExam = Awaited<ReturnType<typeof getPublicExams>>[number];

/** Ommaviy faol test markazlari (imtihonlar soni bilan). */
export async function getPublicCenters(region?: string) {
  return prisma.testCenter.findMany({
    where: {
      isActive: true,
      ...(region ? { region } : {}),
    },
    select: {
      id: true,
      name: true,
      region: true,
      city: true,
      phone: true,
      address: true,
      _count: {
        select: {
          examDates: {
            where: { status: "APPROVED", examDate: { gte: new Date() } },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export type PublicCenter = Awaited<ReturnType<typeof getPublicCenters>>[number];

/** Nashr qilingan yangiliklar ro'yxati. */
export async function getPublishedNews(limit?: number) {
  return prisma.news.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export type PublishedNews = Awaited<
  ReturnType<typeof getPublishedNews>
>[number];

/** Bitta nashr qilingan yangilik (slug bo'yicha). */
export async function getNewsBySlug(slug: string) {
  return prisma.news.findFirst({
    where: { slug, published: true },
    include: { author: { select: { fullName: true } } },
  });
}

/** Bosh admin paneli statistikasi. */
export async function getAdminStats() {
  const [pending, approved, centers, admins, news, telegramSent] =
    await Promise.all([
      prisma.examDate.count({ where: { status: "PENDING" } }),
      prisma.examDate.count({ where: { status: "APPROVED" } }),
      prisma.testCenter.count({ where: { isActive: true } }),
      prisma.user.count({
        where: { role: "TEST_CENTER_ADMIN", isActive: true },
      }),
      prisma.news.count({ where: { published: true } }),
      prisma.telegramPostLog.count({ where: { status: "SENT" } }),
    ]);
  return { pending, approved, centers, admins, news, telegramSent };
}

/** Imtihon statuslari taqsimoti (statistika sahifasi uchun). */
export async function getExamStatusBreakdown() {
  const grouped = await prisma.examDate.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  return grouped.map((g) => ({ status: g.status, count: g._count._all }));
}
