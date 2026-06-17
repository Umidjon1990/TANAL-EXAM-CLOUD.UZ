"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";
import { createTestCenterSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { ActionState } from "./auth";

/** Bosh admin yangi test markazini qo'shadi. */
export async function createTestCenterAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSuperAdmin();

  const parsed = createTestCenterSchema.safeParse({
    name: formData.get("name"),
    region: formData.get("region"),
    city: formData.get("city"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    telegram: formData.get("telegram"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri",
    };
  }

  const { name, region, city, address, phone, telegram } = parsed.data;

  // Noyob slug yaratamiz
  const baseSlug = slugify(name) || "markaz";
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.testCenter.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const center = await prisma.testCenter.create({
    data: {
      name,
      slug,
      region,
      city,
      address: address || null,
      phone: phone || null,
      telegram: telegram || null,
    },
  });

  await writeAudit({
    action: "TEST_CENTER_CREATED",
    actorId: session.userId,
    detail: `Yangi test markazi: ${name}`,
  });

  revalidatePath("/admin/markazlar");
  revalidatePath("/admin/foydalanuvchilar");
  return { success: true };
}

/** Bosh admin mavjud test markazi ma'lumotlarini tahrirlaydi. */
export async function updateTestCenterAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSuperAdmin();

  const centerId = String(formData.get("centerId") ?? "");
  if (!centerId) return { error: "Markaz tanlanmagan" };

  const existing = await prisma.testCenter.findUnique({
    where: { id: centerId },
  });
  if (!existing) return { error: "Test markazi topilmadi" };

  const parsed = createTestCenterSchema.safeParse({
    name: formData.get("name"),
    region: formData.get("region"),
    city: formData.get("city"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    telegram: formData.get("telegram"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri",
    };
  }

  const { name, region, city, address, phone, telegram } = parsed.data;

  await prisma.testCenter.update({
    where: { id: centerId },
    data: {
      name,
      region,
      city,
      address: address || null,
      phone: phone || null,
      telegram: telegram || null,
    },
  });

  await writeAudit({
    action: "TEST_CENTER_UPDATED",
    actorId: session.userId,
    detail: `Test markazi tahrirlandi: ${name}`,
  });

  revalidatePath("/admin/markazlar");
  revalidatePath("/markazlar");
  revalidatePath("/");
  revalidatePath("/imtihonlar");
  return { success: true };
}

/** Test markazini faollashtirish/o'chirish. */
export async function toggleTestCenterActiveAction(
  centerId: string,
): Promise<ActionState> {
  const session = await requireSuperAdmin();

  const center = await prisma.testCenter.findUnique({
    where: { id: centerId },
  });
  if (!center) return { error: "Test markazi topilmadi" };

  await prisma.testCenter.update({
    where: { id: centerId },
    data: { isActive: !center.isActive },
  });

  await writeAudit({
    action: "TEST_CENTER_UPDATED",
    actorId: session.userId,
    detail: `Markaz holati o'zgartirildi: ${center.name}`,
  });

  revalidatePath("/admin/markazlar");
  return { success: true };
}
