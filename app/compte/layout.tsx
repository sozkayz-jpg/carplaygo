import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

const navItems = [
  { href: "/compte", label: "Tableau de bord" },
  { href: "/compte/commandes", label: "Mes commandes" },
  { href: "/compte/adresses", label: "Mes adresses" },
  { href: "/compte/profil", label: "Mon profil" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-24">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
