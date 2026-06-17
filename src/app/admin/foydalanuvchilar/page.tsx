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
import { CreateUserForm } from "@/components/admin/create-user-form";
import { ToggleActiveButton } from "@/components/admin/toggle-active-button";
import { toggleUserActiveAction } from "@/actions/users";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FoydalanuvchilarPage() {
  const [centers, users] = await Promise.all([
    prisma.testCenter.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      include: { testCenter: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Foydalanuvchilar</h1>
        <p className="text-muted-foreground">
          Test markaz adminlarini yarating. Ommaviy ro'yxatdan o'tish mavjud emas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yangi admin yaratish</CardTitle>
          <CardDescription>
            Yaratilgan login va parolni admin bilan xavfsiz ulashing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm centers={centers} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barcha foydalanuvchilar ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ism</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Markaz</TableHead>
                <TableHead>Yaratilgan</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    @{u.username}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                      {ROLE_LABELS[u.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.testCenter?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? "success" : "secondary"}>
                      {u.isActive ? "Faol" : "O'chirilgan"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {u.role === "SUPER_ADMIN" ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <ToggleActiveButton
                        id={u.id}
                        isActive={u.isActive}
                        action={toggleUserActiveAction}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
