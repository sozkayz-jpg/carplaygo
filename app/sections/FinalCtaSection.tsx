"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function FinalCtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
            Prêt à couper le câble ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Rejoignez plus de 2 000 conducteurs qui ont déjà transformé leur
            expérience CarPlay.
          </p>

          <div className="mt-10">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-lg font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Commander CarplayGO — 89€
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            Satisfait ou remboursé 30 jours — Livraison 24h
          </div>
        </motion.div>
      </div>
    </section>
  );
}
