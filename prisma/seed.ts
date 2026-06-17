import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME ?? "superadmin";
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "SUPER_ADMIN_PASSWORD muhit o'zgaruvchisi belgilanmagan. Seed bekor qilindi.",
    );
  }

  // --- 1. Super Admin ---
  // Har safar parolni SUPER_ADMIN_PASSWORD ga moslab yangilaymiz —
  // shu tariqa seed'ni qayta ishga tushirish = parolni tiklash.
  const passwordHash = await bcrypt.hash(password, 12);
  const superAdmin = await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      username,
      passwordHash,
      fullName: "Bosh Administrator",
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✅ Super admin tayyor: ${superAdmin.username}`);

  // Demo ma'lumotlar faqat development uchun
  if (process.env.NODE_ENV === "production") {
    console.log("ℹ️  Production rejimi — demo ma'lumotlar o'tkazib yuborildi.");
    return;
  }

  // --- 2. Test markazlar ---
  const centersData = [
    {
      name: "Al-Manhal o'quv markazi",
      region: "Toshkent shahri",
      city: "Chilonzor",
      phone: "+998901112233",
    },
    {
      name: "Nur Ta'lim markazi",
      region: "Samarqand",
      city: "Samarqand sh.",
      phone: "+998905556677",
    },
    {
      name: "Ihsan Akademiyasi",
      region: "Andijon",
      city: "Andijon sh.",
      phone: "+998907778899",
    },
  ];

  const centers = [];
  for (const c of centersData) {
    const center = await prisma.testCenter.upsert({
      where: { slug: slugify(c.name) },
      update: {},
      create: { ...c, slug: slugify(c.name) },
    });
    centers.push(center);
  }
  console.log(`✅ Test markazlar: ${centers.length}`);

  // --- 3. Test markaz admini ---
  const tcAdmin = await prisma.user.upsert({
    where: { username: "markaz_admin" },
    update: {},
    create: {
      username: "markaz_admin",
      passwordHash: await bcrypt.hash("Markaz123!", 12),
      fullName: "Markaz Administratori",
      role: "TEST_CENTER_ADMIN",
      testCenterId: centers[0]!.id,
    },
  });
  console.log(`✅ Markaz admini: ${tcAdmin.username} (parol: Markaz123!)`);

  // --- 4. Imtihon sanalari ---
  const day = 24 * 60 * 60 * 1000;
  const existingExams = await prisma.examDate.count();
  if (existingExams === 0) {
    await prisma.examDate.createMany({
      data: [
        {
          examDate: new Date(Date.now() + 14 * day),
          location: "Toshkent, Chilonzor tumani, 5-bino",
          capacity: 50,
          price: 300000,
          status: "APPROVED",
          telegramPostedAt: new Date(),
          reviewedById: superAdmin.id,
          reviewedAt: new Date(),
          testCenterId: centers[0]!.id,
          submittedById: tcAdmin.id,
        },
        {
          examDate: new Date(Date.now() + 30 * day),
          location: "Samarqand, Registon ko'chasi, 12-uy",
          capacity: 40,
          price: 280000,
          status: "APPROVED",
          telegramPostedAt: new Date(),
          reviewedById: superAdmin.id,
          reviewedAt: new Date(),
          testCenterId: centers[1]!.id,
          submittedById: superAdmin.id,
        },
        {
          examDate: new Date(Date.now() + 21 * day),
          location: "Andijon, Bobur shoh ko'chasi, 8-uy",
          capacity: 35,
          price: 250000,
          status: "PENDING",
          testCenterId: centers[2]!.id,
          submittedById: superAdmin.id,
        },
      ],
    });
    console.log("✅ Imtihon sanalari yaratildi (2 tasdiqlangan, 1 kutilmoqda)");
  }

  // --- 5. Yangiliklar ---
  const newsCount = await prisma.news.count();
  if (newsCount === 0) {
    await prisma.news.create({
      data: {
        title: "TANAL imtihon platformasi ishga tushdi",
        slug: "tanal-platforma-ishga-tushdi",
        excerpt:
          "O'zbekiston bo'ylab TANAL arab tili sertifikat imtihonlari endi yagona platformada.",
        content:
          "Hurmatli talabalar! Endi barcha vakolatli test markazlarining tasdiqlangan imtihon sanalarini bir joyda kuzatishingiz mumkin. Platformada ro'yxatdan o'tish shart emas — kerakli viloyat va markazni tanlab, eng yaqin imtihon sanasini bir necha soniyada toping.",
        published: true,
        publishedAt: new Date(),
        authorId: superAdmin.id,
      },
    });
    console.log("✅ Namuna yangilik yaratildi");
  }

  console.log("🎉 Seed yakunlandi.");
}

main()
  .catch((e) => {
    console.error("❌ Seed xatosi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
