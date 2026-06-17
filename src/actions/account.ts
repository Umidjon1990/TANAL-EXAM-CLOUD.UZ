"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guards";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { writeAudit } from "@/lib/audit";
import { changePasswordSchema } from "@/lib/validations";
import type { ActionState } from "./auth";

/**
 * Tizimga kirgan foydalanuvchi o'z parolini o'zgartiradi.
 * Joriy parol tasdiqlanmaguncha o'zgartirilmaydi.
 */
export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAuth();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri",
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return { error: "Foydalanuvchi topilmadi" };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    await writeAudit({
      action: "LOGIN_FAILED",
      actorId: user.id,
      detail: "Parol o'zgartirishda joriy parol xato",
    });
    return { error: "Joriy parol noto'g'ri" };
  }

  if (currentPassword === newPassword) {
    return { error: "Yangi parol joriy paroldan farq qilishi kerak" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  await writeAudit({
    action: "USER_UPDATED",
    actorId: user.id,
    detail: "Parol o'zgartirildi",
  });

  return { success: true };
}
