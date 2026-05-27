import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/produits", label: "Produits", icon: "🛍️" },
  { href: "/admin/clients", label: "Clients", icon: "👥" },
  { href: "/admin/compatibilite", label: "Compatibilité", icon: "🚗" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/avis", label: "Avis", icon: "⭐" },
  { href: "/admin/promos", label: "Promos", icon: "🎟️" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/parametres", label: "Paramètres", icon: "⚙️" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-border bg-card p-6 lg:block">
        <Link href="/admin" className="mb-8 block font-heading text-xl font-bold">
          Carplay<span className="text-primary">GO</span> Admin
        </Link>
        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
