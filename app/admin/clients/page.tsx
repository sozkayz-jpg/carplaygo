import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: Date;
}

export default async function AdminCustomersPage() {
  const users = (await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })) as User[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Clients</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>ID</span>
          <span>Email</span>
          <span>Nom</span>
          <span>Rôle</span>
          <span>Inscription</span>
        </div>
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/admin/clients/${user.id}`}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm transition-colors hover:bg-background last:border-0"
          >
            <span className="font-medium">{user.id.slice(0, 8)}...</span>
            <span>{user.email}</span>
            <span className="text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                user.role === "ADMIN"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {user.role}
            </span>
            <span className="text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
