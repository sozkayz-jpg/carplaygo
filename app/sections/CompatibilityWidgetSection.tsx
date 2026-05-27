"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle, ArrowRight } from "lucide-react";

const brands = ["Audi", "BMW", "Mercedes", "Volkswagen", "Toyota", "Ford"];
const models: Record<string, string[]> = {
  Audi: ["A3", "A4", "A5", "Q3", "Q5", "Q7"],
  BMW: ["Série 1", "Série 2", "Série 3", "X1", "X3", "X5"],
  Mercedes: ["Classe A", "Classe B", "Classe C", "GLA", "GLC", "GLE"],
  Volkswagen: ["Golf", "Polo", "Tiguan", "Passat", "T-Roc", "Arteon"],
  Toyota: ["Yaris", "Corolla", "C-HR", "RAV4", "Camry", "Prius"],
  Ford: ["Fiesta", "Focus", "Kuga", "Puma", "Mustang", "Explorer"],
};
const years = Array.from({ length: 10 }, (_, i) => 2026 - i);

export default function CompatibilityWidgetSection() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (brand && model && year) {
      setChecked(true);
    }
  };

  return (
    <section className="border-y border-border bg-card/30 py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center font-heading text-3xl font-bold text-foreground md:text-4xl"
        >
          Compatible avec votre voiture ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 text-center text-muted-foreground"
        >
          Sélectionnez votre véhicule pour vérifier la compatibilité
          instantanément.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Marque
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setModel("");
                  setChecked(false);
                }}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">Choisir...</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Modèle
              </label>
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                  setChecked(false);
                }}
                disabled={!brand}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-50"
              >
                <option value="">Choisir...</option>
                {brand &&
                  models[brand]?.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">
                Année
              </label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setChecked(false);
                }}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">Choisir...</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={!brand || !model || !year}
            className="mt-6 w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Vérifier la compatibilité
            </span>
          </button>

          {checked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                <CheckCircle className="h-6 w-6 shrink-0 text-green-400" />
                <div>
                  <p className="font-medium text-foreground">Compatible !</p>
                  <p className="text-sm text-muted-foreground">
                    Votre {brand} {model} ({year}) est compatible avec CarplayGO.
                  </p>
                </div>
              </div>
              <Link
                href="/compatibilite"
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Voir toutes les compatibilités
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
