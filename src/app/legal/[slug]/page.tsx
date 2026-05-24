import { ShippingPage, TermsPage, PrivacyPage } from '@/components/LegalPages';

export async function generateStaticParams() {
  return [
    { slug: 'shipping' },
    { slug: 'terms' },
    { slug: 'privacy' },
  ];
}

export default function LegalRoute({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  if (slug === 'shipping') return <ShippingPage />;
  if (slug === 'terms') return <TermsPage />;
  if (slug === 'privacy') return <PrivacyPage />;
  
  return <div>Page non trouvée</div>;
}
