import { prisma } from "@/lib/prisma";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  isCompatible: boolean;
}

export default async function AdminCompatibilityPage() {
  const vehicles = (await prisma.vehicle.findMany({
    orderBy: { brand: "asc" },
    take: 50,
  })) as Vehicle[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Compatibilité</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Marque</span>
          <span>Modèle</span>
          <span>Années</span>
          <span>Slug</span>
          <span>Compatibilité</span>
        </div>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{vehicle.brand}</span>
            <span>{vehicle.model}</span>
            <span className="text-muted-foreground">
              {vehicle.yearStart}
              {vehicle.yearEnd ? ` - ${vehicle.yearEnd}` : "+"}
            </span>
            <span className="text-muted-foreground">{vehicle.model.toLowerCase()}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                vehicle.isCompatible
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {vehicle.isCompatible ? "Oui" : "Non"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
