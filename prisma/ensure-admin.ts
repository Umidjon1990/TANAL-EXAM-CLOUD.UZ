import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Ishga tushishda super admin mavjudligini kafolatlaydi.
 *
 * Standart: agar hech qanday SUPER_ADMIN bo'lmasa — yaratadi
 * (admin12345/admin12345 yoki SUPER_ADMIN_* env qiymatlari bilan).
 * Mavjud adminni o'zgartirmaydi.
 *
 * Bir martalik tiklash: ADMIN_RESET="true" o'zgaruvchisini qo'ysangiz,
 * SUPER_ADMIN_USERNAME/PASSWORD bilan admin parolini majburan tiklaydi.
 * Tiklagandan so'ng ADMIN_RESET ni o'chiring.
 */
async function main() {
  try {
    const username = process.env.SUPER_ADMIN_USERNAME || "admin12345";
    const password = process.env.SUPER_ADMIN_PASSWORD || "admin12345";
    const forceReset = process.env.ADMIN_RESET === "true";

    const existingCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });

    if (existingCount > 0 && !forceReset) {
      console.log(
        `ℹ️  Super admin mavjud (${existingCount} ta). O'tkazib yuborildi.`,
      );
      return;
    }

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

    console.log(
      forceReset
        ? "✅ Super admin paroli TIKLANDI (ADMIN_RESET)."
        : "✅ Boshlang'ich super admin yaratildi.",
    );
    console.log(`   Login: ${username}`);
    console.log(`   Parol: ${password}`);
    if (forceReset) {
      console.log("⚠️  Endi ADMIN_RESET o'zgaruvchisini o'chiring.");
    } else {
      console.log("⚠️  Kirgach parolni darhol o'zgartiring (Sozlamalar).");
    }
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
