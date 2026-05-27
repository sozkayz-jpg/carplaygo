import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { orders: true, addresses: true, reviews: true },
  });

  if (!user) notFound();

  return (
    <div>
      <Link
        href="/admin/clients"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Retour aux clients
      </Link>
      <h1 className="mb-8 font-heading text-3xl font-bold">
        {user.firstName} {user.lastName}
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Informations</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email: </span>{user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Rôle: </span>{user.role}
            </p>
            <p>
              <span className="text-muted-foreground">Inscrit le: </span>
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Commandes</h2>
          <p className="font-heading text-3xl font-bold">{user.orders.length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Avis</h2>
          <p className="font-heading text-3xl font-bold">{user.reviews.length}</p>
        </div>
      </div>
    </div>
  );
}
