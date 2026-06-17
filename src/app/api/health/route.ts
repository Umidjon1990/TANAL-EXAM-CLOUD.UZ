import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Railway healthcheck uchun yengil liveness endpoint.
 * Ataylab DBga bog'liq emas — ilova ishga tushishi (migratsiyadan oldin ham)
 * "sog'lom" deb topilishi kerak. DB holatini /api/health/ready tekshiradi.
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "tanal-exam-platform",
    timestamp: new Date().toISOString(),
  });
}
