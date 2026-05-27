import { prisma } from "@/lib/prisma";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export default async function AdminProductsPage() {
  const products = (await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })) as Product[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Produits</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Nom</span>
          <span>Slug</span>
          <span>Prix</span>
          <span>Stock</span>
          <span>Statut</span>
        </div>
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{product.name}</span>
            <span className="text-muted-foreground">{product.slug}</span>
            <span>{(product.price / 100).toFixed(2)}€</span>
            <span>{product.stockQuantity}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                product.isActive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {product.isActive ? "Actif" : "Inactif"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
