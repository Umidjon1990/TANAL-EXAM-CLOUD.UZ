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
import { CreateCenterForm } from "@/components/admin/create-center-form";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";
import { toggleTestCenterActiveAction } from "@/actions/test-centers";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MarkazlarPage() {
  const centers = await prisma.testCenter.findMany({
    include: {
      _count: { select: { admins: true, examDates: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test markazlari</h1>
        <p className="text-muted-foreground">
          Vakolatli test markazlarini qo'shing va boshqaring.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yangi test markazi</CardTitle>
          <CardDescription>
            Markaz qo'shilgach, unga admin biriktirishingiz mumkin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCenterForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barcha markazlar ({centers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {centers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Hozircha test markazlari qo'shilmagan.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Markaz</TableHead>
                  <TableHead>Hudud</TableHead>
                  <TableHead>Adminlar</TableHead>
                  <TableHead>Imtihonlar</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="text-right">Amal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <p className="font-medium">{c.name}</p>
                      {c.phone ? (
                        <p className="text-xs text-muted-foreground">
                          {c.phone}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.region}, {c.city}
                    </TableCell>
                    <TableCell>{c._count.admins}</TableCell>
                    <TableCell>{c._count.examDates}</TableCell>
                    <TableCell>
                      <Badge variant={c.isActive ? "success" : "secondary"}>
                        {c.isActive ? "Faol" : "O'chirilgan"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/markazlar/${c.id}`}>
                            <Pencil className="size-4" />
                            Tahrirlash
                          </Link>
                        </Button>
                        <ToggleActiveButton
                          id={c.id}
                          isActive={c.isActive}
                          action={toggleTestCenterActiveAction}
                        />
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
