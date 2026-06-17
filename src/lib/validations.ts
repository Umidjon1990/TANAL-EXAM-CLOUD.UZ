import { z } from "zod";
import { REGIONS } from "./constants";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Foydalanuvchi nomi kamida 3 belgidan iborat bo'lishi kerak")
    .max(50, "Foydalanuvchi nomi juda uzun"),
  password: z.string().min(1, "Parolni kiriting"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Foydalanuvchi nomi kamida 3 belgidan iborat bo'lishi kerak")
    .max(50)
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "Faqat harf, raqam, _ . - belgilaridan foydalaning",
    ),
  fullName: z.string().min(3, "To'liq ismni kiriting").max(120),
  password: z
    .string()
    .min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak")
    .max(100),
  testCenterId: z.string().min(1, "Test markazini tanlang"),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createTestCenterSchema = z.object({
  name: z.string().min(3, "Markaz nomini kiriting").max(150),
  region: z.enum(REGIONS, {
    errorMap: () => ({ message: "Viloyatni tanlang" }),
  }),
  city: z.string().min(2, "Shahar/tumanni kiriting").max(100),
  address: z.string().max(250).optional().or(z.literal("")),
  phone: z
    .string()
    .regex(
      /^\+?998\d{9}$/,
      "Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak",
    )
    .optional()
    .or(z.literal("")),
});
export type CreateTestCenterInput = z.infer<typeof createTestCenterSchema>;

export const createExamSchema = z.object({
  examDate: z
    .string()
    .min(1, "Imtihon sanasini tanlang")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Sana noto'g'ri")
    .refine(
      (v) => new Date(v).getTime() > Date.now(),
      "Imtihon sanasi kelajakda bo'lishi kerak",
    ),
  registrationDeadline: z.string().optional().or(z.literal("")),
  location: z.string().min(3, "O'tkaziladigan joyni kiriting").max(200),
  capacity: z.coerce
    .number()
    .int()
    .positive("Joylar soni musbat bo'lishi kerak")
    .optional(),
  price: z.coerce
    .number()
    .int()
    .nonnegative("Narx manfiy bo'lmasligi kerak")
    .optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
});
export type CreateExamInput = z.infer<typeof createExamSchema>;

export const rejectExamSchema = z.object({
  examId: z.string().min(1),
  reason: z
    .string()
    .min(5, "Rad etish sababini kiriting (kamida 5 belgi)")
    .max(500),
});
export type RejectExamInput = z.infer<typeof rejectExamSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Joriy parolni kiriting"),
    newPassword: z
      .string()
      .min(8, "Yangi parol kamida 8 belgidan iborat bo'lishi kerak")
      .max(100),
    confirmPassword: z.string().min(1, "Parolni tasdiqlang"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Yangi parol va tasdiq bir xil emas",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const createNewsSchema = z.object({
  title: z.string().min(5, "Sarlavhani kiriting (kamida 5 belgi)").max(200),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  content: z.string().min(20, "Matn kamida 20 belgidan iborat bo'lishi kerak"),
  coverImage: z
    .string()
    .url("To'g'ri URL kiriting")
    .optional()
    .or(z.literal("")),
  published: z.coerce.boolean().optional().default(false),
});
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
