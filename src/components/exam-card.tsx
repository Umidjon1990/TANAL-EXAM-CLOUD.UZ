import { CalendarDays, MapPin, Phone, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { PublicExam } from "@/lib/queries";

export function ExamCard({ exam }: { exam: PublicExam }) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{exam.testCenter.name}</CardTitle>
          <Badge variant="success" className="shrink-0">
            Tasdiqlandi
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {exam.testCenter.region}, {exam.testCenter.city}
        </p>
      </CardHeader>
      <CardContent className="mt-auto space-y-2.5 text-sm">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <CalendarDays className="size-4 text-primary" />
          {formatDate(exam.examDate)}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          {exam.location}
        </div>
        {exam.capacity ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            {exam.capacity} ta joy
          </div>
        ) : null}
        {exam.price !== null ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="size-4" />
            {formatPrice(exam.price)}
          </div>
        ) : null}
        {exam.testCenter.phone ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4" />
            {exam.testCenter.phone}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
