"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { writeAudit } from "@/lib/audit";
import { loginSchema } from "@/lib/validations";

export interface ActionState {
  error?: string;
  success?: boolean;
}

async function getClientIp(): Promise<string | null> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null
  );
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri",
    };
  }

  const { username, password } = parsed.data;
  const ip = await getClientIp();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  // Foydalanuvchi mavjudligini oshkor qilmaslik uchun har doim parolni
  // tekshiramiz (timing-attack himoyasi uchun dummy hash bilan).
  const validPassword = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(
        password,
        "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinv",
      );

  if (!user || !validPassword || !user.isActive) {
    await writeAudit({
      action: "LOGIN_FAILED",
      actorId: user?.id ?? null,
      detail: `Muvaffaqiyatsiz kirish urinishi: ${username}`,
      ipAddress: ip,
    });
    return { error: "Foydalanuvchi nomi yoki parol noto'g'ri" };
  }

  await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    testCenterId: user.testCenterId,
  });

  await writeAudit({
    action: "LOGIN_SUCCESS",
    actorId: user.id,
    detail: `Tizimga kirdi: ${username}`,
    ipAddress: ip,
  });

  redirect(user.role === "SUPER_ADMIN" ? "/admin" : "/panel");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/kirish");
}
