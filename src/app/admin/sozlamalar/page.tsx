import { requireSuperAdmin } from "@/lib/auth/guards";
import { env } from "@/lib/env";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordForm } from "@/components/change-password-form";
import { TelegramTestButton } from "@/components/admin/telegram-test-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sozlamalar" };

export default async function AdminSozlamalarPage() {
  const session = await requireSuperAdmin();
  const telegramConfigured = Boolean(
    env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHANNEL_ID,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sozlamalar</h1>
        <p className="text-muted-foreground">
          Hisob ma'lumotlari va xavfsizlik.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hisob</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <span className="text-muted-foreground">Login: </span>
          <span className="font-medium">{session.username}</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Telegram integratsiyasi</CardTitle>
            <Badge variant={telegramConfigured ? "success" : "secondary"}>
              {telegramConfigured ? "Sozlangan" : "Sozlanmagan"}
            </Badge>
          </div>
          <CardDescription>
            Imtihon tasdiqlanganda kanalga avtomatik e'lon yuboriladi. Bu yerdan
            test xabar yuborib, ulanishni tekshiring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {telegramConfigured ? (
            <TelegramTestButton />
          ) : (
            <p className="text-sm text-muted-foreground">
              Railway'da <code>TELEGRAM_BOT_TOKEN</code> va{" "}
              <code>TELEGRAM_CHANNEL_ID</code> o'zgaruvchilarini qo'shing, so'ng
              bu sahifani yangilang.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parolni o'zgartirish</CardTitle>
          <CardDescription>
            Xavfsizlik uchun kuchli parol tanlang (kamida 8 belgi).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
