import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide d'installation — CarplayGO",
  description:
    "Installez CarplayGO en 2 minutes. Notre guide étape par étape avec vidéo et checklist.",
};

const steps = [
  {
    title: "Branchez l'adaptateur",
    desc: "Insérez CarplayGO dans le port USB de votre voiture ou utilisez l'adaptateur allume-cigare fourni. L'appareil s'allume automatiquement.",
  },
  {
    title: "Activez le Bluetooth",
    desc: "Sur votre smartphone, ouvrez les paramètres Bluetooth et appairez l'appareil 'CarplayGO-XXXX'. Une fois connecté, le lien Wi-Fi s'établit automatiquement.",
  },
  {
    title: "Lancez CarPlay ou Android Auto",
    desc: "L'écran de votre voiture affiche l'interface CarPlay (iPhone) ou Android Auto. Appuyez sur l'icône et profitez de la navigation, de la musique et des appels sans fil.",
  },
];

const checklist = [
  "Port USB ou allume-cigare fonctionnel",
  "Smartphone compatible iOS 10+ ou Android 9+",
  "Bluetooth et Wi-Fi activés",
  "CarPlay ou Android Auto installé sur le téléphone",
  "Écran d'infodivertissement allumé",
];

export default function InstallationPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="mb-4 font-heading text-4xl font-bold">
        Guide d'installation
      </h1>
      <p className="mb-12 text-muted-foreground">
        Trois étapes simples. Deux minutes chrono.
      </p>

      <div className="space-y-8">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div>
              <h2 className="mb-2 font-heading text-xl font-semibold">
                {step.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-6 font-heading text-xl font-semibold">
          Checklist avant installation
        </h2>
        <ul className="space-y-3">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary text-primary">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
