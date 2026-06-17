import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME ?? "superadmin";
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "SUPER_ADMIN_PASSWORD muhit o'zgaruvchisi belgilanmagan. Seed bekor qilindi.",
    );
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(
      `ℹ️  Super admin "${username}" allaqachon mavjud. O'tkazib yuborildi.`,
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
      fullName: "Bosh Administrator",
      role: "SUPER_ADMIN",
    },
  });

  console.log(`✅ Super admin yaratildi: ${username}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed xatosi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
