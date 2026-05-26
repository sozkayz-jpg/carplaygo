import React from 'react';
import { JSONLD, productSchema } from '@/components/JSONLD';
import Navbar from '@/components/Navbar';
import ProductGallery from '@/components/ProductGallery';

const TrustBadges = () => (
  <div className="flex flex-wrap justify-center gap-8 py-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
    <div className="flex items-center gap-2 font-semibold text-sm">
      <span>🚚 Livraison Gratuite</span>
    </div>
    <div className="flex items-center gap-2 font-semibold text-sm">
      <span>🛡️ Garantie 2 Ans</span>
    </div>
    <div className="flex items-center gap-2 font-semibold text-sm">
      <span>💳 Paiement Sécurisé</span>
    </div>
    <div className="flex items-center gap-2 font-semibold text-sm">
      <span>⭐️ 4.9/5 Avis Clients</span>
    </div>
  </div>
);

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      <Navbar />

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <JSONLD data={productSchema} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <ProductGallery />

          <div className="lg:pl-8">
            <div className="mb-2 inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
              NOUVEAUTÉ 2026
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4">CarplayGO Pro Max</h1>
            <p className="text-2xl font-medium mb-6 text-gray-900">89,99 €</p>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="flex text-yellow-400">★★★★★</div>
              <span className="text-sm text-gray-500">(+1240 avis vérifiés)</span>
            </div>

            <div className="space-y-6 mb-10">
              <p className="text-lg text-gray-600 leading-relaxed">
                Fini les câbles encombrants. CarplayGO transforme votre système filaire en une expérience 100% sans fil, 
                stable et ultra-rapide. Compatible avec 99% des véhicules d&apos;origine.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <span className="text-green-500">✓</span> Connexion automatique au démarrage
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <span className="text-green-500">✓</span> Sans latence audio et vidéo
                </li>
                <li className="flex items-center gap-3 text-gray-700 font-medium">
                  <span className="text-green-500">✓</span> Plug & Play : Installation en 30 secondes
                </li>
              </ul>
            </div>

            <button className="w-full bg-apple-blue text-white py-5 rounded-2xl text-xl font-semibold hover:opacity-90 transition-all mb-8 shadow-2xl">
              Ajouter au panier
            </button>

            <TrustBadges />
          </div>
        </div>
      </div>
    </div>
  );
}