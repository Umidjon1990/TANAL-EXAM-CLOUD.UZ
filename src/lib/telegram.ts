import "server-only";
import { env } from "@/lib/env";

const TELEGRAM_API = "https://api.telegram.org";

/**
 * Telegram kanaliga xabar yuborish.
 * Token yoki kanal ID sozlanmagan bo'lsa, jimgina o'tkazib yuboramiz
 * (ilova ishlashda davom etadi).
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHANNEL_ID) {
    if (env.NODE_ENV === "development") {
      console.warn(
        "[Telegram] Token yoki kanal ID sozlanmagan — xabar yuborilmadi.",
      );
    }
    return false;
  }

  try {
    const res = await fetch(
      `${TELEGRAM_API}/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHANNEL_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error("[Telegram] Xabar yuborishda xatolik:", await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Telegram] So'rov muvaffaqiyatsiz:", error);
    return false;
  }
}

interface ExamNotification {
  centerName: string;
  examDate: Date;
  location: string;
  region: string;
}

/** Yangi imtihon sanasi tasdiqlanganda kanalga e'lon */
export function buildApprovedAnnouncement(exam: ExamNotification): string {
  const dateStr = new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(exam.examDate);

  return [
    "🟢 <b>Yangi TANAL imtihon sanasi tasdiqlandi!</b>",
    "",
    `🏢 <b>Markaz:</b> ${escapeHtml(exam.centerName)}`,
    `📍 <b>Hudud:</b> ${escapeHtml(exam.region)}`,
    `📅 <b>Sana:</b> ${dateStr}`,
    `🗺 <b>Manzil:</b> ${escapeHtml(exam.location)}`,
    "",
    "Batafsil ma'lumot platformamizda.",
  ].join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
