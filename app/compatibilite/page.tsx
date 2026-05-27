import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compatibilité",
  description:
    "Vérifiez la compatibilité de CarplayGO avec votre véhicule. Liste des marques et modèles supportés.",
};

const brands = [
  { name: "Audi", slug: "audi", models: 12 },
  { name: "BMW", slug: "bmw", models: 15 },
  { name: "Mercedes", slug: "mercedes", models: 14 },
  { name: "Volkswagen", slug: "volkswagen", models: 10 },
  { name: "Toyota", slug: "toyota", models: 8 },
  { name: "Ford", slug: "ford", models: 9 },
  { name: "Peugeot", slug: "peugeot", models: 7 },
  { name: "Renault", slug: "renault", models: 6 },
];

export default function CompatibilityHubPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
        Compatible avec votre voiture ?
      </h1>
      <p className="mb-12 text-muted-foreground">
        CarplayGO fonctionne avec tous les véhicules équipés de CarPlay filaire
        d'origine. Sélectionnez votre marque pour voir les modèles compatibles.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/compatibilite/${brand.slug}`}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <h2 className="font-heading text-xl font-semibold">{brand.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {brand.models} modèles compatibles
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
