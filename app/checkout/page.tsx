"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ productId: "carplaygo-main", quantity: 1 }],
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error || "Erreur lors du paiement");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-8"
      >
        <h1 className="mb-2 font-heading text-2xl font-bold">Commander CarplayGO</h1>
        <p className="mb-8 text-muted-foreground">
          Adaptateur CarPlay sans fil — Livraison 24h
        </p>

        <div className="mb-6 rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">CarplayGO</p>
              <p className="text-sm text-muted-foreground">Quantité: 1</p>
            </div>
            <p className="font-heading text-xl font-bold">89€</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-muted-foreground">Total</p>
          <p className="font-heading text-2xl font-bold">89€</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full rounded-lg bg-primary py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {loading ? "Redirection vers Stripe..." : "Payer par carte — 89€"}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Paiement sécurisé par Stripe — Carte, Apple Pay, Google Pay
          </span>
        </div>
      </motion.div>
    </div>
  );
}
