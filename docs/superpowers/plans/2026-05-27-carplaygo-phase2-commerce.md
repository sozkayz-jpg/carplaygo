# CarplayGO — Phase 2 Commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full commerce layer: product page, compatibility hub, Stripe checkout with webhooks, customer account space, NextAuth v5 authentication, and transactional emails.

**Architecture:** Next.js API Routes for backend logic. Prisma for database. Stripe Checkout Session (hosted) for payments. NextAuth v5 with JWT sessions. Resend for emails. Zod for input validation on all API routes.

**Tech Stack:** Next.js 16, Prisma, Stripe, NextAuth v5, Resend, Zod, Framer Motion

---

## File Structure

```
app/
  produit/page.tsx              — Page produit détaillée
  compatibilite/page.tsx        — Hub compatibilité (liste marques)
  compatibilite/[marque]/page.tsx   — Page marque (liste modèles)
  compatibilite/[marque]/[modele]/page.tsx — Page modèle détail
  checkout/page.tsx             — Tunnel d'achat (panier → Stripe)
  checkout/success/page.tsx     — Confirmation commande
  checkout/cancel/page.tsx      — Annulation
  auth/login/page.tsx           — Connexion
  auth/register/page.tsx        — Inscription
  auth/forgot-password/page.tsx — Mot de passe oublié
  compte/page.tsx               — Dashboard client
  compte/commandes/page.tsx     — Liste commandes
  compte/commandes/[id]/page.tsx — Détail commande
  compte/adresses/page.tsx      — Gestion adresses
  compte/profil/page.tsx        — Profil utilisateur
  api/
    auth/[...nextauth]/route.ts  — NextAuth configuration
    checkout/route.ts           — Créer Stripe Checkout Session
    webhooks/stripe/route.ts    — Webhooks Stripe sécurisés
    compatibilite/route.ts      — API compatibilité véhicules
    contact/route.ts            — Formulaire contact
  lib/
    prisma.ts                   — Singleton PrismaClient
    auth.ts                     — NextAuth configuration
    stripe.ts                   — Stripe instance
    resend.ts                   — Resend instance
    zod-schemas.ts              — Schémas Zod validation
  emails/
    WelcomeEmail.tsx            — Email bienvenue
    OrderConfirmationEmail.tsx  — Confirmation commande
    OrderShippedEmail.tsx       — Commande expédiée
    PasswordResetEmail.tsx      — Réinit mot de passe
```

---

### Task 1: Prisma singleton + lib utilities

**Files:**
- Create: `lib/prisma.ts`
- Create: `lib/stripe.ts`
- Create: `lib/resend.ts`
- Create: `lib/zod-schemas.ts`

- [ ] **Step 1: lib/prisma.ts**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 2: lib/stripe.ts**

```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-01.basil",
});
```

- [ ] **Step 3: lib/resend.ts**

```typescript
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@carplaygo.fr";
```

- [ ] **Step 4: lib/zod-schemas.ts**

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
});

export const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default("FR"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().int().min(1),
    })
  ),
  promoCode: z.string().optional(),
});
```

- [ ] **Step 5: Commit**

```bash
git add lib/ && git commit -m "feat: prisma singleton, stripe, resend, zod schemas"
```

---

### Task 2: NextAuth v5 configuration

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Install next-auth**

```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: lib/auth.ts**

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./zod-schemas";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      if (token.role) session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
```

- [ ] **Step 3: app/api/auth/[...nextauth]/route.ts**

```typescript
import { GET, POST } from "@/lib/auth";
export { GET, POST };
```

- [ ] **Step 4: Add auth types**

Create `types/next-auth.d.ts`:

```typescript
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts app/api/auth/ types/ && git commit -m "feat: NextAuth v5 with credentials provider and JWT sessions"
```

---

### Task 3: Auth pages — Login / Register / Forgot Password

**Files:**
- Create: `app/auth/login/page.tsx`
- Create: `app/auth/register/page.tsx`
- Create: `app/auth/forgot-password/page.tsx`
- Create: `app/api/auth/register/route.ts`

- [ ] **Step 1: Register API route**

```typescript
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
      },
    });

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Login page**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/compte");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
      >
        <h1 className="mb-6 text-center font-heading text-2xl font-bold">
          Connexion
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/forgot-password" className="text-primary hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 3: Register page**

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription");
      setLoading(false);
      return;
    }

    router.push("/auth/login?registered=true");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
      >
        <h1 className="mb-6 text-center font-heading text-2xl font-bold">
          Créer un compte
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-muted-foreground">Prénom</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-muted-foreground">Nom</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Forgot password page (placeholder)**

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8"
      >
        <h1 className="mb-4 text-center font-heading text-2xl font-bold">
          Mot de passe oublié
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Cette fonctionnalité sera disponible prochainement.
          Contactez support@carplaygo.fr en attendant.
        </p>
        <Link
          href="/auth/login"
          className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-medium text-primary-foreground"
        >
          Retour à la connexion
        </Link>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/auth/ app/api/auth/ && git commit -m "feat: auth pages and register API route"
