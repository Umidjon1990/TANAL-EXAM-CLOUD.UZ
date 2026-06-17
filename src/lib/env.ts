import { z } from "zod";

/**
 * Muhit o'zgaruvchilarini ishga tushishda tekshiramiz.
 * Noto'g'ri konfiguratsiya bilan ilova ishga tushmasligi kerak.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z
    .string()
    .min(32, "AUTH_SECRET kamida 32 belgidan iborat bo'lishi kerak"),
  TELEGRAM_BOT_TOKEN: z.string().optional().default(""),
  TELEGRAM_CHANNEL_ID: z.string().optional().default(""),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

// `next build` paytida maxfiy o'zgaruvchilar mavjud bo'lmasligi mumkin.
// Bu fazada build'ni to'xtatmaymiz — xato faqat ogohlantirish sifatida
// chiqadi. Runtime'da esa noto'g'ri konfiguratsiya bilan ishlamaymiz.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Muhit o'zgaruvchilari noto'g'ri:",
    parsed.error.flatten().fieldErrors,
  );
  if (!isBuildPhase) {
    throw new Error("Muhit o'zgaruvchilari konfiguratsiyasi xato.");
  }
}

export const env = parsed.success
  ? parsed.data
  : {
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "",
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ?? "",
      TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID ?? "",
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      NODE_ENV:
        (process.env.NODE_ENV as "development" | "test" | "production") ??
        "production",
    };
