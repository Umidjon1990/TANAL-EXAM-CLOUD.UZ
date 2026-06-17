"use server";

import { requireSuperAdmin } from "@/lib/auth/guards";
import { sendTelegramMessage } from "@/lib/telegram";
import type { ActionState } from "./auth";

/**
 * Bosh admin Telegram sozlamalarini tekshirish uchun test xabar yuboradi.
 */
export async function sendTelegramTestAction(): Promise<ActionState> {
  await requireSuperAdmin();

  const result = await sendTelegramMessage(
    [
      "✅ <b>TANAL platformasi — test xabari</b>",
      "",
      "Agar buni ko'rsangiz, Telegram integratsiyasi to'g'ri sozlangan.",
    ].join("\n"),
  );

  if (result.ok) {
    return { success: true };
  }
  if (result.skipped) {
    return {
      error:
        "Telegram sozlanmagan. TELEGRAM_BOT_TOKEN va TELEGRAM_CHANNEL_ID o'zgaruvchilarini qo'shing.",
    };
  }
  return { error: `Telegram xatosi: ${result.error}` };
}
