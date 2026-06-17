"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CalendarPlus, CheckCircle2 } from "lucide-react";
import { submitExamAction } from "@/actions/exams";
import type { ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <CalendarPlus className="size-4" />
      {pending ? "Yuborilmoqda..." : "Tasdiqlashga yuborish"}
    </Button>
  );
}

export function SubmitExamForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    submitExamAction,
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
          Imtihon sanasi tasdiqlash uchun yuborildi.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="examDate">Imtihon sanasi</Label>
          <Input id="examDate" name="examDate" type="datetime-local" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationDeadline">
            Ro'yxatdan o'tish muddati (ixtiyoriy)
          </Label>
          <Input
            id="registrationDeadline"
            name="registrationDeadline"
            type="datetime-local"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">O'tkaziladigan joy</Label>
          <Input
            id="location"
            name="location"
            required
            placeholder="Masalan: Toshkent, Chilonzor, 5-bino"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Joylar soni (ixtiyoriy)</Label>
          <Input id="capacity" name="capacity" type="number" min={1} placeholder="50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Narx, so'm (ixtiyoriy)</Label>
          <Input id="price" name="price" type="number" min={0} placeholder="300000" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Qo'shimcha ma'lumot (ixtiyoriy)</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Imtihon haqida qo'shimcha tafsilotlar..."
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
