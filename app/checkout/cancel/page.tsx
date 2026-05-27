import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <XCircle className="mx-auto mb-6 h-16 w-16 text-red-400" />
        <h1 className="mb-2 font-heading text-2xl font-bold">
          Paiement annulé
        </h1>
        <p className="mb-8 text-muted-foreground">
          Votre paiement a été annulé. Aucun montant n'a été débité.
        </p>
        <Link
          href="/checkout"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Réessayer
        </Link>
      </div>
    </div>
  );
}
