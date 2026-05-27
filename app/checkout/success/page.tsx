import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-400" />
        <h1 className="mb-2 font-heading text-2xl font-bold">
          Commande confirmée !
        </h1>
        <p className="mb-8 text-muted-foreground">
          Merci pour votre commande. Vous recevrez un email de confirmation
          dans quelques instants.
        </p>
        <Link
          href="/compte/commandes"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Voir mes commandes
        </Link>
      </div>
    </div>
  );
}
