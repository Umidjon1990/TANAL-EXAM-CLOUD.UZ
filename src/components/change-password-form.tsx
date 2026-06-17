"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { changePasswordAction } from "@/actions/account";
import type { ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <KeyRound className="size-4" />
      {pending ? "Saqlanmoqda..." : "Parolni o'zgartirish"}
    </Button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    changePasswordAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="max-w-md space-y-4">
      {state.error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="size-4 shrink-0" />
          Parol muvaffaqiyatli o'zgartirildi.
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Joriy parol</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Yangi parol</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          placeholder="Kamida 8 belgi"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Yangi parolni tasdiqlang</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <SubmitButton />
    </form>
  );
}
