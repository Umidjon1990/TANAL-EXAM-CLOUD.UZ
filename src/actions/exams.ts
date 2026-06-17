"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guards";
import { writeAudit } from "@/lib/audit";
import { publishApprovedExam } from "@/lib/telegram-service";
import { createExamSchema, rejectExamSchema } from "@/lib/validations";
import type { ActionState } from "./auth";

/**
 * Test markaz admini yangi imtihon sanasini taklif qiladi.
 * Status doimo PENDING bo'ladi — hech qachon avtomatik nashr etilmaydi.
 */
export async function submitExamAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("TEST_CENTER_ADMIN");

  if (!session.testCenterId) {
    return {
      error:
        "Sizga test markazi biriktirilmagan. Administrator bilan bog'laning.",
    };
  }

  const parsed = createExamSchema.safeParse({
    examDate: formData.get("examDate"),
    registrationDeadline: formData.get("registrationDeadline"),
    location: formData.get("location"),
    capacity: formData.get("capacity") || undefined,
    price: formData.get("price") || undefined,
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri",
    };
  }

  const data = parsed.data;

  await prisma.examDate.create({
    data: {
      examDate: new Date(data.examDate),
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline)
        : null,
      location: data.location,
      capacity: data.capacity ?? null,
      price: data.price ?? null,
      description: data.description || null,
      status: "PENDING",
      testCenterId: session.testCenterId,
      submittedById: session.userId,
    },
  });

  await writeAudit({
    action: "EXAM_SUBMITTED",
    actorId: session.userId,
    detail: `Yangi imtihon sanasi taklif qilindi: ${data.examDate}`,
  });

  revalidatePath("/panel");
  revalidatePath("/admin");
  return { success: true };
}

/** Bosh admin imtihon sanasini tasdiqlaydi va Telegram'ga e'lon qiladi. */
export async function approveExamAction(examId: string): Promise<ActionState> {
  const session = await requireRole("SUPER_ADMIN");

  const exam = await prisma.examDate.findUnique({
    where: { id: examId },
    include: { testCenter: true },
  });

  if (!exam) return { error: "Imtihon sanasi topilmadi" };
  if (exam.status !== "PENDING") {
    return { error: "Faqat kutilayotgan sanalarni tasdiqlash mumkin" };
  }

  await prisma.examDate.update({
    where: { id: examId },
    data: {
      status: "APPROVED",
      reviewedById: session.userId,
      reviewedAt: new Date(),
      rejectReason: null,
    },
  });

  await writeAudit({
    action: "EXAM_APPROVED",
    actorId: session.userId,
    detail: `Imtihon tasdiqlandi: ${exam.id}`,
  });

  // Telegram e'loni — idempotent, xatolikka chidamli, loglanadi.
  await publishApprovedExam(exam.id);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/imtihonlar");
  return { success: true };
}

/** Bosh admin imtihon sanasini rad etadi (sabab bilan). */
export async function rejectExamAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireRole("SUPER_ADMIN");

  const parsed = rejectExamSchema.safeParse({
    examId: formData.get("examId"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri",
    };
  }

  const exam = await prisma.examDate.findUnique({
    where: { id: parsed.data.examId },
  });
  if (!exam) return { error: "Imtihon sanasi topilmadi" };
  if (exam.status !== "PENDING") {
    return { error: "Faqat kutilayotgan sanalarni rad etish mumkin" };
  }

  await prisma.examDate.update({
    where: { id: parsed.data.examId },
    data: {
      status: "REJECTED",
      reviewedById: session.userId,
      reviewedAt: new Date(),
      rejectReason: parsed.data.reason,
    },
  });

  await writeAudit({
    action: "EXAM_REJECTED",
    actorId: session.userId,
    detail: `Imtihon rad etildi: ${exam.id} — ${parsed.data.reason}`,
  });

  revalidatePath("/admin");
  return { success: true };
}

/**
 * Imtihon sanasini bekor qilish.
 * Bosh admin har qanday sanani, test markaz admini esa faqat o'z
 * markazining sanasini bekor qila oladi.
 */
export async function cancelExamAction(examId: string): Promise<ActionState> {
  const session = await requireRole("SUPER_ADMIN", "TEST_CENTER_ADMIN");

  const exam = await prisma.examDate.findUnique({ where: { id: examId } });
  if (!exam) return { error: "Imtihon sanasi topilmadi" };

  if (
    session.role === "TEST_CENTER_ADMIN" &&
    exam.testCenterId !== session.testCenterId
  ) {
    return { error: "Bu amalni bajarishga ruxsatingiz yo'q" };
  }

  if (exam.status === "CANCELLED" || exam.status === "EXPIRED") {
    return { error: "Bu sana allaqachon yakunlangan" };
  }

  await prisma.examDate.update({
    where: { id: examId },
    data: { status: "CANCELLED" },
  });

  await writeAudit({
    action: "EXAM_CANCELLED",
    actorId: session.userId,
    detail: `Imtihon bekor qilindi: ${exam.id}`,
  });

  revalidatePath("/admin");
  revalidatePath("/panel");
  revalidatePath("/");
  return { success: true };
}
