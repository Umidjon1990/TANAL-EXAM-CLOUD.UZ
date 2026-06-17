"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { createTestCenterAction } from "@/actions/test-centers";
import type { ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { REGIONS } from "@/lib/constants";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Plus className="size-4" />
      {pending ? "Saqlanmoqda..." : "Markaz qo'shish"}
    </Button>
  );
}

export function CreateCenterForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createTestCenterAction,
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
          Test markazi muvaffaqiyatli qo'shildi.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Markaz nomi</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Masalan: Al-Manhal o'quv markazi"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Viloyat</Label>
          <Select id="region" name="region" required defaultValue="">
            <option value="" disabled>
              Tanlang...
            </option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Shahar / tuman</Label>
          <Input
            id="city"
            name="city"
            required
            placeholder="Masalan: Chilonzor"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Manzil (ixtiyoriy)</Label>
          <Input id="address" name="address" placeholder="To'liq manzil" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon (ixtiyoriy)</Label>
          <Input id="phone" name="phone" placeholder="+998901234567" />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
