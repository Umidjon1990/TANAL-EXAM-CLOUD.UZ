import "server-only";
import type { AuditAction } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface AuditParams {
  action: AuditAction;
  actorId?: string | null;
  detail?: string;
  ipAddress?: string | null;
}

/**
 * Audit log yozish. Loglash xatosi asosiy oqimni to'xtatmasligi kerak.
 */
export async function writeAudit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        actorId: params.actorId ?? null,
        detail: params.detail,
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (error) {
    console.error("[Audit] Log yozishda xatolik:", error);
  }
}
