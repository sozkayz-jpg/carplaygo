"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wifi, Smartphone, Clock, Shield, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Wifi,
    title: "Connexion sans fil",
    description:
      "Bluetooth 5.0 + Wi-Fi 5 pour une connexion stable et rapide.",
  },
  {
    icon: Smartphone,
    title: "Plug & play",
    description:
      "Aucune installation complexe. Branchez et utilisez immédiatement.",
  },
  {
    icon: Clock,
    title: "Démarrage instantané",
    description:
      "Connexion automatique en moins de 10 secondes à chaque démarrage.",
  },
  {
    icon: Shield,
    title: "Mises à jour OTA",
    description:
      "Recevez les améliorations firmware automatiquement via l'application.",
  },
];

export default function ProductShowcaseSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="font-heading text-4xl font-bold text-primary">
                    CarplayGO
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 font-heading text-3xl font-bold text-foreground md:text-4xl"
            >
              L&apos;adaptateur le plus compact du marché
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10 text-muted-foreground"
            >
              Design minimaliste, finition aluminium, dimensions réduites pour
              se fondre discrètement dans votre console centrale.
            </motion.p>

            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <feature.icon className="mb-3 h-6 w-6 text-primary" />
                  <h4 className="mb-1 font-heading text-sm font-semibold text-foreground">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex items-center gap-6"
            >
              <div>
                <span className="font-heading text-4xl font-bold text-foreground">
                  89€
                </span>
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  129€
                </span>
              </div>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Commander
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
