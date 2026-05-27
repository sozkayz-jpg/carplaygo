import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  const [
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order
      .aggregate({ _sum: { total: true } })
      .then((r) => r._sum.total || 0),
    prisma.user.count(),
    prisma.product.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const monthlyRevenue = recentOrders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("fr-FR", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Analytics</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Commandes totales</p>
          <p className="font-heading text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Revenus totaux</p>
          <p className="font-heading text-3xl font-bold">
            {(totalRevenue / 100).toFixed(2)}€
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Clients</p>
          <p className="font-heading text-3xl font-bold">{totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Produits</p>
          <p className="font-heading text-3xl font-bold">{totalProducts}</p>
        </div>
      </div>

      <h2 className="mb-4 font-heading text-xl font-bold">Revenus par mois</h2>
      <div className="rounded-2xl border border-border bg-card p-6">
        {Object.entries(monthlyRevenue).map(([month, amount]) => (
          <div key={month} className="mb-4 flex items-center gap-4">
            <span className="w-16 text-sm font-medium">{month}</span>
            <div className="flex-1">
              <div
                className="h-4 rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, (amount / totalRevenue) * 100)}%`,
                }}
              />
            </div>
            <span className="w-20 text-right text-sm">
              {(amount / 100).toFixed(0)}€
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
