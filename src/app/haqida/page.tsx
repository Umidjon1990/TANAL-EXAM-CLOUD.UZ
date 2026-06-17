import type { Metadata } from "next";
import { ShieldCheck, Target, Users2, Workflow } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Loyiha haqida",
  description:
    "TANAL imtihon platformasi maqsadi, ishlash tartibi va ishonchlilik tamoyillari haqida.",
};

const PRINCIPLES = [
  {
    icon: Target,
    title: "Maqsad",
    text: "O'zbekiston bo'ylab TANAL arab tili sertifikat imtihonlari sanalarini yagona, ishonchli manbada to'plash.",
  },
  {
    icon: ShieldCheck,
    title: "Ishonchlilik",
    text: "Har bir imtihon sanasi bosh administrator tomonidan tekshiriladi va tasdiqlanadi. Tasdiqlanmagan ma'lumot ommaga chiqmaydi.",
  },
  {
    icon: Users2,
    title: "Vakolatli markazlar",
    text: "Faqat rasmiy ro'yxatdan o'tgan test markazlari imtihon sanalarini taklif qila oladi.",
  },
  {
    icon: Workflow,
    title: "Shaffof jarayon",
    text: "Markaz sana taklif qiladi → administrator tasdiqlaydi → sana ommaga va Telegram kanalga chiqadi.",
  },
];

export default function HaqidaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container max-w-4xl py-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {APP_NAME} haqida
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Bu platforma talabalarga kerakli imtihon sanasini bir necha soniyada
            topish, test markazlariga esa sanalarni shaffof e'lon qilish
            imkonini beradi.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <Card key={p.title}>
                <CardHeader>
                  <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <p.icon className="size-5" />
                  </span>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {p.text}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
