"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const stats = [
  { value: "2 341+", label: "Clients satisfaits" },
  { value: "4.8/5", label: "Note moyenne" },
  { value: "24h", label: "Livraison express" },
];

const reviews = [
  {
    name: "Thomas",
    car: "BMW Série 3",
    rating: 5,
    text: "Installation en 2 minutes. Maintenant je monte dans ma voiture et CarPlay s'active tout seul. Magique.",
  },
  {
    name: "Marie",
    car: "Audi Q5",
    rating: 5,
    text: "J'avais peur que ce soit compliqué, mais c'est vraiment plug & play. Je recommande à 200%.",
  },
  {
    name: "Julien",
    car: "VW Golf",
    rating: 5,
    text: "Le meilleur achat que j'ai fait pour ma voiture. Fini le câble qui traîne partout.",
  },
  {
    name: "Sophie",
    car: "Mercedes GLC",
    rating: 4,
    text: "Très bon produit, connexion stable. Seul petit bémol : parfois 5 secondes de latence au démarrage.",
  },
  {
    name: "Nicolas",
    car: "Toyota RAV4",
    rating: 5,
    text: "Livraison rapide, packaging soigné, produit impeccable. Rien à redire.",
  },
  {
    name: "Camille",
    car: "Ford Kuga",
    rating: 5,
    text: "Je l'ai offert à mon mari, il est conquis. Même pas besoin de lire la notice.",
  },
];

export default function SocialProofSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 grid gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="font-heading text-4xl font-bold text-primary md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/30" />
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {review.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{review.car}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
