import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AddressesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const addresses = userId
    ? await prisma.address.findMany({ where: { userId } })
    : [];

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">Mes adresses</h1>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Aucune adresse enregistrée.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="font-medium">
                {address.firstName} {address.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.postalCode} {address.city}
              </p>
              {address.isDefault && (
                <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  Par défaut
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
