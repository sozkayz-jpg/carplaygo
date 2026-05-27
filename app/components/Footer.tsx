import Link from "next/link";
import { CreditCard, Smartphone, Lock } from "lucide-react";

const footerLinks = {
  produit: [
    { href: "/produit", label: "Le produit" },
    { href: "/compatibilite", label: "Compatibilité" },
    { href: "/installation", label: "Guide d'installation" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/cgv", label: "CGV" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="font-heading text-xl font-bold text-foreground"
            >
              Carplay<span className="text-primary">GO</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              CarPlay sans fil, plug & play, pour toutes les voitures équipées
              de CarPlay d'origine.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Paiement sécurisé par Stripe
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">
              Produit
            </h4>
            <ul className="space-y-3">
              {footerLinks.produit.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-foreground">
              Légal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CarplayGO. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
