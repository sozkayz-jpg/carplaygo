import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, MapPin, User } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const ordersCount = userId
    ? await prisma.order.count({ where: { userId } })
    : 0;
  const addressesCount = userId
    ? await prisma.address.count({ where: { userId } })
    : 0;

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">
        Bonjour, {session?.user?.name || "client"}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/compte/commandes"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <Package className="mb-4 h-8 w-8 text-primary" />
          <p className="font-heading text-2xl font-bold">{ordersCount}</p>
          <p className="text-sm text-muted-foreground">Commandes</p>
        </Link>
        <Link
          href="/compte/adresses"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <MapPin className="mb-4 h-8 w-8 text-primary" />
          <p className="font-heading text-2xl font-bold">{addressesCount}</p>
          <p className="text-sm text-muted-foreground">Adresses</p>
        </Link>
        <Link
          href="/compte/profil"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <User className="mb-4 h-8 w-8 text-primary" />
          <p className="font-heading text-2xl font-bold">Profil</p>
          <p className="text-sm text-muted-foreground">Informations</p>
        </Link>
      </div>
    </div>
  );
}
