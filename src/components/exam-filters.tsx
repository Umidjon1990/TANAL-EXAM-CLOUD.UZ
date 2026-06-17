"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { REGIONS } from "@/lib/constants";

export function ExamFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  return (
    <div
      className="flex flex-col gap-3 sm:flex-row"
      data-pending={isPending ? "" : undefined}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Markaz nomi yoki joy bo'yicha qidirish..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => update("search", e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        defaultValue={searchParams.get("region") ?? ""}
        onChange={(e) => update("region", e.target.value)}
        className="sm:w-64"
        aria-label="Viloyat bo'yicha saralash"
      >
        <option value="">Barcha viloyatlar</option>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    </div>
  );
}
