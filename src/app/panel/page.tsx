import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireTestCenterAdmin } from "@/lib/auth/guards";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { CancelExamButton } from "@/components/panel/cancel-exam-button";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PanelDashboardPage() {
  const session = await requireTestCenterAdmin();

  if (!session.testCenterId) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Sizga test markazi biriktirilmagan. Iltimos, bosh administrator bilan
          bog'laning.
        </CardContent>
      </Card>
    );
  }

  const [center, exams] = await Promise.all([
    prisma.testCenter.findUnique({
      where: { id: session.testCenterId },
      select: { name: true, region: true, city: true },
    }),
    prisma.examDate.findMany({
      where: { testCenterId: session.testCenterId },
      orderBy: { examDate: "desc" },
    }),
  ]);

  const cancellable = new Set(["PENDING", "APPROVED"]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {center?.name ?? "Mening markazim"}
          </h1>
          <p className="text-muted-foreground">
            {center ? `${center.region}, ${center.city}` : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/panel/yangi">
            <CalendarPlus className="size-4" />
            Yangi sana
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Imtihon sanalari ({exams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                Hozircha imtihon sanasi yo'q.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/panel/yangi">Birinchi sanani qo'shing</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Joy</TableHead>
                  <TableHead>Narx</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="text-right">Amal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">
                      {formatDate(exam.examDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {exam.location}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatPrice(exam.price)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={exam.status} />
                      {exam.status === "REJECTED" && exam.rejectReason ? (
                        <p className="mt-1 max-w-xs text-xs text-destructive">
                          {exam.rejectReason}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      {cancellable.has(exam.status) ? (
                        <CancelExamButton examId={exam.id} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
