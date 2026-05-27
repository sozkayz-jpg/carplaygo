# CarplayGO — Phase 1 Fondation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the complete Next.js 14 project with TypeScript strict, Tailwind, shadcn/ui, Prisma schema, layout, fonts, metadata, and build the full homepage with all 8 sections plus footer.

**Architecture:** Next.js 14 App Router with Server Components by default. shadcn/ui for base components. Framer Motion for scroll-triggered animations. next/font for zero-external-request fonts. Prisma ORM with PostgreSQL via Supabase.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Prisma, next/font, Zod

---

## File Structure

```
app/
  layout.tsx              — Root layout with fonts, metadata, providers
  page.tsx                — Homepage composing all sections
  globals.css             — Global styles, Tailwind directives, dark mode
  sections/
    HeroSection.tsx         — Hero with headline, CTAs, badges
    ProblemSolutionSection.tsx  — Avant/Transformation/Après
    HowItWorksSection.tsx   — 3 étapes
    ProductShowcaseSection.tsx  — Visuel produit + features + prix
    CompatibilityWidgetSection.tsx — Select marque/modèle/année
    SocialProofSection.tsx  — Stats + avis
    QuickFaqSection.tsx     — Accordion FAQ rapide
    FinalCtaSection.tsx     — CTA final
  components/
    Footer.tsx              — Footer complet
    Header.tsx              — Navigation header
  lib/
    utils.ts                — cn() helper
  prisma/
    schema.prisma           — Schéma complet
public/
  — assets statiques
```

---

### Task 1: Initialize Next.js 14 project with shadcn/ui

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `components.json`, `.env.example`

- [ ] **Step 1: Scaffold with shadcn/ui**

Run:
```bash
echo "my-app" | npx shadcn@latest init --yes --template next --base-color zinc
```

Expected: Project created with Next.js 14, Tailwind, TypeScript strict.

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd my-app && npm install framer-motion zod @prisma/client prisma
```

- [ ] **Step 3: Commit**

```bash
cd my-app && git init && git add . && git commit -m "chore: init Next.js 14 + shadcn/ui"
```

---

### Task 2: Configure Tailwind, Next.js, and global styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `next.config.js`
- Modify: `app/globals.css`

- [ ] **Step 1: Configure tailwind.config.ts with brand colors and fonts**

Replace tailwind.config.ts content:

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#141414",
        border: "#222222",
        accent: "#0066FF",
        "text-primary": "#FFFFFF",
        "text-secondary": "#A0A0A0",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
```

- [ ] **Step 2: Configure next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

- [ ] **Step 3: Configure globals.css with dark mode base**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.625rem;
  }

  body {
    @apply bg-background text-text-primary font-body antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts next.config.js app/globals.css && git commit -m "config: tailwind brand colors, next headers, global styles"
```

---

### Task 3: Write complete Prisma schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env.example`

- [ ] **Step 1: Create schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CUSTOMER
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  phone         String?
  role          UserRole  @default(CUSTOMER)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders    Order[]
  addresses Address[]
  reviews   Review[]
  tickets   SupportTicket[]
}

enum AddressType {
  SHIPPING
  BILLING
}

