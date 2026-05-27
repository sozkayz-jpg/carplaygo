import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — CarplayGO",
  description:
    "Toutes les réponses à vos questions sur CarplayGO : compatibilité, installation, livraison, garantie et retours.",
};

const faqs = [
  {
    question: "Qu'est-ce que CarplayGO ?",
    answer:
      "CarplayGO est un adaptateur sans fil plug-and-play qui ajoute Apple CarPlay et Android Auto à n'importe quelle voiture équipée d'un port USB ou d'une prise allume-cigare. Fini les câbles : connectez votre smartphone en Bluetooth et profitez de la navigation, des appels mains-libres, de Spotify et bien plus directement sur l'écran de votre voiture.",
  },
  {
    question: "Mon véhicule est-il compatible ?",
    answer:
      "CarplayGO fonctionne avec la plupart des véhicules disposant d'un écran d'infodivertissement et d'un port USB ou d'une prise allume-cigare. Consultez notre page de compatibilité pour vérifier si votre marque et modèle sont pris en charge. Nous couvrons plus de 500 modèles de 2010 à aujourd'hui.",
  },
  {
    question: "L'installation est-elle compliquée ?",
    answer:
      "Pas du tout. L'installation prend moins de 2 minutes : branchez l'adaptateur, connectez votre téléphone en Bluetooth, et c'est prêt. Aucun outil nécessaire, aucune modification du tableau de bord. Notre guide d'installation étape par étape est inclus dans la boîte.",
  },
  {
    question: "Quelle est la qualité de la connexion ?",
    answer:
      "CarplayGO utilise une connexion Wi-Fi 5 GHz haute performance pour un streaming fluide sans latence. Les appels sont cristallins, la navigation se met à jour en temps réel, et la musique est transmise en haute qualité sans coupures.",
  },
  {
    question: "Quels sont les délais et frais de livraison ?",
    answer:
      "Nous expédions sous 24h depuis nos entrepôts en France. La livraison standard est gratuite et prend 2 à 4 jours ouvrés. La livraison express est disponible en 24h pour 9,90 €.",
  },
  {
    question: "Quelle garantie et politique de retour ?",
    answer:
      "CarplayGO est garanti 2 ans. Vous disposez de 30 jours pour tester le produit. S'il ne vous convient pas, retournez-le gratuitement pour un remboursement complet, sans questions.",
  },
  {
    question: "Puis-je utiliser CarplayGO avec plusieurs smartphones ?",
    answer:
      "Oui, CarplayGO se souvient des téléphones déjà appairés. Vous pouvez connecter plusieurs appareils (iPhone et Android) et passer de l'un à l'autre facilement via les paramètres Bluetooth de votre voiture.",
  },
  {
    question: "CarplayGO nécessite-t-il un abonnement ?",
    answer:
      "Non, aucun abonnement n'est requis. Achetez une fois, utilisez pour toujours. Les mises à jour firmware sont gratuites et téléchargeables via notre site.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="mb-4 font-heading text-4xl font-bold">
        Questions fréquentes
      </h1>
      <p className="mb-12 text-muted-foreground">
        Tout ce que vous devez savoir sur CarplayGO.
      </p>

      <div className="space-y-8">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-2 font-heading text-lg font-semibold">
              {faq.question}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
