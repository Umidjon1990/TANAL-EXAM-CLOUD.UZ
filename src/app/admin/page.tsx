import { Clock, CheckCircle2, Building2, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAdminStats } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExamReviewActions } from "@/components/admin/exam-review-actions";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, pendingExams] = await Promise.all([
    getAdminStats(),
    prisma.examDate.findMany({
      where: { status: "PENDING" },
      include: {
        testCenter: { select: { name: true, region: true } },
        submittedBy: { select: { fullName: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const statCards = [
    { label: "Tasdiqlash kutilmoqda", value: stats.pending, icon: Clock },
    {
      label: "Tasdiqlangan sanalar",
      value: stats.approved,
      icon: CheckCircle2,
    },
    { label: "Faol test markazlari", value: stats.centers, icon: Building2 },
    { label: "Markaz adminlari", value: stats.admins, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Boshqaruv paneli</h1>
        <p className="text-muted-foreground">
          Imtihon sanalarini tasdiqlang va tizimni boshqaring.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasdiqlash kutilayotgan sanalar</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingExams.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Hozircha tasdiqlanishi kerak bo'lgan sanalar yo'q.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Markaz</TableHead>
                  <TableHead>Imtihon sanasi</TableHead>
                  <TableHead>Joy</TableHead>
                  <TableHead>Yuborildi</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      <p className="font-medium">{exam.testCenter.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exam.testCenter.region}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDate(exam.examDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {exam.location}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(exam.createdAt)}
                      <br />
                      {exam.submittedBy.fullName}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <ExamReviewActions examId={exam.id} />
                      </div>
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
