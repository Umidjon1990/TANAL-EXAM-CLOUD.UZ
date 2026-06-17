import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Ishga tushishda super admin mavjudligini kafolatlaydi.
 *
 * 1) ADMIN_RESET="true" bo'lsa — boshqa o'zgaruvchilarga QARAMAY, qat'iy
 *    "admin12345" / "admin12345" super admin hisobini yaratadi/tiklaydi.
 *    (Eng ishonchli, kafolatlangan kirish yo'li.)
 * 2) Aks holda — agar hech qanday SUPER_ADMIN bo'lmasa, SUPER_ADMIN_* (yoki
 *    standart admin12345) bilan yaratadi. Mavjud adminni o'zgartirmaydi.
 */
const FIXED_USERNAME = "admin12345";
const FIXED_PASSWORD = "admin12345";

async function upsertAdmin(username: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash, role: "SUPER_ADMIN", isActive: true },
    create: {
      username,
      passwordHash,
      fullName: "Bosh Administrator",
      role: "SUPER_ADMIN",
    },
  });
}

async function main() {
  try {
    // 1) Majburiy tiklash — kafolatlangan login/parol.
    if (process.env.ADMIN_RESET === "true") {
      await upsertAdmin(FIXED_USERNAME, FIXED_PASSWORD);
      console.log("==================================================");
      console.log("✅ ADMIN_RESET: kafolatlangan hisob tayyor!");
      console.log(`   LOGIN: ${FIXED_USERNAME}`);
      console.log(`   PAROL: ${FIXED_PASSWORD}`);
      console.log(
        "⚠️  Kirgach ADMIN_RESET ni o'chiring va parolni almashtiring.",
      );
      console.log("==================================================");
      return;
    }

    // 2) Admin yo'q bo'lsa — yaratamiz.
    const existingCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });
    if (existingCount > 0) {
      console.log(
        `ℹ️  Super admin mavjud (${existingCount} ta). O'tkazib yuborildi.`,
      );
      return;
    }

    const username = process.env.SUPER_ADMIN_USERNAME || FIXED_USERNAME;
    const password = process.env.SUPER_ADMIN_PASSWORD || FIXED_PASSWORD;
    await upsertAdmin(username, password);
    console.log("✅ Boshlang'ich super admin yaratildi.");
    console.log(`   LOGIN: ${username}`);
    console.log(`   PAROL: ${password}`);
  } catch (e) {
    console.error(
      "⚠️  ensure-admin xatosi (ilova baribir ishga tushadi):",
      e instanceof Error ? e.message : e,
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main();
