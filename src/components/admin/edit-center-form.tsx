"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import { updateTestCenterAction } from "@/actions/test-centers";
import type { ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { REGIONS } from "@/lib/constants";

export interface CenterValues {
  id: string;
  name: string;
  region: string;
  city: string;
  address: string | null;
  phone: string | null;
  telegram: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      <Save className="size-4" />
      {pending ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
    </Button>
  );
}

export function EditCenterForm({ center }: { center: CenterValues }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateTestCenterAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="centerId" value={center.id} />

      {state.error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="size-4 shrink-0" />
          O'zgarishlar saqlandi.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Markaz nomi</Label>
          <Input id="name" name="name" required defaultValue={center.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Viloyat</Label>
          <Select
            id="region"
            name="region"
            required
            defaultValue={center.region}
          >
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
          <Input id="city" name="city" required defaultValue={center.city} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Manzil (ixtiyoriy)</Label>
          <Input
            id="address"
            name="address"
            defaultValue={center.address ?? ""}
            placeholder="To'liq manzil"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon (ixtiyoriy)</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={center.phone ?? ""}
            placeholder="+998901234567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telegram">Telegram (ixtiyoriy)</Label>
          <Input
            id="telegram"
            name="telegram"
            defaultValue={center.telegram ?? ""}
            placeholder="@username yoki https://t.me/..."
          />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
