import "server-only";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { getSession, type SessionPayload } from "./session";

/**
 * Tizimga kirgan foydalanuvchini talab qiladi.
 * Aks holda login sahifasiga yo'naltiradi.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/kirish");
  }
  return session;
}

/**
 * Ma'lum rol(lar)ni talab qiladi. Aks holda yo'naltiradi.
 */
export async function requireRole(...roles: Role[]): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!roles.includes(session.role)) {
    redirect("/kirish");
  }
  return session;
}

export async function requireSuperAdmin(): Promise<SessionPayload> {
  return requireRole("SUPER_ADMIN");
}

export async function requireTestCenterAdmin(): Promise<SessionPayload> {
  return requireRole("TEST_CENTER_ADMIN");
}
