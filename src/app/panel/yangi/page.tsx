import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitExamForm } from "@/components/panel/submit-exam-form";

export const metadata = { title: "Yangi imtihon sanasi" };

export default function YangiImtihonPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Yangi imtihon sanasi taklif qilish
        </h1>
        <p className="text-muted-foreground">
          Yuborilgan sana bosh administrator tomonidan tasdiqlanmaguncha ommaga
          ko'rinmaydi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Imtihon ma'lumotlari</CardTitle>
          <CardDescription>
            Barcha majburiy maydonlarni to'ldiring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmitExamForm />
        </CardContent>
      </Card>
    </div>
  );
}
