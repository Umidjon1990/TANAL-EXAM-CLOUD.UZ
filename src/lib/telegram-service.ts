import "server-only";
import { prisma } from "@/lib/prisma";
import { writeAudit } from "@/lib/audit";
import {
  buildApprovedAnnouncement,
  buildNewsAnnouncement,
  sendTelegramMessage,
} from "@/lib/telegram";

/**
 * Tasdiqlangan imtihonni Telegram kanaliga e'lon qiladi.
 *
 * Ishonchlilik kafolatlari:
 *  - Idempotentlik: `telegramPostedAt` to'ldirilgan bo'lsa, qayta yubormaydi (dublikatni oldini olish).
 *  - Xatolikka chidamlilik: tarmoq xatosi asosiy oqimni to'xtatmaydi.
 *  - Kuzatuvchanlik: har bir urinish TelegramPostLog'ga yoziladi.
 */
export async function publishApprovedExam(examId: string): Promise<void> {
  const exam = await prisma.examDate.findUnique({
    where: { id: examId },
    include: { testCenter: true },
  });

  if (!exam) return;

  // Dublikatni oldini olish — allaqachon e'lon qilingan bo'lsa, chiqamiz.
  if (exam.telegramPostedAt) {
    await prisma.telegramPostLog.create({
      data: {
        type: "EXAM_APPROVED",
        status: "SKIPPED",
        examDateId: exam.id,
        error: "Allaqachon e'lon qilingan (dublikat)",
      },
    });
    return;
  }

  const text = buildApprovedAnnouncement({
    centerName: exam.testCenter.name,
    examDate: exam.examDate,
    location: exam.location,
    region: exam.testCenter.region,
  });

  const result = await sendTelegramMessage(text);

  await prisma.telegramPostLog.create({
    data: {
      type: "EXAM_APPROVED",
      status: result.ok ? "SENT" : result.skipped ? "SKIPPED" : "FAILED",
      examDateId: exam.id,
      chatId: result.chatId,
      messageId: result.messageId,
      error: result.error,
    },
  });

  if (result.ok) {
    // Faqat muvaffaqiyatli e'londan keyin belgilaymiz (idempotentlik).
    await prisma.examDate.update({
      where: { id: exam.id },
      data: { telegramPostedAt: new Date() },
    });
    await writeAudit({
      action: "TELEGRAM_POST_SENT",
      detail: `Imtihon e'lon qilindi: ${exam.id}`,
    });
  } else if (!result.skipped) {
    await writeAudit({
      action: "TELEGRAM_POST_FAILED",
      detail: `Imtihon e'loni xato: ${exam.id} — ${result.error}`,
    });
  }
}

/** Yangilikni Telegram kanaliga e'lon qiladi (xatolikka chidamli). */
export async function publishNews(newsId: string): Promise<void> {
  const news = await prisma.news.findUnique({ where: { id: newsId } });
  if (!news || !news.published) return;

  const alreadySent = await prisma.telegramPostLog.findFirst({
    where: { newsId: news.id, status: "SENT" },
  });
  if (alreadySent) return;

  const result = await sendTelegramMessage(
    buildNewsAnnouncement({ title: news.title, excerpt: news.excerpt }),
  );

  await prisma.telegramPostLog.create({
    data: {
      type: "NEWS_PUBLISHED",
      status: result.ok ? "SENT" : result.skipped ? "SKIPPED" : "FAILED",
      newsId: news.id,
      chatId: result.chatId,
      messageId: result.messageId,
      error: result.error,
    },
  });
}
