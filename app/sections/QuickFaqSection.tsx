"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "CarplayGO fonctionne-t-il avec Android Auto ?",
    answer:
      "Non, CarplayGO est spécialement conçu pour Apple CarPlay. Il nécessite un iPhone avec iOS 10 ou supérieur.",
  },
  {
    question: "Ma voiture doit-elle avoir CarPlay d'origine ?",
    answer:
      "Oui, votre véhicule doit être équipé de CarPlay filaire d'origine. CarplayGO transforme simplement la connexion filaire en sans fil.",
  },
  {
    question: "Quelle est la qualité de la connexion sans fil ?",
    answer:
      "La connexion utilise Bluetooth pour l'appairage et Wi-Fi pour le transfert de données. La qualité est identique au câble, sans latence perceptible.",
  },
  {
    question: "Puis-je encore utiliser le câble pour charger ?",
    answer:
      "Absolument. CarplayGO libère le port USB que vous pouvez alors utiliser pour charger votre iPhone avec un chargeur rapide.",
  },
  {
    question: "Quelle est la politique de retour ?",
    answer:
      "Satisfait ou remboursé 30 jours. Si CarplayGO ne convient pas à votre véhicule ou ne vous satisfait pas, nous vous remboursons intégralement.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 font-heading text-base font-medium text-foreground">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuickFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-y border-border bg-card/30 py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center font-heading text-3xl font-bold text-foreground md:text-4xl"
        >
          Questions fréquentes
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card px-6"
        >
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Voir toutes les questions
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
