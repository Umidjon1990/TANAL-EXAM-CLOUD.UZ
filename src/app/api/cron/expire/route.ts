import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Muddati o'tgan imtihon sanalarini EXPIRED holatiga o'tkazadi.
 * Railway cron yoki tashqi planlovchi tomonidan chaqiriladi.
 * Himoya: Authorization: Bearer <AUTH_SECRET>
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${env.AUTH_SECRET}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const result = await prisma.examDate.updateMany({
    where: {
      status: { in: ["APPROVED", "PENDING"] },
      examDate: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });

  return NextResponse.json({ expired: result.count });
}