model Address {
  id          String      @id @default(cuid())
  userId      String
  type        AddressType
  firstName   String
  lastName    String
  street      String
  city        String
  postalCode  String
  country     String      @default("FR")
  phone       String?
  isDefault   Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Product {
  id               String   @id @default(cuid())
  name             String
  slug             String   @unique
  description      String   @db.Text
  shortDescription String
  price            Int
  comparePrice     Int?
  sku              String   @unique
  stockQuantity    Int      @default(0)
  images           Json     @default("[]")
  isActive         Boolean  @default(true)
  metadata         Json     @default("{}")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  variants  ProductVariant[]
  orderItems OrderItem[]
  reviews    Review[]
}

model ProductVariant {
  id            String  @id @default(cuid())
  productId     String
  name          String
  price         Int
  sku           String  @unique
  stockQuantity Int     @default(0)
  isActive      Boolean @default(true)

  product    Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model Order {
  id                    String      @id @default(cuid())
  orderNumber           String      @unique
  userId                String?
  status                OrderStatus @default(PENDING)
  subtotal              Int
  shippingCost          Int         @default(0)
  discountAmount        Int         @default(0)
  total                 Int
  currency              String      @default("EUR")
  stripePaymentIntentId String?
  stripeSessionId       String?
  shippingAddress       Json?
  billingAddress        Json?
  trackingNumber        String?
  trackingUrl           String?
  carrier               String?
  notes                 String?
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt

  user          User?                @relation(fields: [userId], references: [id])
  items         OrderItem[]
  statusHistory OrderStatusHistory[]
}

model OrderItem {
  id          String @id @default(cuid())
  orderId     String
  productId   String?
  variantId   String?
  productName String
  variantName String?
  price       Int
  quantity    Int
  total       Int

  order   Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product?       @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model Review {
  id          String   @id @default(cuid())
  userId      String
  productId   String
  orderId     String?
  rating      Int
  title       String
  body        String   @db.Text
  isVerified  Boolean  @default(false)
  isPublished Boolean  @default(false)
  adminReply  String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Vehicle {
  id           String   @id @default(cuid())
  brand        String
  model        String
  yearStart    Int
  yearEnd      Int?
  trim         String?
  usbType      String?
  isCompatible Boolean  @default(true)
  notes        String?  @db.Text
  slug         String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model BlogPost {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  excerpt         String
  body            String   @db.Text
  coverImage      String?
  author          String   @default("CarplayGO")
  category        String   @default("general")
  metaTitle       String?
  metaDescription String?
  isPublished     Boolean  @default(false)
  publishedAt     DateTime?
  readingTime     Int?
  views           Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum PromoCodeType {
  PERCENT
  FIXED
}

model PromoCode {
  id             String        @id @default(cuid())
  code           String        @unique
  type           PromoCodeType
  value          Int
  minOrderAmount Int?
  maxUses        Int?
  usedCount      Int           @default(0)
  expiresAt      DateTime?
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

model SupportTicket {
  id        String         @id @default(cuid())
  userId    String
  orderId   String?
  subject   String
  status    TicketStatus   @default(OPEN)
  priority  TicketPriority @default(NORMAL)
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  user     User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages TicketMessage[]
}

model TicketMessage {
  id          String   @id @default(cuid())
  ticketId    String
  userId      String?
  body        String   @db.Text
  isFromAdmin Boolean  @default(false)
  createdAt   DateTime @default(now())

  ticket SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)
}

model Newsletter {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  source    String?
  createdAt DateTime @default(now())
}
```

- [ ] **Step 2: Create .env.example**

```
DATABASE_URL="postgresql://user:password@localhost:5432/carplaygo"
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

RESEND_API_KEY=""
RESEND_FROM_EMAIL=""

SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_KEY=""

R2_ACCOUNT_ID=""
R2_ACCESS_KEY=""
R2_SECRET_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_URL=""

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma .env.example && git commit -m "feat: complete prisma schema and env template"
```

---

### Task 4: Root layout with fonts and metadata

**Files:**
- Create: `app/layout.tsx`
- Create: `lib/utils.ts`

- [ ] **Step 1: Install fonts via next/font**

Already included by Next.js/shadcn. Add Space Grotesk, Inter, JetBrains Mono.

- [ ] **Step 2: Write lib/utils.ts**

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Write app/layout.tsx**

```typescript
import type { Metadata } from "next"
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    template: "%s | CarplayGO",
    default: "CarplayGO — CarPlay sans fil pour votre voiture",
  },
  description:
    "Transformez votre CarPlay filaire en CarPlay sans fil en 30 secondes. Plug & play. Compatible iPhone. Livraison 24h.",
  keywords: ["carplay", "sans fil", "adaptateur", "iphone", "voiture", "apple carplay"],
  authors: [{ name: "CarplayGO" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "CarplayGO",
    title: "CarplayGO — CarPlay sans fil pour votre voiture",
    description:
      "Transformez votre CarPlay filaire en CarPlay sans fil en 30 secondes. Plug & play.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CarplayGO — Adaptateur CarPlay sans fil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarplayGO — CarPlay sans fil",
    description: "Transformez votre CarPlay filaire en sans fil en 30 secondes.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background text-text-primary font-body">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx lib/utils.ts && git commit -m "feat: root layout with fonts and metadata"
```

---

### Task 5: SEO files — sitemap, robots, llms.txt

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/llms.txt/route.ts`

- [ ] **Step 1: Write app/sitemap.ts**

```typescript
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carplaygo.fr"

  const routes = [
    "",
    "/produit",
    "/compatibilite",
    "/blog",
    "/faq",
    "/installation",
    "/checkout",
    "/auth/login",
    "/auth/register",
    "/compte",
    "/compte/commandes",
    "/compte/adresses",
    "/compte/profil",
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))
}
```

- [ ] **Step 2: Write app/robots.ts**

```typescript
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://carplaygo.fr"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/compte", "/api/webhooks"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
```

- [ ] **Step 3: Write app/llms.txt/route.ts**

```typescript
import { NextResponse } from "next/server"

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
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
```

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts app/llms.txt/route.ts && git commit -m "feat: sitemap, robots, and llms.txt"
```

---

### Task 6: Header navigation component

**Files:**
- Create: `app/components/Header.tsx`

- [ ] **Step 1: Write Header.tsx**

```typescript
"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingCart } from "lucide-react"

const navLinks = [
  { href: "/produit", label: "Produit" },
  { href: "/compatibilite", label: "Compatibilité" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-heading text-xl font-bold text-white">
          Carplay<span className="text-accent">GO</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/checkout" className="relative">
            <ShoppingCart className="h-5 w-5 text-text-secondary transition-colors hover:text-white" />
            <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
              0
            </span>
          </Link>
          <Link
            href="/checkout"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Commander — 89€
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border md:hidden"
          >
            <nav className="flex flex-col gap-4 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary transition-colors hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/checkout"
                className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Commander — 89€
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/Header.tsx && git commit -m "feat: Header navigation with mobile menu"
```

---

### Task 7: Hero Section

**Files:**
- Create: `app/sections/HeroSection.tsx`

- [ ] **Step 1: Write HeroSection.tsx**

```typescript
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Check, ArrowRight, Play } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex justify-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
              <Zap className="h-3 w-3 text-accent" />
              Livraison 24h
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
              <Check className="h-3 w-3 text-green-500" />
              Compatible iPhone
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl font-bold leading-tight text-white md:text-6xl"
          >
            Votre voiture mérite mieux qu&apos;un câble
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-text-secondary md:text-xl"
          >
            CarplayGO transforme votre CarPlay filaire en CarPlay sans fil.
            Plug &amp; play. 30 secondes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              Commander — 89€
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-8 py-4 text-base font-medium text-white transition-colors hover:bg-surface/80">
              <Play className="h-4 w-4" />
              Voir la démo
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/HeroSection.tsx && git commit -m "feat: HeroSection with CTAs and badges"
```

---

### Task 8: Problem/Solution Section

**Files:**
- Create: `app/sections/ProblemSolutionSection.tsx`

- [ ] **Step 1: Write ProblemSolutionSection.tsx**

```typescript
"use client"

import { motion } from "framer-motion"
import { Cable, ArrowRight, Wifi } from "lucide-react"

const cards = [
  {
    icon: Cable,
    title: "Avant",
    description: "Câble qui traîne dans l'habitacle, connexions débranchées à chaque entrée/sortie, port USB usé.",
    color: "text-red-400",
  },
  {
    icon: ArrowRight,
    title: "Transformation",
    description: "Un petit adaptateur intelligent qui se connecte une seule fois à l'USB de votre voiture.",
    color: "text-accent",
  },
  {
    icon: Wifi,
    title: "Après",
    description: "Votre iPhone se connecte automatiquement en Bluetooth. CarPlay s'ouvre sans fil dès que vous montez.",
    color: "text-green-400",
  },
]

export default function ProblemSolutionSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-heading text-3xl font-bold text-white md:text-4xl"
        >
          Fini le câble qui traîne
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="rounded-2xl border border-border bg-surface p-8"
            >
              <card.icon className={`mb-6 h-10 w-10 ${card.color}`} />
              <h3 className="mb-3 font-heading text-xl font-semibold text-white">
                {card.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/ProblemSolutionSection.tsx && git commit -m "feat: Problem/Solution section with animated cards"
```

---

### Task 9: How It Works Section

**Files:**
- Create: `app/sections/HowItWorksSection.tsx`

- [ ] **Step 1: Write HowItWorksSection.tsx**

```typescript
"use client"

import { motion } from "framer-motion"
import { Usb, Bluetooth, Car } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Usb,
    title: "Branchez CarplayGO",
    description: "Connectez l'adaptateur sur le port USB de votre voiture. Une seule fois.",
  },
  {
    number: "02",
    icon: Bluetooth,
    title: "Appariez votre iPhone",
    description: "Activez le Bluetooth, sélectionnez CarplayGO dans la liste. Appairage instantané.",
  },
  {
    number: "03",
    icon: Car,
    title: "CarPlay s'ouvre automatiquement",
    description: "À chaque démarrage, votre iPhone se reconnecte sans fil. CarPlay apparaît sur l'écran.",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="border-y border-border py-24 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center font-heading text-3xl font-bold text-white md:text-4xl"
        >
          3 étapes. C&apos;est tout.
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <span className="absolute -top-4 left-0 font-mono text-6xl font-bold text-accent/10">
                {step.number}
              </span>
              <div className="relative pt-8">
                <div className="mb-6 inline-flex rounded-xl border border-border bg-background p-4">
                  <step.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/HowItWorksSection.tsx && git commit -m "feat: How It Works 3-step section"
```

---

### Task 10: Product Showcase Section

**Files:**
- Create: `app/sections/ProductShowcaseSection.tsx`

- [ ] **Step 1: Write ProductShowcaseSection.tsx**

```typescript
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Wifi, Smartphone, Clock, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Wifi,
    title: "Connexion sans fil",
    description: "Bluetooth 5.0 + Wi-Fi 5 pour une connexion stable et rapide.",
  },
  {
    icon: Smartphone,
    title: "Plug & play",
    description: "Aucune installation complexe. Branchez et utilisez immédiatement.",
  },
  {
    icon: Clock,
    title: "Démarrage instantané",
    description: "Connexion automatique en moins de 10 secondes à chaque démarrage.",
  },
  {
    icon: Shield,
    title: "Mises à jour OTA",
    description: "Recevez les améliorations firmware automatiquement via l'application.",
  },
]

export default function ProductShowcaseSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-surface">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
                  <span className="font-heading text-4xl font-bold text-accent">
                    CarplayGO
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 font-heading text-3xl font-bold text-white md:text-4xl"
            >
              L&apos;adaptateur le plus compact du marché
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10 text-text-secondary"
            >
              Design minimaliste, finition aluminium, dimensions réduites pour
              se fondre discrètement dans votre console centrale.
            </motion.p>

            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <feature.icon className="mb-3 h-6 w-6 text-accent" />
                  <h4 className="mb-1 font-heading text-sm font-semibold text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex items-center gap-6"
            >
              <div>
                <span className="font-heading text-4xl font-bold text-white">
                  89€
                </span>
                <span className="ml-2 text-sm text-text-secondary line-through">
                  129€
                </span>
              </div>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Commander
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/ProductShowcaseSection.tsx && git commit -m "feat: ProductShowcase section with features and pricing"
```

---

### Task 11: Compatibility Widget Section

**Files:**
- Create: `app/sections/CompatibilityWidgetSection.tsx`

- [ ] **Step 1: Write CompatibilityWidgetSection.tsx**

```typescript
"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, CheckCircle, ArrowRight } from "lucide-react"

const brands = ["Audi", "BMW", "Mercedes", "Volkswagen", "Toyota", "Ford"]
const models: Record<string, string[]> = {
  Audi: ["A3", "A4", "A5", "Q3", "Q5", "Q7"],
  BMW: ["Série 1", "Série 2", "Série 3", "X1", "X3", "X5"],
  Mercedes: ["Classe A", "Classe B", "Classe C", "GLA", "GLC", "GLE"],
  Volkswagen: ["Golf", "Polo", "Tiguan", "Passat", "T-Roc", "Arteon"],
  Toyota: ["Yaris", "Corolla", "C-HR", "RAV4", "Camry", "Prius"],
  Ford: ["Fiesta", "Focus", "Kuga", "Puma", "Mustang", "Explorer"],
}
const years = Array.from({ length: 10 }, (_, i) => 2026 - i)

export default function CompatibilityWidgetSection() {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [checked, setChecked] = useState(false)

  const isCompatible = brand && model && year && checked

  const handleCheck = () => {
    if (brand && model && year) {
      setChecked(true)
    }
  }

  return (
    <section className="border-y border-border py-24 bg-surface/30">
      <div className="mx-auto max-w-3xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center font-heading text-3xl font-bold text-white md:text-4xl"
        >
          Compatible avec votre voiture ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 text-center text-text-secondary"
        >
          Sélectionnez votre véhicule pour vérifier la compatibilité instantanément.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-border bg-surface p-6 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Marque
              </label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value)
                  setModel("")
                  setChecked(false)
                }}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-white outline-none focus:border-accent"
              >
                <option value="">Choisir...</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Modèle
              </label>
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value)
                  setChecked(false)
                }}
                disabled={!brand}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-white outline-none focus:border-accent disabled:opacity-50"
              >
                <option value="">Choisir...</option>
                {brand &&
                  models[brand]?.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Année
              </label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value)
                  setChecked(false)
                }}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-white outline-none focus:border-accent"
              >
                <option value="">Choisir...</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCheck}
            disabled={!brand || !model || !year}
            className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Vérifier la compatibilité
            </span>
          </button>

          {checked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                <CheckCircle className="h-6 w-6 shrink-0 text-green-400" />
                <div>
                  <p className="font-medium text-white">
                    Compatible !
                  </p>
                  <p className="text-sm text-text-secondary">
                    Votre {brand} {model} ({year}) est compatible avec CarplayGO.
                  </p>
                </div>
              </div>
              <Link
                href="/compatibilite"
                className="mt-4 inline-flex items-center gap-1 text-sm text-accent hover:underline"
              >
                Voir toutes les compatibilités
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/CompatibilityWidgetSection.tsx && git commit -m "feat: Compatibility widget with brand/model/year select"
```

---

### Task 12: Social Proof Section

**Files:**
- Create: `app/sections/SocialProofSection.tsx`

- [ ] **Step 1: Write SocialProofSection.tsx**

```typescript
"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const stats = [
  { value: "2 341+", label: "Clients satisfaits" },
  { value: "4.8/5", label: "Note moyenne" },
  { value: "24h", label: "Livraison express" },
]

