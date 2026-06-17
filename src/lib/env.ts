import { z } from "zod";

/**
 * Muhit o'zgaruvchilarini ishga tushishda tekshiramiz.
 * Noto'g'ri konfiguratsiya bilan ilova ishga tushmasligi kerak.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET kamida 32 belgidan iborat bo'lishi kerak"),
  TELEGRAM_BOT_TOKEN: z.string().optional().default(""),
  TELEGRAM_CHANNEL_ID: z.string().optional().default(""),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Muhit o'zgaruvchilari noto'g'ri:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Muhit o'zgaruvchilari konfiguratsiyasi xato.");
}

export const env = parsed.data;
