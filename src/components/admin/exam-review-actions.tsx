"use client";

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import {
  approveExamAction,
  rejectExamAction,
} from "@/actions/exams";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ExamReviewActions({ examId }: { examId: string }) {
  const [isPending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      const res = await approveExamAction(examId);
      if (res.error) setError(res.error);
    });
  }

  function handleReject(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await rejectExamAction({}, formData);
      if (res.error) setError(res.error);
      else setRejecting(false);
    });
  }

  if (rejecting) {
    return (
      <form action={handleReject} className="space-y-2">
        <input type="hidden" name="examId" value={examId} />
        <Textarea
          name="reason"
          required
          rows={2}
          placeholder="Rad etish sababini kiriting..."
          className="text-sm"
        />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <div className="flex gap-2">
          <Button
            type="submit"
            size="sm"
            variant="destructive"
            disabled={isPending}
          >
            Rad etishni tasdiqlash
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setRejecting(false)}
            disabled={isPending}
          >
            Bekor qilish
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Button size="sm" onClick={handleApprove} disabled={isPending}>
          <Check className="size-4" />
          Tasdiqlash
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRejecting(true)}
          disabled={isPending}
        >
          <X className="size-4" />
          Rad etish
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
