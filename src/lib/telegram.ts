import "server-only";
import { env } from "@/lib/env";

const TELEGRAM_API = "https://api.telegram.org";

export interface TelegramResult {
  ok: boolean;
  skipped?: boolean; // Token/kanal sozlanmagan
  messageId?: number;
  chatId?: string;
  error?: string;
}

/**
 * Telegram kanaliga xabar yuborish. Tarmoq xatosi hech qachon ilovani
 * to'xtatmaydi — natija struktura sifatida qaytariladi.
 */
export async function sendTelegramMessage(
  text: string,
): Promise<TelegramResult> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHANNEL_ID) {
    if (env.NODE_ENV === "development") {
      console.warn(
        "[Telegram] Token yoki kanal ID sozlanmagan — o'tkazib yuborildi.",
      );
    }
    return { ok: false, skipped: true, error: "Telegram sozlanmagan" };
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
        signal: AbortSignal.timeout(10_000),
      },
    );

    const data = (await res.json().catch(() => null)) as {
      ok: boolean;
      result?: { message_id: number };
      description?: string;
    } | null;

    if (!res.ok || !data?.ok) {
      const error = data?.description ?? `HTTP ${res.status}`;
      console.error("[Telegram] Xatolik:", error);
      return { ok: false, error, chatId: env.TELEGRAM_CHANNEL_ID };
    }

    return {
      ok: true,
      messageId: data.result?.message_id,
      chatId: env.TELEGRAM_CHANNEL_ID,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Noma'lum xatolik";
    console.error("[Telegram] So'rov muvaffaqiyatsiz:", message);
    return { ok: false, error: message };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface ExamNotification {
  centerName: string;
  examDate: Date;
  location: string;
  region: string;
}

/** Tasdiqlangan imtihon e'loni */
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

/** Yangilik e'loni */
export function buildNewsAnnouncement(news: {
  title: string;
  excerpt?: string | null;
}): string {
  return [
    "📰 <b>Yangilik</b>",
    "",
    `<b>${escapeHtml(news.title)}</b>`,
    news.excerpt ? `\n${escapeHtml(news.excerpt)}` : "",
    "\nTo'liq o'qish uchun platformaga tashrif buyuring.",
  ]
    .filter(Boolean)
    .join("\n");
}
