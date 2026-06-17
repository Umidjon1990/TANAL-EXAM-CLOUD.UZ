"use client";

import { useTransition } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { deleteNewsAction, toggleNewsPublishedAction } from "@/actions/news";
import { Button } from "@/components/ui/button";

export function NewsRowActions({
  newsId,
  published,
}: {
  newsId: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          startTransition(() =>
            toggleNewsPublishedAction(newsId).then(() => undefined),
          )
        }
      >
        {published ? (
          <>
            <EyeOff className="size-4" /> Yashirish
          </>
        ) : (
          <>
            <Eye className="size-4" /> Nashr qilish
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Yangilik o'chirilsinmi? Bu amalni qaytarib bo'lmaydi."))
            return;
          startTransition(() => deleteNewsAction(newsId).then(() => undefined));
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
