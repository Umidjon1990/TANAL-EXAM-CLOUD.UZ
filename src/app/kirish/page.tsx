import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tizimga kirish",
  robots: { index: false, follow: false },
};

export default function KirishPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-6" />
        </span>
        <span className="text-lg font-bold">{APP_NAME}</span>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Tizimga kirish</CardTitle>
          <CardDescription>
            Administrator hisobingiz bilan kiring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Hisob faqat bosh administrator tomonidan yaratiladi. Ommaviy
            ro'yxatdan o'tish mavjud emas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