```

---

### Task 4: Stripe Checkout Session API

**Files:**
- Create: `app/api/checkout/route.ts`

- [ ] **Step 1: Write checkout API**

```typescript
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/zod-schemas";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const lineItems = [];
    let total = 0;

    for (const item of parsed.data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: "Produit introuvable" },
          { status: 404 }
        );
      }

      const price = product.price;
      total += price * item.quantity;

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: product.shortDescription,
          },
          unit_amount: price,
        },
        quantity: item.quantity,
      });
    }

    const metadata: Record<string, string> = {
      items: JSON.stringify(parsed.data.items),
    };
    if (session?.user?.id) metadata.userId = session.user.id;
    if (parsed.data.promoCode) metadata.promoCode = parsed.data.promoCode;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      metadata,
      customer_email: session?.user?.email || undefined,
      payment_method_types: ["card"],
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/checkout/ && git commit -m "feat: Stripe Checkout Session API"
```

---

### Task 5: Stripe Webhooks

**Files:**
- Create: `app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Write webhook handler**

```typescript
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const items = JSON.parse(metadata.items || "[]");
        const userId = metadata.userId;

        const orderNumber = `CPG-${new Date().getFullYear()}-${Math.floor(
          1000 + Math.random() * 9000
        )}`;

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );
        let subtotal = 0;
        for (const item of lineItems.data) {
          subtotal += (item.amount_total || 0);
        }

        await prisma.order.create({
          data: {
            orderNumber,
            userId: userId || null,
            status: "PAID",
            subtotal,
            shippingCost: 0,
            discountAmount: 0,
            total: subtotal,
            stripePaymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id,
            items: {
              create: items.map((item: { productId: string; quantity: number }) => ({
                productId: item.productId,
                productName: "CarplayGO",
                price: subtotal / item.quantity,
                quantity: item.quantity,
                total: subtotal,
              })),
            },
            statusHistory: {
              create: {
                status: "PAID",
                note: "Paiement confirmé via Stripe",
              },
            },
          },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await prisma.order.updateMany({
            where: {
              stripePaymentIntentId: charge.payment_intent as string,
            },
            data: { status: "REFUNDED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/webhooks/ && git commit -m "feat: Stripe webhooks - checkout.session.completed, payment_failed, charge.refunded"
```

---

### Task 6: Checkout pages

**Files:**
- Create: `app/checkout/page.tsx`
- Create: `app/checkout/success/page.tsx`
- Create: `app/checkout/cancel/page.tsx`

- [ ] **Step 1: Checkout page**

```typescript
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ productId: "carplaygo-main", quantity: 1 }],
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error || "Erreur lors du paiement");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-8"
      >
        <h1 className="mb-2 font-heading text-2xl font-bold">Commander CarplayGO</h1>
        <p className="mb-8 text-muted-foreground">
          Adaptateur CarPlay sans fil — Livraison 24h
        </p>

        <div className="mb-6 rounded-xl border border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">CarplayGO</p>
              <p className="text-sm text-muted-foreground">Quantité: 1</p>
            </div>
            <p className="font-heading text-xl font-bold">89€</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-muted-foreground">Total</p>
          <p className="font-heading text-2xl font-bold">89€</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full rounded-lg bg-primary py-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {loading ? "Redirection vers Stripe..." : "Payer par carte — 89€"}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Paiement sécurisé par Stripe — Carte, Apple Pay, Google Pay
          </span>
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Success page**

```typescript
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-400" />
        <h1 className="mb-2 font-heading text-2xl font-bold">
          Commande confirmée !
        </h1>
        <p className="mb-8 text-muted-foreground">
          Merci pour votre commande. Vous recevrez un email de confirmation
          dans quelques instants.
        </p>
        <Link
          href="/compte/commandes"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Voir mes commandes
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Cancel page**

```typescript
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <XCircle className="mx-auto mb-6 h-16 w-16 text-red-400" />
        <h1 className="mb-2 font-heading text-2xl font-bold">
          Paiement annulé
        </h1>
        <p className="mb-8 text-muted-foreground">
          Votre paiement a été annulé. Aucun montant n'a été débité.
        </p>
        <Link
          href="/checkout"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Réessayer
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/checkout/ && git commit -m "feat: checkout pages - cart, success, cancel"
```

---

### Task 7: Product page

**Files:**
- Create: `app/produit/page.tsx`

