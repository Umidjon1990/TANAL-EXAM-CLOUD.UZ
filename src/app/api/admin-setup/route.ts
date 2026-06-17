import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FIXED_USERNAME = "admin12345";
const FIXED_PASSWORD = "admin12345";

/**
 * Bir martalik admin sozlash/diagnostika endpointi.
 * Faqat ADMIN_RESET="true" muhit o'zgaruvchisi bo'lganda ishlaydi.
 *
 *  - GET /api/admin-setup            -> bazadagi super adminlarni ko'rsatadi
 *  - GET /api/admin-setup?do=reset   -> admin12345/admin12345 ni yaratadi/tiklaydi
 *
 * Ishlatib bo'lgach ADMIN_RESET o'zgaruvchisini O'CHIRING.
 */
export async function GET(request: Request) {
  if (process.env.ADMIN_RESET !== "true") {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Bu endpoint o'chirilgan. Yoqish uchun Railway'da ADMIN_RESET=true qo'ying.",
      },
      { status: 403 },
    );
  }

  const url = new URL(request.url);
  const doReset = url.searchParams.get("do") === "reset";

  let resetResult: string | null = null;

  try {
    if (doReset) {
      const passwordHash = await bcrypt.hash(FIXED_PASSWORD, 12);
      await prisma.user.upsert({
        where: { username: FIXED_USERNAME },
        update: { passwordHash, role: "SUPER_ADMIN", isActive: true },
        create: {
          username: FIXED_USERNAME,
          passwordHash,
          fullName: "Bosh Administrator",
          role: "SUPER_ADMIN",
        },
      });
      resetResult = `Tayyor! Login: ${FIXED_USERNAME} / Parol: ${FIXED_PASSWORD}`;
    }

    // Diagnostika: mavjud super adminlar (parol oshkor qilinmaydi)
    const admins = await prisma.user.findMany({
      where: { role: "SUPER_ADMIN" },
      select: { username: true, isActive: true, passwordHash: true },
    });

    const diagnostics = await Promise.all(
      admins.map(async (a) => ({
        username: a.username,
        isActive: a.isActive,
        // admin12345 paroli shu hisobga mos keladimi?
        passwordIsAdmin12345: await bcrypt.compare(
          FIXED_PASSWORD,
          a.passwordHash,
        ),
      })),
    );

    return NextResponse.json({
      ok: true,
      database: "ulanish muvaffaqiyatli",
      resetPerformed: doReset,
      resetResult,
      superAdminCount: admins.length,
      superAdmins: diagnostics,
      hint: doReset
        ? "Endi /kirish sahifasida admin12345 / admin12345 bilan kiring. So'ng ADMIN_RESET ni o'chiring."
        : "Tiklash uchun shu manzilga ?do=reset qo'shing.",
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        message: "Ma'lumotlar bazasiga ulanishda xatolik",
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
