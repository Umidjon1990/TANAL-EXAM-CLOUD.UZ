"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { createNewsAction } from "@/actions/news";
import type { ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Plus className="size-4" />
      {pending ? "Saqlanmoqda..." : "Yangilik qo'shish"}
    </Button>
  );
}

export function CreateNewsForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createNewsAction,
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
          Yangilik muvaffaqiyatli saqlandi.
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="title">Sarlavha</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Yangilik sarlavhasi"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Qisqa tavsif (ixtiyoriy)</Label>
        <Input
          id="excerpt"
          name="excerpt"
          placeholder="Bir-ikki jumlali qisqacha"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Matn</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={6}
          placeholder="Yangilikning to'liq matni..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverImage">Muqova rasm URL (ixtiyoriy)</Label>
        <Input
          id="coverImage"
          name="coverImage"
          type="url"
          placeholder="https://..."
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          className="size-4 rounded border-input"
        />
        Darhol nashr qilish (va Telegram kanaliga e'lon)
      </label>

      <SubmitButton />
    </form>
  );
}
