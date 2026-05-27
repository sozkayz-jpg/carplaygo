import { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Zap,
  Wifi,
  Smartphone,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Produit",
  description:
    "Découvrez CarplayGO, l'adaptateur CarPlay sans fil plug & play. Compatible iPhone, livraison 24h.",
  openGraph: {
    title: "CarplayGO — L'adaptateur CarPlay sans fil",
    description: "Transformez votre CarPlay filaire en sans fil en 30 secondes.",
  },
};

const features = [
  { icon: Wifi, title: "Connexion sans fil", desc: "Bluetooth 5.0 + Wi-Fi 5" },
  { icon: Smartphone, title: "Plug & play", desc: "Installation en 30 secondes" },
  { icon: Zap, title: "Démarrage instantané", desc: "Moins de 10 secondes" },
  { icon: Shield, title: "Mises à jour OTA", desc: "Firmware auto" },
];

const specs = [
  { label: "Dimensions", value: "45 x 25 x 12 mm" },
  { label: "Poids", value: "18g" },
  { label: "Connectivité", value: "Bluetooth 5.0, Wi-Fi 5" },
  { label: "Compatibilité", value: "iPhone iOS 10+" },
  { label: "Alimentation", value: "USB 5V" },
  { label: "Garantie", value: "2 ans" },
];

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="font-heading text-4xl font-bold text-primary">
                CarplayGO
              </span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-heading text-4xl font-bold">CarplayGO</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            L'adaptateur CarPlay sans fil le plus compact du marché. Branchez,
            connectez, roulez.
          </p>

          <div className="mt-8 flex items-baseline gap-4">
            <span className="font-heading text-5xl font-bold">89€</span>
            <span className="text-xl text-muted-foreground line-through">129€</span>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
              -31%
            </span>
          </div>

          <div className="mt-8 space-y-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  <strong>{f.title}</strong> — {f.desc}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/checkout"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground"
          >
            Commander maintenant
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-400" />
            Livraison 24h — Satisfait ou remboursé 30 jours
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="mb-8 font-heading text-2xl font-bold">
          Spécifications techniques
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-sm text-muted-foreground">{spec.label}</p>
              <p className="font-medium">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