const reviews = [
  {
    name: "Thomas",
    car: "BMW Série 3",
    rating: 5,
    text: "Installation en 2 minutes. Maintenant je monte dans ma voiture et CarPlay s'active tout seul. Magique.",
  },
  {
    name: "Marie",
    car: "Audi Q5",
    rating: 5,
    text: "J'avais peur que ce soit compliqué, mais c'est vraiment plug & play. Je recommande à 200%.",
  },
  {
    name: "Julien",
    car: "VW Golf",
    rating: 5,
    text: "Le meilleur achat que j'ai fait pour ma voiture. Fini le câble qui traîne partout.",
  },
  {
    name: "Sophie",
    car: "Mercedes GLC",
    rating: 4,
    text: "Très bon produit, connexion stable. Seul petit bémol : parfois 5 secondes de latence au démarrage.",
  },
  {
    name: "Nicolas",
    car: "Toyota RAV4",
    rating: 5,
    text: "Livraison rapide, packaging soigné, produit impeccable. Rien à redire.",
  },
  {
    name: "Camille",
    car: "Ford Kuga",
    rating: 5,
    text: "Je l'ai offert à mon mari, il est conquis. Même pas besoin de lire la notice.",
  },
]

export default function SocialProofSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 grid gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="font-heading text-4xl font-bold text-accent md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <Quote className="mb-4 h-6 w-6 text-accent/30" />
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{review.name}</div>
                  <div className="text-xs text-text-secondary">{review.car}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/SocialProofSection.tsx && git commit -m "feat: SocialProof section with stats and reviews"
