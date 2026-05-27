"use client";

import { motion } from "framer-motion";
import { Usb, Bluetooth, Car } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Usb,
    title: "Branchez CarplayGO",
    description:
      "Connectez l'adaptateur sur le port USB de votre voiture. Une seule fois.",
  },
  {
    number: "02",
    icon: Bluetooth,
    title: "Appariez votre iPhone",
    description:
      "Activez le Bluetooth, sélectionnez CarplayGO dans la liste. Appairage instantané.",
  },
  {
    number: "03",
    icon: Car,
    title: "CarPlay s'ouvre automatiquement",
    description:
      "À chaque démarrage, votre iPhone se reconnecte sans fil. CarPlay apparaît sur l'écran.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-heading text-3xl font-bold text-foreground md:text-4xl"
        >
          3 étapes. C&apos;est tout.
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <span className="absolute -top-4 left-0 font-mono text-6xl font-bold text-primary/10">
                {step.number}
              </span>
              <div className="relative pt-8">
                <div className="mb-6 inline-flex rounded-xl border border-border bg-background p-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
