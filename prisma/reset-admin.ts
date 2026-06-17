import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Super admin hisobini ishonchli tarzda yaratadi/tiklaydi.
 * Standart login/parol: admin12345 / admin12345
 * (SUPER_ADMIN_USERNAME / SUPER_ADMIN_PASSWORD bilan o'zgartirish mumkin).
 *
 * Ishga tushirish: `npm run admin:reset`
 * ⚠️ Kirgandan so'ng parolni darhol o'zgartiring (Sozlamalar sahifasi).
 */
async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME || "admin12345";
  const password = process.env.SUPER_ADMIN_PASSWORD || "admin12345";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { username },
    update: { passwordHash, role: "SUPER_ADMIN", isActive: true },
    create: {
      username,
      passwordHash,
      fullName: "Bosh Administrator",
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Super admin tayyor!");
  console.log(`   Login: ${admin.username}`);
  console.log(`   Parol: ${password}`);
  console.log("⚠️  Kirgach parolni darhol o'zgartiring (Sozlamalar).");
}

main()
  .catch((e) => {
    console.error("❌ Xatolik:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
