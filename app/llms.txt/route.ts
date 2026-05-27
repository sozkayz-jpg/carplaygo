import { NextResponse } from "next/server";

export async function GET() {
  const content = `# CarplayGO

> CarplayGO est un adaptateur CarPlay sans fil plug & play qui transforme votre CarPlay filaire en CarPlay sans fil en 30 secondes.

## Informations produit

- Prix : 89€
- Livraison : 24h en France métropolitaine
- Garantie : Satisfait ou remboursé 30 jours
- Compatible : iPhone avec iOS 10+ et véhicules avec CarPlay filaire d'origine
- Connexion : Bluetooth + Wi-Fi

## Pages importantes

- Accueil : /
- Produit : /produit
- Compatibilité : /compatibilite
- Blog : /blog
- FAQ : /faq
- Guide d'installation : /installation
- Checkout : /checkout

## Contact

- Email : support@carplaygo.fr
- FAQ complète disponible sur /faq
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
