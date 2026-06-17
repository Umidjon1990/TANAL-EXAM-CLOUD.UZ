import { Send, Newspaper, CheckCircle2, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAdminStats, getExamStatusBreakdown } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_VARIANTS } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Statistika" };

export default async function StatistikaPage() {
  const [stats, breakdown, recentLogs, totalExams] = await Promise.all([
    getAdminStats(),
    getExamStatusBreakdown(),
    prisma.telegramPostLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.examDate.count(),
  ]);

  const cards = [
    { label: "Tasdiqlangan", value: stats.approved, icon: CheckCircle2 },
    { label: "Kutilmoqda", value: stats.pending, icon: Clock },
    { label: "Nashr yangiliklar", value: stats.news, icon: Newspaper },
    { label: "Telegram e'lonlar", value: stats.telegramSent, icon: Send },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistika</h1>
        <p className="text-muted-foreground">
          Platforma faoliyati va tizim ko'rsatkichlari.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <c.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Imtihon statuslari taqsimoti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {breakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ma'lumot yo'q.</p>
            ) : (
              breakdown.map((b) => {
                const pct = totalExams
                  ? Math.round((b.count / totalExams) * 100)
                  : 0;
                return (
                  <div key={b.status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant={STATUS_VARIANTS[b.status]}>
                        {STATUS_LABELS[b.status]}
                      </Badge>
                      <span className="text-muted-foreground">
                        {b.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>So'nggi Telegram e'lonlar</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Hozircha e'lonlar yo'q.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tur</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Vaqt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">
                        {log.type === "EXAM_APPROVED" ? "Imtihon" : "Yangilik"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === "SENT"
                              ? "success"
                              : log.status === "FAILED"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
