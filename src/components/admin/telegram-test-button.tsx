"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { sendTelegramTestAction } from "@/actions/telegram";
import { Button } from "@/components/ui/button";

export function TelegramTestButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await sendTelegramTestAction();
            setResult(
              res.success
                ? { ok: true, msg: "Test xabar kanalga yuborildi! 🎉" }
                : { ok: false, msg: res.error ?? "Noma'lum xatolik" },
            );
          })
        }
      >
        <Send className="size-4" />
        {isPending ? "Yuborilmoqda..." : "Test xabar yuborish"}
      </Button>

      {result ? (
        <div
          className={
            result.ok
              ? "flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              : "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          }
        >
          {result.ok ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          {result.msg}
        </div>
      ) : null}
    </div>
  );
}
