import type { ExamStatus, Role } from "@prisma/client";

/** Status -> Uzbek Latin yorliq */
export const STATUS_LABELS: Record<ExamStatus, string> = {
  PENDING: "Tasdiqlash kutilmoqda",
  APPROVED: "Tasdiqlandi",
  REJECTED: "Rad etildi",
  CANCELLED: "Bekor qilindi",
  EXPIRED: "Muddati o'tgan",
};

/** Status -> rang (badge variant uchun) */
export const STATUS_VARIANTS: Record<
  ExamStatus,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  CANCELLED: "secondary",
  EXPIRED: "outline",
};

/** Rol -> Uzbek Latin yorliq */
export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Bosh administrator",
  TEST_CENTER_ADMIN: "Test markaz administratori",
};

/** O'zbekiston viloyatlari */
export const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Buxoro",
  "Farg'ona",
  "Jizzax",
  "Xorazm",
  "Namangan",
  "Navoiy",
  "Qashqadaryo",
  "Qoraqalpog'iston Respublikasi",
  "Samarqand",
  "Sirdaryo",
  "Surxondaryo",
] as const;

export const APP_NAME = "TANAL Imtihon Platformasi";
export const APP_DESCRIPTION =
  "O'zbekiston bo'ylab TANAL arab tili sertifikat imtihonlari rasmiy sanalari yagona platformada.";