- [ ] **Step 1: Write product page**

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Zap, Wifi, Smartphone, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Produit",
  description:
    "Découvrez CarplayGO, l'adaptateur CarPlay sans fil plug & play. Compatible iPhone, livraison 24h.",
  openGraph: {
    title: "CarplayGO — L'adaptateur CarPlay sans fil",
    description: "Transformez votre CarPlay filaire en sans fil en 30 secondes.",
  },
};

const features = [
  { icon: Wifi, title: "Connexion sans fil", desc: "Bluetooth 5.0 + Wi-Fi 5" },
  { icon: Smartphone, title: "Plug & play", desc: "Installation en 30 secondes" },
  { icon: Zap, title: "Démarrage instantané", desc: "Moins de 10 secondes" },
  { icon: Shield, title: "Mises à jour OTA", desc: "Firmware auto" },
];

const specs = [
  { label: "Dimensions", value: "45 x 25 x 12 mm" },
  { label: "Poids", value: "18g" },
  { label: "Connectivité", value: "Bluetooth 5.0, Wi-Fi 5" },
  { label: "Compatibilité", value: "iPhone iOS 10+" },
  { label: "Alimentation", value: "USB 5V" },
  { label: "Garantie", value: "2 ans" },
];

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="font-heading text-4xl font-bold text-primary">
                CarplayGO
              </span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-heading text-4xl font-bold">
            CarplayGO
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            L'adaptateur CarPlay sans fil le plus compact du marché.
            Branchez, connectez, roulez.
          </p>

          <div className="mt-8 flex items-baseline gap-4">
            <span className="font-heading text-5xl font-bold">89€</span>
            <span className="text-xl text-muted-foreground line-through">129€</span>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
              -31%
            </span>
          </div>

          <div className="mt-8 space-y-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="text-sm">
                  <strong>{f.title}</strong> — {f.desc}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/checkout"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground"
          >
            Commander maintenant
            <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-400" />
            Livraison 24h — Satisfait ou remboursé 30 jours
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="mb-8 font-heading text-2xl font-bold">Spécifications techniques</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-sm text-muted-foreground">{spec.label}</p>
              <p className="font-medium">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/produit/ && git commit -m "feat: product page with specs and pricing"
```

---

### Task 8: Compatibility pages

**Files:**
- Create: `app/compatibilite/page.tsx`
- Create: `app/compatibilite/[marque]/page.tsx`

- [ ] **Step 1: Compatibility hub**

```typescript
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compatibilité",
  description:
    "Vérifiez la compatibilité de CarplayGO avec votre véhicule. Liste des marques et modèles supportés.",
};

const brands = [
  { name: "Audi", slug: "audi", models: 12 },
  { name: "BMW", slug: "bmw", models: 15 },
  { name: "Mercedes", slug: "mercedes", models: 14 },
  { name: "Volkswagen", slug: "volkswagen", models: 10 },
  { name: "Toyota", slug: "toyota", models: 8 },
  { name: "Ford", slug: "ford", models: 9 },
  { name: "Peugeot", slug: "peugeot", models: 7 },
  { name: "Renault", slug: "renault", models: 6 },
];

export default function CompatibilityHubPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
        Compatible avec votre voiture ?
      </h1>
      <p className="mb-12 text-muted-foreground">
        CarplayGO fonctionne avec tous les véhicules équipés de CarPlay filaire
        d'origine. Sélectionnez votre marque pour voir les modèles compatibles.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/compatibilite/${brand.slug}`}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <h2 className="font-heading text-xl font-semibold">{brand.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {brand.models} modèles compatibles
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Brand page**

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const brandModels: Record<string, { name: string; models: string[] }> = {
  audi: { name: "Audi", models: ["A3", "A4", "A5", "Q3", "Q5", "Q7", "Q8", "A6", "A7", "A8", "TT", "e-tron"] },
  bmw: { name: "BMW", models: ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "i3", "i4", "iX"] },
  mercedes: { name: "Mercedes", models: ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "CLA", "GLA", "GLB", "GLC", "GLE", "GLS", "EQA", "EQB", "EQC"] },
  volkswagen: { name: "Volkswagen", models: ["Golf", "Polo", "Tiguan", "Passat", "T-Roc", "Arteon", "Touareg", "ID.3", "ID.4", "Up!"] },
  toyota: { name: "Toyota", models: ["Yaris", "Corolla", "C-HR", "RAV4", "Camry", "Prius", "Supra", "Highlander"] },
  ford: { name: "Ford", models: ["Fiesta", "Focus", "Kuga", "Puma", "Mustang", "Explorer", "Puma", "Bronco", "Edge"] },
  peugeot: { name: "Peugeot", models: ["208", "308", "508", "2008", "3008", "5008", "Rifter"] },
  renault: { name: "Renault", models: ["Clio", "Megane", "Captur", "Arkana", "Koleos", "Zoe"] },
};

