import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const csvPath = path.join(process.cwd(), 'keywords.csv');
  const content = fs.readFileSync(csvPath, 'utf8');
  
  return content
    .split('\n')
    .slice(1) // Skip header
    .filter(line => line.trim() !== '')
    .map(line => ({
      slug: line.trim().toLowerCase().replace(/\s+/g, '-'),
      keyword: line.trim()
    }))
    .map(item => ({ slug: item.slug }));
}

export default async function KeywordPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Mock data for demonstration, normally you'd fetch from a DB or a detailed CSV
  const title = slug.replace(/-/g, ' ').toUpperCase();
  
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-12 leading-relaxed">
          Découvrez l'excellence de la connectivité avec notre solution premium pour {title}. 
          Une intégration parfaite, sans fil et instantanée pour votre véhicule.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/product" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all">
            Acheter maintenant
          </a>
        </div>
      </div>
    </div>
  );
}
