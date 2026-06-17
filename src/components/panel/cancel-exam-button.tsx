"use client";

import { useTransition } from "react";
import { cancelExamAction } from "@/actions/exams";
import { Button } from "@/components/ui/button";

export function CancelExamButton({ examId }: { examId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(() => cancelExamAction(examId).then(() => undefined))
      }
    >
      Bekor qilish
    </Button>
  );
}
