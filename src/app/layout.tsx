import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CarplayGO | L\'expérience Carplay et Android Auto Sans Fil',
  description: 'Transformez votre voiture avec CarplayGO. Adaptateur sans fil premium pour Carplay et Android Auto. Installation rapide, connexion stable et design élégant.',
  keywords: 'carplay, android auto, adaptateur sans fil, carplay voiture, carplay sans fil',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
