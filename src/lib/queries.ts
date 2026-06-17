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

/** Bosh admin paneli statistikasi. */
export async function getAdminStats() {
  const [pending, approved, centers, admins] = await Promise.all([
    prisma.examDate.count({ where: { status: "PENDING" } }),
    prisma.examDate.count({ where: { status: "APPROVED" } }),
    prisma.testCenter.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "TEST_CENTER_ADMIN", isActive: true } }),
  ]);
  return { pending, approved, centers, admins };
}
