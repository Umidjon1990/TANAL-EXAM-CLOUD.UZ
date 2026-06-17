import { requireTestCenterAdmin } from "@/lib/auth/guards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangePasswordForm } from "@/components/change-password-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sozlamalar" };

export default async function PanelSozlamalarPage() {
  const session = await requireTestCenterAdmin();

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
