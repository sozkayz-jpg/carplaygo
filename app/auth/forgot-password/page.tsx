"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
      >
        <h1 className="mb-4 text-center font-heading text-2xl font-bold">
          Mot de passe oublié
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Cette fonctionnalité sera disponible prochainement.
          Contactez support@carplaygo.fr en attendant.
        </p>
        <Link
          href="/auth/login"
          className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-medium text-primary-foreground"
        >
          Retour à la connexion
        </Link>
      </motion.div>
    </div>
  );
}
