import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const brandModels: Record<string, { name: string; models: string[] }> = {
  audi: {
    name: "Audi",
    models: [
      "A3",
      "A4",
      "A5",
      "Q3",
      "Q5",
      "Q7",
      "Q8",
      "A6",
      "A7",
      "A8",
      "TT",
      "e-tron",
    ],
  },
  bmw: {
    name: "BMW",
    models: [
      "Série 1",
      "Série 2",
      "Série 3",
      "Série 4",
      "Série 5",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "i3",
      "i4",
      "iX",
    ],
  },
  mercedes: {
    name: "Mercedes",
    models: [
      "Classe A",
      "Classe B",
      "Classe C",
      "Classe E",
      "Classe S",
      "CLA",
      "GLA",
      "GLB",
      "GLC",
      "GLE",
      "GLS",
      "EQA",
      "EQB",
      "EQC",
    ],
  },
  volkswagen: {
    name: "Volkswagen",
    models: [
      "Golf",
      "Polo",
      "Tiguan",
      "Passat",
      "T-Roc",
      "Arteon",
      "Touareg",
      "ID.3",
      "ID.4",
      "Up!",
    ],
  },
  toyota: {
    name: "Toyota",
    models: [
      "Yaris",
      "Corolla",
      "C-HR",
      "RAV4",
      "Camry",
      "Prius",
      "Supra",
      "Highlander",
    ],
  },
  ford: {
    name: "Ford",
    models: [
      "Fiesta",
      "Focus",
      "Kuga",
      "Puma",
      "Mustang",
      "Explorer",
      "Bronco",
      "Edge",
    ],
  },
  peugeot: {
    name: "Peugeot",
    models: ["208", "308", "508", "2008", "3008", "5008", "Rifter"],
  },
  renault: {
    name: "Renault",
    models: ["Clio", "Megane", "Captur", "Arkana", "Koleos", "Zoe"],
  },
};

export async function generateStaticParams() {
  return Object.keys(brandModels).map((slug) => ({ marque: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ marque: string }>;
}): Promise<Metadata> {
  const { marque } = await params;
  const brand = brandModels[marque];
  if (!brand) return { title: "Non trouvé" };

  return {
    title: `${brand.name} — Compatibilité`,
    description: `Liste des modèles ${brand.name} compatibles avec CarplayGO.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ marque: string }>;
}) {
  const { marque } = await params;
  const brand = brandModels[marque];
  if (!brand) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
        {brand.name}
      </h1>
      <p className="mb-12 text-muted-foreground">
        {brand.models.length} modèles compatibles avec CarplayGO.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brand.models.map((model) => (
          <div
            key={model}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="font-medium">{model}</p>
            <p className="mt-1 text-sm text-green-400">Compatible</p>
          </div>
        ))}
      </div>

      <Link
        href="/compatibilite"
        className="mt-12 inline-block text-sm text-primary hover:underline"
      >
        ← Retour aux marques
      </Link>
    </main>
  );
}
