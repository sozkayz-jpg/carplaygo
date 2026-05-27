import Header from "./components/Header";
import HeroSection from "./sections/HeroSection";
import ProblemSolutionSection from "./sections/ProblemSolutionSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import ProductShowcaseSection from "./sections/ProductShowcaseSection";
import CompatibilityWidgetSection from "./sections/CompatibilityWidgetSection";
import SocialProofSection from "./sections/SocialProofSection";
import QuickFaqSection from "./sections/QuickFaqSection";
import FinalCtaSection from "./sections/FinalCtaSection";
import Footer from "./components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://carplaygo.fr/#website",
      url: "https://carplaygo.fr",
      name: "CarplayGO",
      description: "Adaptateur CarPlay sans fil plug & play",
      publisher: {
        "@type": "Organization",
        "@id": "https://carplaygo.fr/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://carplaygo.fr/#organization",
      name: "CarplayGO",
      url: "https://carplaygo.fr",
      logo: {
        "@type": "ImageObject",
        url: "https://carplaygo.fr/logo.png",
      },
    },
    {
      "@type": "Product",
      name: "CarplayGO — Adaptateur CarPlay sans fil",
      image: "https://carplaygo.fr/product.jpg",
      description:
        "Transformez votre CarPlay filaire en CarPlay sans fil en 30 secondes.",
      brand: {
        "@type": "Brand",
        name: "CarplayGO",
      },
      offers: {
        "@type": "Offer",
        url: "https://carplaygo.fr/produit",
        priceCurrency: "EUR",
        price: "89.00",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "CarplayGO",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "2341",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <HowItWorksSection />
        <ProductShowcaseSection />
        <CompatibilityWidgetSection />
        <SocialProofSection />
        <QuickFaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
