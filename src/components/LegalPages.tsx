import React from 'react';

const LegalPage = ({ title, content }: { title: string; content: React.ReactNode }) => (
  <div className="min-h-screen bg-white text-[#1d1d1f] font-sans px-6 py-24">
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 tracking-tight">{title}</h1>
      <div className="prose prose-slate text-gray-600 space-y-6 leading-relaxed">
        {content}
      </div>
      <div className="mt-20 pt-10 border-t border-gray-100 text-center">
        <a href="/" className="text-blue-600 hover:underline">Retour à l'accueil</a>
      </div>
    </div>
  </div>
);

export function ShippingPage() {
  return (
    <LegalPage 
      title="Politique de Livraison" 
      content={
        <>
          <p>Nous nous engageons à livrer vos produits CarplayGO dans les meilleurs délais.</p>
          <h3 className="text-xl font-semibold text-black mt-6">Délais de Livraison</h3>
          <p>La livraison standard est estimée entre 3 et 7 jours ouvrés pour la France et l'Europe.</p>
          <h3 className="text-xl font-semibold text-black mt-6">Frais de Port</h3>
          <p>La livraison est actuellement offerte pour toute commande supérieure à 50€.</p>
          <h3 className="text-xl font-semibold text-black mt-6">Suivi de commande</h3>
          <p>Un numéro de suivi vous sera envoyé par e-mail dès l'expédition de votre commande.</p>
        </>
      }
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage 
      title="Conditions Générales de Vente" 
      content={
        <>
          <p>Bienvenue sur CarplayGO. Les présentes CGV régissent la vente des produits sur notre site.</p>
          <h3 className="text-xl font-semibold text-black mt-6">Droit de Rétraction</h3>
          <p>Conformément à la loi, vous disposez de 14 jours pour retourner le produit sans motif.</p>
          <h3 className="text-xl font-semibold text-black mt-6">Garantie</h3>
          <p>Tous nos produits bénéficient d'une garantie légale de conformité de 2 ans.</p>
        </>
      }
    />
  );
}

export function PrivacyPage() {
  return (
    <LegalPage 
      title="Politique de Confidentialité" 
      content={
        <>
          <p>CarplayGO respecte votre vie privée et vos données personnelles conformément au RGPD.</p>
          <h3 className="text-xl font-semibold text-black mt-6">Collecte de données</h3>
          <p>Nous collectons uniquement les données nécessaires au traitement de vos commandes.</p>
          <h3 className="text-xl font-semibold text-black mt-6">Sécurité</h3>
          <p>Vos données sont cryptées et sécurisées via SSL.</p>
        </>
      }
    />
  );
}