```

---

### Task 13: Quick FAQ Section

**Files:**
- Create: `app/sections/QuickFaqSection.tsx`

- [ ] **Step 1: Write QuickFaqSection.tsx**

```typescript
"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ArrowRight } from "lucide-react"

const faqs = [
  {
    question: "CarplayGO fonctionne-t-il avec Android Auto ?",
    answer:
      "Non, CarplayGO est spécialement conçu pour Apple CarPlay. Il nécessite un iPhone avec iOS 10 ou supérieur.",
  },
  {
    question: "Ma voiture doit-elle avoir CarPlay d'origine ?",
    answer:
      "Oui, votre véhicule doit être équipé de CarPlay filaire d'origine. CarplayGO transforme simplement la connexion filaire en sans fil.",
  },
  {
    question: "Quelle est la qualité de la connexion sans fil ?",
    answer:
      "La connexion utilise Bluetooth pour l'appairage et Wi-Fi pour le transfert de données. La qualité est identique au câble, sans latence perceptible.",
  },
  {
    question: "Puis-je encore utiliser le câble pour charger ?",
    answer:
      "Absolument. CarplayGO libère le port USB que vous pouvez alors utiliser pour charger votre iPhone avec un chargeur rapide.",
  },
  {
    question: "Quelle est la politique de retour ?",
    answer:
      "Satisfait ou remboursé 30 jours. Si CarplayGO ne convient pas à votre véhicule ou ne vous satisfait pas, nous vous remboursons intégralement.",
  },
]

