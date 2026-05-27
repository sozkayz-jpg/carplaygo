import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, statusHistory: true },
  });

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/commandes"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Retour aux commandes
      </Link>

      <h1 className="mb-8 font-heading text-3xl font-bold">
        {order.orderNumber}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Informations</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Statut: </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {order.status}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Date: </span>
              {new Date(order.createdAt).toLocaleString("fr-FR")}
            </p>
            <p>
              <span className="text-muted-foreground">Total: </span>
              {(order.total / 100).toFixed(2)}€
            </p>
            <p>
              <span className="text-muted-foreground">Stripe PI: </span>
              {order.stripePaymentIntentId || "—"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Articles</h2>
          <div className="space-y-3">
            {(order.items as unknown as OrderItem[]).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {(item.price / 100).toFixed(2)}€ x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.total / 100).toFixed(2)}€
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold">
          Historique des statuts
        </h2>
        <div className="space-y-2">
          {order.statusHistory.map((h) => (
            <div key={h.id} className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                {new Date(h.createdAt).toLocaleString("fr-FR")}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {h.status}
              </span>
              {h.note && <span className="text-muted-foreground">{h.note}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
