import { MapPin, Phone, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PublicCenter } from "@/lib/queries";

export function CenterCard({ center }: { center: PublicCenter }) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{center.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            <CalendarCheck className="mr-1 size-3" />
            {center._count.examDates}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="mt-auto space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          {center.region}, {center.city}
        </div>
        {center.address ? (
          <p className="pl-6 text-xs">{center.address}</p>
        ) : null}
        {center.phone ? (
          <div className="flex items-center gap-2">
            <Phone className="size-4" />
            {center.phone}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
