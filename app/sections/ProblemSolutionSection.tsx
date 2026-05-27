"use client";

import { motion } from "framer-motion";
import { Cable, ArrowRight, Wifi } from "lucide-react";

const cards = [
  {
    icon: Cable,
    title: "Avant",
    description:
      "Câble qui traîne dans l'habitacle, connexions débranchées à chaque entrée/sortie, port USB usé.",
    color: "text-red-400",
  },
  {
    icon: ArrowRight,
    title: "Transformation",
    description:
      "Un petit adaptateur intelligent qui se connecte une seule fois à l'USB de votre voiture.",
    color: "text-primary",
  },
  {
    icon: Wifi,
    title: "Après",
    description:
      "Votre iPhone se connecte automatiquement en Bluetooth. CarPlay s'ouvre sans fil dès que vous montez.",
    color: "text-green-400",
  },
];

export default function ProblemSolutionSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-heading text-3xl font-bold text-foreground md:text-4xl"
        >
          Fini le câble qui traîne
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <card.icon className={`mb-6 h-10 w-10 ${card.color}`} />
              <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