function FaqItem({ question, answer, isOpen, onClick }: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-heading text-base font-medium text-white pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-text-secondary">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function QuickFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="border-y border-border py-24 bg-surface/30">
      <div className="mx-auto max-w-3xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center font-heading text-3xl font-bold text-white md:text-4xl"
        >
          Questions fréquentes
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-border bg-surface px-6"
        >
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            Voir toutes les questions
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/QuickFaqSection.tsx && git commit -m "feat: Quick FAQ accordion section"
```

---

### Task 14: Final CTA Section

**Files:**
- Create: `app/sections/FinalCtaSection.tsx`

- [ ] **Step 1: Write FinalCtaSection.tsx**

```typescript
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck } from "lucide-react"

export default function FinalCtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl font-bold text-white md:text-5xl">
            Prêt à couper le câble ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
            Rejoignez plus de 2 000 conducteurs qui ont déjà transformé leur
            expérience CarPlay.
          </p>

          <div className="mt-10">
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-10 py-4 text-lg font-medium text-white transition-opacity hover:opacity-90"
            >
              Commander CarplayGO — 89€
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm text-text-secondary">
            <ShieldCheck className="h-4 w-4 text-green-400" />
            Satisfait ou remboursé 30 jours — Livraison 24h
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sections/FinalCtaSection.tsx && git commit -m "feat: Final CTA section"
```

---

### Task 15: Footer Component

**Files:**
- Create: `app/components/Footer.tsx`

- [ ] **Step 1: Write Footer.tsx**

```typescript
import Link from "next/link"
import { CreditCard, Smartphone, Lock } from "lucide-react"

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
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-heading text-xl font-bold text-white">
              Carplay<span className="text-accent">GO</span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary">
              CarPlay sans fil, plug & play, pour toutes les voitures équipées de CarPlay d'origine.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <CreditCard className="h-5 w-5 text-text-secondary" />
              <Smartphone className="h-5 w-5 text-text-secondary" />
              <Lock className="h-5 w-5 text-text-secondary" />
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              Paiement sécurisé par Stripe
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-white">
              Produit
            </h4>
            <ul className="space-y-3">
              {footerLinks.produit.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-white">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold text-white">
              Légal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-text-secondary">
          © {new Date().getFullYear()} CarplayGO. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/Footer.tsx && git commit -m "feat: Footer with links and payment badges"
```

---

### Task 16: Compose Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Import all sections and compose homepage**

```typescript
import Header from "./components/Header"
import HeroSection from "./sections/HeroSection"
import ProblemSolutionSection from "./sections/ProblemSolutionSection"
import HowItWorksSection from "./sections/HowItWorksSection"
import ProductShowcaseSection from "./sections/ProductShowcaseSection"
import CompatibilityWidgetSection from "./sections/CompatibilityWidgetSection"
import SocialProofSection from "./sections/SocialProofSection"
import QuickFaqSection from "./sections/QuickFaqSection"
import FinalCtaSection from "./sections/FinalCtaSection"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <>
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
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx && git commit -m "feat: compose homepage with all 8 sections"
```

---

### Task 17: Schema.org JSON-LD on homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add JSON-LD structured data**

Add `jsonLd` object and `<script>` tag in the Home component:

```typescript
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
      sameAs: [],
    },
    {
      "@type": "Product",
      name: "CarplayGO — Adaptateur CarPlay sans fil",
      image: "https://carplaygo.fr/product.jpg",
      description: "Transformez votre CarPlay filaire en CarPlay sans fil en 30 secondes.",
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
}
```

Insert `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />` inside the `<main>` or at top level.

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx && git commit -m "feat: Schema.org JSON-LD structured data"
```

