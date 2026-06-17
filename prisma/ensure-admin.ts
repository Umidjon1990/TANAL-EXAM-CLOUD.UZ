import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Ishga tushishda super admin mavjudligini kafolatlaydi.
 * Agar bironta SUPER_ADMIN bo'lmasa — yaratadi (standart: admin12345/admin12345).
 * MAVJUD adminlarni O'ZGARTIRMAYDI (parolni qayta tiklamaydi).
 *
 * Bu start buyrug'ida ishlaydi, shuning uchun deploydan keyin kirish
 * uchun har doim hisob bo'ladi.
 */
async function main() {
  try {
    const count = await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
    if (count > 0) {
      console.log(
        `ℹ️  Super admin allaqachon mavjud (${count} ta). O'tkazib yuborildi.`,
      );
      return;
    }

    const username = process.env.SUPER_ADMIN_USERNAME || "admin12345";
    const password = process.env.SUPER_ADMIN_PASSWORD || "admin12345";
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        username,
        passwordHash,
        fullName: "Bosh Administrator",
        role: "SUPER_ADMIN",
      },
    });

    console.log("✅ Boshlang'ich super admin yaratildi.");
    console.log(`   Login: ${username}`);
    console.log(`   Parol: ${password}`);
    console.log("⚠️  Kirgach parolni darhol o'zgartiring (Sozlamalar).");
  } catch (e) {
    // Start jarayonini to'xtatmaymiz — faqat ogohlantiramiz.
    console.error(
      "⚠️  ensure-admin xatosi (ilova baribir ishga tushadi):",
      e instanceof Error ? e.message : e,
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main();
