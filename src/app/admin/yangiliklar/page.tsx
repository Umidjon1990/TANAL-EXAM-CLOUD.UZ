import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateNewsForm } from "@/components/admin/create-news-form";
import { NewsRowActions } from "@/components/admin/news-row-actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yangiliklar boshqaruvi" };

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { fullName: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Yangiliklar</h1>
        <p className="text-muted-foreground">
          Platforma yangiliklarini yarating va boshqaring.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yangi yangilik</CardTitle>
          <CardDescription>
            Nashr qilinganda Telegram kanaliga avtomatik e'lon qilinadi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateNewsForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barcha yangiliklar ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {news.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Hozircha yangilik yo'q.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sarlavha</TableHead>
                  <TableHead>Muallif</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="max-w-xs font-medium">
                      {n.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {n.author.fullName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(n.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={n.published ? "success" : "secondary"}>
                        {n.published ? "Nashr qilingan" : "Qoralama"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <NewsRowActions newsId={n.id} published={n.published} />
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
