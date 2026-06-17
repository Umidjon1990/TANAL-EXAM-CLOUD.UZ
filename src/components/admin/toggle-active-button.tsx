"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/actions/auth";

interface ToggleActiveButtonProps {
  id: string;
  isActive: boolean;
  action: (id: string) => Promise<ActionState>;
}

export function ToggleActiveButton({
  id,
  isActive,
  action,
}: ToggleActiveButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={isActive ? "outline" : "default"}
      disabled={isPending}
      onClick={() => startTransition(() => action(id).then(() => undefined))}
    >
      {isActive ? "O'chirish" : "Faollashtirish"}
    </Button>
  );
}
