"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { writeAudit } from "@/lib/audit";
import { createUserSchema } from "@/lib/validations";
import type { ActionState } from "./auth";

/**
 * Bosh admin yangi test markaz adminini yaratadi.
 * Ommaviy ro'yxatdan o'tish yo'q — faqat shu yo'l bilan foydalanuvchi paydo bo'ladi.
 */
export async function createUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSuperAdmin();

  const parsed = createUserSchema.safeParse({
    username: formData.get("username"),
    fullName: formData.get("fullName"),
    password: formData.get("password"),
    testCenterId: formData.get("testCenterId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri" };
  }

  const { username, fullName, password, testCenterId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "Bu foydalanuvchi nomi allaqachon band" };
  }

  const center = await prisma.testCenter.findUnique({
    where: { id: testCenterId },
  });
  if (!center) {
    return { error: "Tanlangan test markazi topilmadi" };
  }

  const passwordHash = await hashPassword(password);

  const created = await prisma.user.create({
    data: {
      username,
      fullName,
      passwordHash,
      role: "TEST_CENTER_ADMIN",
      testCenterId,
    },
  });

  await writeAudit({
    action: "USER_CREATED",
    actorId: session.userId,
    detail: `Yangi admin yaratildi: ${username} (${center.name})`,
  });

  revalidatePath("/admin/foydalanuvchilar");
  return { success: true };
}

/** Foydalanuvchini faollashtirish/o'chirish (toggle). */
export async function toggleUserActiveAction(
  userId: string,
): Promise<ActionState> {
  const session = await requireSuperAdmin();

  if (userId === session.userId) {
    return { error: "O'zingizni o'chira olmaysiz" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "Foydalanuvchi topilmadi" };
  if (user.role === "SUPER_ADMIN") {
    return { error: "Bosh administratorni o'zgartirib bo'lmaydi" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  await writeAudit({
    action: user.isActive ? "USER_DEACTIVATED" : "USER_UPDATED",
    actorId: session.userId,
    detail: `Foydalanuvchi holati o'zgartirildi: ${user.username}`,
  });

  revalidatePath("/admin/foydalanuvchilar");
  return { success: true };
}
