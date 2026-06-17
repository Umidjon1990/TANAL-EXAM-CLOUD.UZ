import type { Metadata } from "next";
import { Mail, MapPin, Send } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Aloqa",
  description:
    "TANAL imtihon platformasi bilan bog'lanish. Test markazi sifatida qo'shilish uchun murojaat qiling.",
};

const CONTACTS = [
  {
    icon: Mail,
    title: "Elektron pochta",
    value: "info@tanal-exam.uz",
    href: "mailto:info@tanal-exam.uz",
  },
  {
    icon: Send,
    title: "Telegram kanal",
    value: "@tanal_imtihon",
    href: "https://t.me/tanal_imtihon",
  },
  {
    icon: MapPin,
    title: "Manzil",
    value: "Toshkent shahri, O'zbekiston",
    href: null,
  },
];

export default function AloqaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-4xl py-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Biz bilan bog'laning
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Savollar, takliflar yoki test markazi sifatida platformaga
            qo'shilish uchun quyidagi kanallar orqali murojaat qiling.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {CONTACTS.map((c) => {
              const inner = (
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <c.icon className="size-5" />
                    </span>
                    <CardTitle className="text-base">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {c.value}
                  </CardContent>
                </Card>
              );
              return c.href ? (
                <a key={c.title} href={c.href} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={c.title}>{inner}</div>
              );
            })}
          </div>

          <Card className="mt-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Test markazi bo'lib qo'shilmoqchimisiz?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Vakolatli test markazlari platformaga bosh administrator tomonidan
              qo'shiladi. Yuqoridagi pochta orqali markaz nomi, hudud va aloqa
              ma'lumotlarini yuboring — biz siz bilan bog'lanamiz va hisob
              yaratamiz.
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
