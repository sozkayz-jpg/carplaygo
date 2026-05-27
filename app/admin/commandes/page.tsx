import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  userId: string | null;
}

export default async function AdminOrdersPage() {
  const orders = (await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })) as Order[];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Commandes</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>N° Commande</span>
          <span>Client</span>
          <span>Date</span>
          <span>Total</span>
          <span>Statut</span>
        </div>
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/commandes/${order.id}`}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm transition-colors hover:bg-background last:border-0"
          >
            <span className="font-medium">{order.orderNumber}</span>
            <span className="text-muted-foreground">
              {order.userId || "Invité"}
            </span>
            <span className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </span>
            <span>{(order.total / 100).toFixed(2)}€</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {order.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
