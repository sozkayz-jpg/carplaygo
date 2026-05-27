import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [ordersCount, usersCount, productsCount, reviewsCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.review.count(),
    ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Commandes", value: ordersCount, href: "/admin/commandes" },
    { label: "Clients", value: usersCount, href: "/admin/clients" },
    { label: "Produits", value: productsCount, href: "/admin/produits" },
    { label: "Avis", value: reviewsCount, href: "/admin/avis" },
  ];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Dashboard</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-heading text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 font-heading text-xl font-bold">Commandes récentes</h2>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-4 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>N° Commande</span>
          <span>Date</span>
          <span>Total</span>
          <span>Statut</span>
        </div>
        {recentOrders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/commandes/${order.id}`}
            className="grid grid-cols-4 gap-4 border-b border-border p-4 text-sm transition-colors hover:bg-background last:border-0"
          >
            <span className="font-medium">{order.orderNumber}</span>
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