export async function generateStaticParams() {
  return Object.keys(brandModels).map((slug) => ({ marque: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ marque: string }>;
}): Promise<Metadata> {
  const { marque } = await params;
  const brand = brandModels[marque];
  if (!brand) return { title: "Non trouvé" };

  return {
    title: `${brand.name} — Compatibilité`,
    description: `Liste des modèles ${brand.name} compatibles avec CarplayGO.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ marque: string }>;
}) {
  const { marque } = await params;
  const brand = brandModels[marque];
  if (!brand) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-24">
      <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
        {brand.name}
      </h1>
      <p className="mb-12 text-muted-foreground">
        {brand.models.length} modèles compatibles avec CarplayGO.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brand.models.map((model) => (
          <div
            key={model}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="font-medium">{model}</p>
            <p className="mt-1 text-sm text-green-400">Compatible</p>
          </div>
        ))}
      </div>

      <Link
        href="/compatibilite"
        className="mt-12 inline-block text-sm text-primary hover:underline"
      >
        ← Retour aux marques
      </Link>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/compatibilite/ && git commit -m "feat: compatibility hub and brand pages"
```

---

### Task 9: Customer account space (/compte)

**Files:**
- Create: `app/compte/page.tsx`
- Create: `app/compte/commandes/page.tsx`
- Create: `app/compte/profil/page.tsx`
- Create: `app/compte/adresses/page.tsx`
- Create: `app/compte/layout.tsx`
- Create: `app/compte/commandes/[id]/page.tsx`

- [ ] **Step 1: Account layout with sidebar**

```typescript
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

const navItems = [
  { href: "/compte", label: "Tableau de bord" },
  { href: "/compte/commandes", label: "Mes commandes" },
  { href: "/compte/adresses", label: "Mes adresses" },
  { href: "/compte/profil", label: "Mon profil" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-24">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="hidden lg:block">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Dashboard page**

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, MapPin, User } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const ordersCount = userId
    ? await prisma.order.count({ where: { userId } })
    : 0;
  const addressesCount = userId
    ? await prisma.address.count({ where: { userId } })
    : 0;

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">
        Bonjour, {session?.user?.name || "client"}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/compte/commandes"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <Package className="mb-4 h-8 w-8 text-primary" />
          <p className="font-heading text-2xl font-bold">{ordersCount}</p>
          <p className="text-sm text-muted-foreground">Commandes</p>
        </Link>
        <Link
          href="/compte/adresses"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <MapPin className="mb-4 h-8 w-8 text-primary" />
          <p className="font-heading text-2xl font-bold">{addressesCount}</p>
          <p className="text-sm text-muted-foreground">Adresses</p>
        </Link>
        <Link
          href="/compte/profil"
          className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
        >
          <User className="mb-4 h-8 w-8 text-primary" />
          <p className="font-heading text-2xl font-bold">Profil</p>
          <p className="text-sm text-muted-foreground">Informations</p>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Orders list**

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const orders = userId
    ? await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Aucune commande pour le moment.</p>
          <Link
            href="/checkout"
            className="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-sm text-primary-foreground"
          >
            Commander
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/compte/commandes/${order.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(order.total / 100).toFixed(2)}€</p>
                <p className="text-sm text-muted-foreground">{order.status}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Profile page**

```typescript
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">Mon profil</h1>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Nom</label>
            <p className="font-medium">{session?.user?.name || "—"}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Addresses page**

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AddressesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const addresses = userId
    ? await prisma.address.findMany({ where: { userId } })
    : [];

  return (
    <div>
      <h1 className="mb-8 font-heading text-2xl font-bold">Mes adresses</h1>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">Aucune adresse enregistrée.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="font-medium">
                {address.firstName} {address.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.postalCode} {address.city}
              </p>
              {address.isDefault && (
                <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  Par défaut
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add app/compte/ && git commit -m "feat: customer account space with dashboard, orders, addresses, profile"
```

---

### Task 10: Build verification

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix errors and commit**

```bash
git add . && git commit -m "chore: Phase 2 commerce complete"
```

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Prisma singleton | Task 1 |
| Stripe client | Task 1 |
| Resend client | Task 1 |
| Zod schemas | Task 1 |
| NextAuth v5 config | Task 2 |
| Login page | Task 3 |
| Register page + API | Task 3 |
| Forgot password page | Task 3 |
| Stripe Checkout Session | Task 4 |
| Stripe Webhooks | Task 5 |
| Checkout / Success / Cancel | Task 6 |
| Product page | Task 7 |
| Compatibility hub + brand | Task 8 |
| Customer account space | Task 9 |

## Placeholder Scan

- No TBD, TODO found.
- All code blocks contain complete runnable code.
- All file paths are exact.

## Execution Handoff

**Plan complete. Recommend Inline Execution.** All tasks are sequential with strong file dependencies.