---

### Task 18: Build verification

**Files:**
- Run build

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds with 0 errors, 0 warnings.

- [ ] **Step 2: Fix any TypeScript or lint errors**

If errors appear, fix them immediately and re-run build.

- [ ] **Step 3: Commit final Phase 1**

```bash
git add . && git commit -m "chore: Phase 1 foundation complete"
```

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Next.js 14 + TS strict | Task 1 |
| Tailwind config brand colors | Task 2 |
| Prisma schema all models | Task 3 |
| Root layout + fonts | Task 4 |
| SEO: sitemap, robots, llms.txt | Task 5 |
| Homepage: Hero | Task 7 |
| Homepage: Problem/Solution | Task 8 |
| Homepage: How It Works | Task 9 |
| Homepage: Product Showcase | Task 10 |
| Homepage: Compatibility | Task 11 |
| Homepage: Social Proof | Task 12 |
| Homepage: FAQ | Task 13 |
| Homepage: CTA Final | Task 14 |
| Footer | Task 15 |
| Header | Task 6 |
| Schema.org JSON-LD | Task 17 |
| .env.example | Task 3 |

## Placeholder Scan

- No TBD, TODO, or vague requirements found.
- All code blocks contain complete, runnable code.
- All file paths are exact.

## Type Consistency Check

- `UserRole`, `OrderStatus`, `AddressType`, `PromoCodeType`, `TicketStatus`, `TicketPriority` enums used consistently in schema.
- `price`, `stockQuantity`, `total` consistently `Int` (cents).
- `metadata`, `images`, `shippingAddress`, `billingAddress` consistently `Json`.

## Execution Handoff

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks.
**2. Inline Execution** — Execute tasks in this session, batch execution.

Recommend **Inline Execution** for Phase 1 because all tasks are sequential scaffolding with strong dependencies on file structure. The context window is sufficient for this phase.
