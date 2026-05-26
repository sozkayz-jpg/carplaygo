import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroImage from '@/components/HeroImage';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans selection:bg-blue-100">
      <Navbar />

      <section className="pt-32 pb-20 px-6 text-center bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 animate-fade-in">
            CarplayGO
          </h1>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-600 mb-8 tracking-tight">
            L&apos;expérience ultime pour votre <span className="text-black">carplay voiture</span>
          </h2>
          <HeroImage />
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transformez votre conduite avec la liberté du sans-fil. 
            Une connexion instantanée, une stabilité absolue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/product" className="bg-apple-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all shadow-xl">
              Commander maintenant
            </Link>
            <Link href="/product" className="text-apple-blue px-8 py-4 rounded-full text-lg font-medium hover:underline transition-all">
              En savoir plus &gt;
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 bg-apple-gray rounded-3xl text-center group hover:shadow-2xl transition-all duration-500">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3">Connexion Instantanée</h3>
            <p className="text-gray-500">Démarrage automatique en moins de 10 secondes après l&apos;allumage du moteur.</p>
          </div>
          <div className="p-10 bg-apple-gray rounded-3xl text-center group hover:shadow-2xl transition-all duration-500">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-3">Multi-Compatibilité</h3>
            <p className="text-gray-500">Support complet pour iOS et Android. Un seul adaptateur pour tous vos appareils.</p>
          </div>
          <div className="p-10 bg-apple-gray rounded-3xl text-center group hover:shadow-2xl transition-all duration-500">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold mb-3">Qualité Premium</h3>
            <p className="text-gray-500">Conception robuste, dissipation thermique optimisée et matériaux haute fidélité.</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center bg-black text-white rounded-t-[3rem]">
        <h2 className="text-4xl md:text-6xl font-bold mb-8">Prêt pour le futur ?</h2>
        <Link href="/product" className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all">
          Acheter CarplayGO
        </Link>
      </section>
    </div>
  );
}