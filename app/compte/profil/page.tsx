"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">Mon profil</h1>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Nom</label>
            <p className="font-medium">{session?.user?.name || "—"}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
