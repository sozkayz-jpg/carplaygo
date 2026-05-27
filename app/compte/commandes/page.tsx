import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const orders = userId
    ? await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Aucune commande pour le moment.</p>
          <Link
            href="/checkout"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm text-primary-foreground"
          >
            Commander
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/compte/commandes/${order.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(order.total / 100).toFixed(2)}€</p>
                <p className="text-sm text-muted-foreground">{order.status}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
