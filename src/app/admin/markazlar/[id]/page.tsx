import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCenterForm } from "@/components/admin/edit-center-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Markazni tahrirlash" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCenterPage({ params }: PageProps) {
  await requireSuperAdmin();
  const { id } = await params;

  const center = await prisma.testCenter.findUnique({ where: { id } });
  if (!center) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/markazlar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Markazlar
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Markazni tahrirlash
        </h1>
        <p className="text-muted-foreground">{center.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ma'lumotlar</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCenterForm
            center={{
              id: center.id,
              name: center.name,
              region: center.region,
              city: center.city,
              address: center.address,
              phone: center.phone,
              telegram: center.telegram,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
