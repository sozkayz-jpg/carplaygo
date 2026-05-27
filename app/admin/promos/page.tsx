import { prisma } from "@/lib/prisma";

interface PromoCode {
  id: string;
  code: string;
  type: string;
  value: number;
  usedCount: number;
  maxUses: number | null;
  isActive: boolean;
  expiresAt: Date | null;
}

export default async function AdminPromosPage() {
  const promos = (await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  })) as PromoCode[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Codes promo</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-6 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Code</span>
          <span>Type</span>
          <span>Valeur</span>
          <span>Utilisations</span>
          <span>Statut</span>
          <span>Expiration</span>
        </div>
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="grid grid-cols-6 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{promo.code}</span>
            <span>{promo.type}</span>
            <span>{promo.value}{promo.type === "PERCENT" ? "%" : "€"}</span>
            <span>{promo.usedCount}{promo.maxUses ? ` / ${promo.maxUses}` : ""}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                promo.isActive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {promo.isActive ? "Actif" : "Inactif"}
            </span>
            <span className="text-muted-foreground">
              {promo.expiresAt
                ? new Date(promo.expiresAt).toLocaleDateString("fr-FR")
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
