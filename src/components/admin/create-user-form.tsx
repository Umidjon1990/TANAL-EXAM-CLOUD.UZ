"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { createUserAction } from "@/actions/users";
import type { ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface CenterOption {
  id: string;
  name: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <UserPlus className="size-4" />
      {pending ? "Yaratilmoqda..." : "Admin yaratish"}
    </Button>
  );
}

export function CreateUserForm({ centers }: { centers: CenterOption[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createUserAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="size-4 shrink-0" />
          Admin muvaffaqiyatli yaratildi.
        </div>
      ) : null}

      {centers.length === 0 ? (
        <p className="rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          Avval kamida bitta test markazi qo'shing.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">To'liq ism</Label>
            <Input id="fullName" name="fullName" required placeholder="Ism Familiya" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="testCenterId">Test markazi</Label>
            <Select id="testCenterId" name="testCenterId" required defaultValue="">
              <option value="" disabled>
                Tanlang...
              </option>
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Foydalanuvchi nomi</Label>
            <Input
              id="username"
              name="username"
              required
              autoComplete="off"
              placeholder="login"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Parol</Label>
            <Input
              id="password"
              name="password"
              type="text"
              required
              autoComplete="new-password"
              placeholder="Kamida 8 belgi"
            />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton />
          </div>
        </div>
      )}
    </form>
  );
}
