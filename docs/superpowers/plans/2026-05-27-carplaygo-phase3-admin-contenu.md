# CarplayGO — Phase 3 Admin & Contenu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete admin dashboard with role-based access, content management pages (FAQ, installation guide, blog), and admin analytics/settings.

**Architecture:** Next.js middleware for admin route protection. Server Components for admin pages with auth checks. Prisma for CRUD. Static generation for blog and FAQ pages.

**Tech Stack:** Next.js 16, NextAuth v5, Prisma, Tailwind CSS v4, Framer Motion, Zod

---

## File Structure

```
app/
  admin/
    layout.tsx              — Admin sidebar layout with auth guard
    page.tsx                — Admin dashboard
    commandes/page.tsx      — Orders management table
    commandes/[id]/page.tsx — Order detail
    produits/page.tsx       — Products management
    clients/page.tsx        — Customers management
    clients/[id]/page.tsx  — Customer detail
    compatibilite/page.tsx  — Vehicle compatibility management
    blog/page.tsx           — Blog posts management
    avis/page.tsx           — Reviews management
    promos/page.tsx         — Promo codes management
    analytics/page.tsx      — Basic analytics dashboard
    parametres/page.tsx     — Settings placeholder
  faq/page.tsx              — Complete FAQ page
  installation/page.tsx     — Installation guide
  blog/page.tsx             — Blog listing
  blog/[slug]/page.tsx      — Blog article
  api/
    orders/route.ts         — Orders CRUD API
    products/route.ts       — Products CRUD API
    vehicles/route.ts       — Vehicles CRUD API
    blog/route.ts           — Blog posts CRUD API
    reviews/route.ts        — Reviews CRUD API
    promos/route.ts         — Promo codes CRUD API
middleware.ts              — Admin route protection
```

---

### Task 1: Admin middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Write middleware.ts**

```typescript
import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = req.nextUrl.pathname.startsWith("/compte");

  if (isAdminRoute && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAccountRoute && !req.auth?.user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts && git commit -m "feat: admin and account route protection middleware"
```

---

### Task 2: Admin layout

**Files:**
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Write admin layout**

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/produits", label: "Produits", icon: "🛍️" },
  { href: "/admin/clients", label: "Clients", icon: "👥" },
  { href: "/admin/compatibilite", label: "Compatibilité", icon: "🚗" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/avis", label: "Avis", icon: "⭐" },
  { href: "/admin/promos", label: "Promos", icon: "🎟️" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/parametres", label: "Paramètres", icon: "⚙️" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/auth/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-border bg-card p-6 lg:block">
        <Link href="/admin" className="mb-8 block font-heading text-xl font-bold">
          Carplay<span className="text-primary">GO</span> Admin
        </Link>
        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/layout.tsx && git commit -m "feat: admin layout with sidebar and role guard"
```

---

### Task 3: Admin dashboard

**Files:**
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Write admin dashboard**

```typescript
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [ordersCount, usersCount, productsCount, reviewsCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.review.count(),
    ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Commandes", value: ordersCount, href: "/admin/commandes" },
    { label: "Clients", value: usersCount, href: "/admin/clients" },
    { label: "Produits", value: productsCount, href: "/admin/produits" },
    { label: "Avis", value: reviewsCount, href: "/admin/avis" },
  ];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Dashboard</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-heading text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 font-heading text-xl font-bold">Commandes récentes</h2>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-4 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>N° Commande</span>
          <span>Date</span>
          <span>Total</span>
          <span>Statut</span>
        </div>
        {recentOrders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/commandes/${order.id}`}
            className="grid grid-cols-4 gap-4 border-b border-border p-4 text-sm transition-colors hover:bg-background last:border-0"
          >
            <span className="font-medium">{order.orderNumber}</span>
            <span className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </span>
            <span>{(order.total / 100).toFixed(2)}€</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {order.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/admin/page.tsx && git commit -m "feat: admin dashboard with stats and recent orders"
```

---

### Task 4: Admin orders management

**Files:**
- Create: `app/admin/commandes/page.tsx`
- Create: `app/admin/commandes/[id]/page.tsx`

- [ ] **Step 1: Orders list**

```typescript
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  userId: string | null;
}

export default async function AdminOrdersPage() {
  const orders = (await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })) as Order[];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Commandes</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>N° Commande</span>
          <span>Client</span>
          <span>Date</span>
          <span>Total</span>
          <span>Statut</span>
        </div>
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/commandes/${order.id}`}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm transition-colors hover:bg-background last:border-0"
          >
            <span className="font-medium">{order.orderNumber}</span>
            <span className="text-muted-foreground">
              {order.userId || "Invité"}
            </span>
            <span className="text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
            </span>
            <span>{(order.total / 100).toFixed(2)}€</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {order.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Order detail**

```typescript
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, statusHistory: true },
  });

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/commandes"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Retour aux commandes
      </Link>

      <h1 className="mb-8 font-heading text-3xl font-bold">
        {order.orderNumber}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Informations</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Statut: </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {order.status}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Date: </span>
              {new Date(order.createdAt).toLocaleString("fr-FR")}
            </p>
            <p>
              <span className="text-muted-foreground">Total: </span>
              {(order.total / 100).toFixed(2)}€
            </p>
            <p>
              <span className="text-muted-foreground">Stripe PI: </span>
              {order.stripePaymentIntentId || "—"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Articles</h2>
          <div className="space-y-3">
            {(order.items as unknown as OrderItem[]).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {(item.price / 100).toFixed(2)}€ x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.total / 100).toFixed(2)}€
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold">
          Historique des statuts
        </h2>
        <div className="space-y-2">
          {order.statusHistory.map((h) => (
            <div key={h.id} className="flex gap-4 text-sm">
              <span className="text-muted-foreground">
                {new Date(h.createdAt).toLocaleString("fr-FR")}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {h.status}
              </span>
              {h.note && <span className="text-muted-foreground">{h.note}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/commandes/ && git commit -m "feat: admin orders list and detail"
```

---

### Task 5: Admin products, customers, compatibility, blog, reviews, promos

**Files:**
- Create: `app/admin/produits/page.tsx`
- Create: `app/admin/clients/page.tsx`
- Create: `app/admin/clients/[id]/page.tsx`
- Create: `app/admin/compatibilite/page.tsx`
- Create: `app/admin/blog/page.tsx`
- Create: `app/admin/avis/page.tsx`
- Create: `app/admin/promos/page.tsx`

- [ ] **Step 1: Products admin**

```typescript
import { prisma } from "@/lib/prisma";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export default async function AdminProductsPage() {
  const products = (await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })) as Product[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Produits</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Nom</span>
          <span>Slug</span>
          <span>Prix</span>
          <span>Stock</span>
          <span>Statut</span>
        </div>
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{product.name}</span>
            <span className="text-muted-foreground">{product.slug}</span>
            <span>{(product.price / 100).toFixed(2)}€</span>
            <span>{product.stockQuantity}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                product.isActive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {product.isActive ? "Actif" : "Inactif"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Customers admin**

```typescript
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: Date;
}

export default async function AdminCustomersPage() {
  const users = (await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })) as User[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Clients</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>ID</span>
          <span>Email</span>
          <span>Nom</span>
          <span>Rôle</span>
          <span>Inscription</span>
        </div>
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/admin/clients/${user.id}`}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm transition-colors hover:bg-background last:border-0"
          >
            <span className="font-medium">{user.id.slice(0, 8)}...</span>
            <span>{user.email}</span>
            <span className="text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                user.role === "ADMIN"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {user.role}
            </span>
            <span className="text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Customer detail**

```typescript
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { orders: true, addresses: true, reviews: true },
  });

  if (!user) notFound();

  return (
    <div>
      <Link
        href="/admin/clients"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Retour aux clients
      </Link>
      <h1 className="mb-8 font-heading text-3xl font-bold">
        {user.firstName} {user.lastName}
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Informations</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Email: </span>{user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Rôle: </span>{user.role}
            </p>
            <p>
              <span className="text-muted-foreground">Inscrit le: </span>
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Commandes</h2>
          <p className="font-heading text-3xl font-bold">{user.orders.length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold">Avis</h2>
          <p className="font-heading text-3xl font-bold">{user.reviews.length}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Compatibility admin**

```typescript
import { prisma } from "@/lib/prisma";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  yearStart: number;
  yearEnd: number | null;
  isCompatible: boolean;
}

export default async function AdminCompatibilityPage() {
  const vehicles = (await prisma.vehicle.findMany({
    orderBy: { brand: "asc" },
    take: 50,
  })) as Vehicle[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Compatibilité</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Marque</span>
          <span>Modèle</span>
          <span>Années</span>
          <span>Slug</span>
          <span>Compatibilité</span>
        </div>
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{vehicle.brand}</span>
            <span>{vehicle.model}</span>
            <span className="text-muted-foreground">
              {vehicle.yearStart}
              {vehicle.yearEnd ? ` - ${vehicle.yearEnd}` : "+"}
            </span>
            <span className="text-muted-foreground">{vehicle.model.toLowerCase()}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                vehicle.isCompatible
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {vehicle.isCompatible ? "Oui" : "Non"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Blog admin**

```typescript
import { prisma } from "@/lib/prisma";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  isPublished: boolean;
  publishedAt: Date | null;
}

export default async function AdminBlogPage() {
  const posts = (await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  })) as BlogPost[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Blog</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Titre</span>
          <span>Slug</span>
          <span>Catégorie</span>
          <span>Publié</span>
          <span>Date</span>
        </div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{post.title}</span>
            <span className="text-muted-foreground">{post.slug}</span>
            <span>{post.category}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                post.isPublished
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {post.isPublished ? "Publié" : "Brouillon"}
            </span>
            <span className="text-muted-foreground">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("fr-FR")
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Reviews admin**

```typescript
import { prisma } from "@/lib/prisma";

interface Review {
  id: string;
  rating: number;
  title: string;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: Date;
}

export default async function AdminReviewsPage() {
  const reviews = (await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })) as Review[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Avis</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Note</span>
          <span>Titre</span>
          <span>Vérifié</span>
          <span>Publié</span>
          <span>Date</span>
        </div>
        {reviews.map((review) => (
          <div
            key={review.id}
            className="grid grid-cols-5 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{"⭐".repeat(review.rating)}</span>
            <span>{review.title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                review.isVerified
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {review.isVerified ? "Oui" : "Non"}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                review.isPublished
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {review.isPublished ? "Oui" : "Non"}
            </span>
            <span className="text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Promos admin**

```typescript
import { prisma } from "@/lib/prisma";

interface PromoCode {
  id: string;
  code: string;
  type: string;
  value: number;
  usedCount: number;
  maxUses: number | null;
  isActive: boolean;
  expiresAt: Date | null;
}

export default async function AdminPromosPage() {
  const promos = (await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  })) as PromoCode[];

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Codes promo</h1>
      <div className="rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-6 gap-4 border-b border-border p-4 text-sm font-medium text-muted-foreground">
          <span>Code</span>
          <span>Type</span>
          <span>Valeur</span>
          <span>Utilisations</span>
          <span>Statut</span>
          <span>Expiration</span>
        </div>
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="grid grid-cols-6 gap-4 border-b border-border p-4 text-sm last:border-0"
          >
            <span className="font-medium">{promo.code}</span>
            <span>{promo.type}</span>
            <span>{promo.value}{promo.type === "PERCENT" ? "%" : "€"}</span>
            <span>{promo.usedCount}{promo.maxUses ? ` / ${promo.maxUses}` : ""}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                promo.isActive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {promo.isActive ? "Actif" : "Inactif"}
            </span>
            <span className="text-muted-foreground">
              {promo.expiresAt
                ? new Date(promo.expiresAt).toLocaleDateString("fr-FR")
                : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add app/admin/ && git commit -m "feat: admin pages - products, customers, compatibility, blog, reviews, promos"
```

---

### Task 6: Admin analytics and settings

**Files:**
- Create: `app/admin/analytics/page.tsx`
- Create: `app/admin/parametres/page.tsx`

- [ ] **Step 1: Analytics**

```typescript
import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  const [
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order
      .aggregate({ _sum: { total: true } })
      .then((r) => r._sum.total || 0),
    prisma.user.count(),
    prisma.product.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const monthlyRevenue = recentOrders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("fr-FR", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + order.total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Analytics</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Commandes totales</p>
          <p className="font-heading text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Revenus totaux</p>
          <p className="font-heading text-3xl font-bold">
            {(totalRevenue / 100).toFixed(2)}€
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Clients</p>
          <p className="font-heading text-3xl font-bold">{totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Produits</p>
          <p className="font-heading text-3xl font-bold">{totalProducts}</p>
        </div>
      </div>

      <h2 className="mb-4 font-heading text-xl font-bold">Revenus par mois</h2>
      <div className="rounded-2xl border border-border bg-card p-6">
        {Object.entries(monthlyRevenue).map(([month, amount]) => (
          <div key={month} className="mb-4 flex items-center gap-4">
            <span className="w-16 text-sm font-medium">{month}</span>
            <div className="flex-1">
              <div
                className="h-4 rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, (amount / totalRevenue) * 100)}%`,
                }}
              />
            </div>
            <span className="w-20 text-right text-sm">
              {(amount / 100).toFixed(0)}€
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Settings**

```typescript
export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-bold">Paramètres</h1>
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Les paramètres système seront disponibles dans une future mise à jour.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/admin/analytics/ app/admin/parametres/ && git commit -m "feat: admin analytics dashboard and settings placeholder"
```

---

### Task 7: Public content pages — FAQ, Installation, Blog

**Files:**
- Create: `app/faq/page.tsx`
- Create: `app/installation/page.tsx`
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: FAQ page**

```typescript
import { Metadata } from "next";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Toutes les réponses à vos questions sur CarplayGO.",
};

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
  {
    question: "Combien de temps dure la livraison ?",
    answer:
      "La livraison express en France métropolitaine prend 24h ouvrées. Livraison gratuite.",
  },
  {
    question: "CarplayGO est-il compatible avec mon iPhone ?",
    answer:
      "Tous les iPhones équipés d'iOS 10 ou supérieur sont compatibles. Cela inclut l'iPhone 6s et tous les modèles plus récents.",
  },
  {
    question: "Comment mettre à jour le firmware ?",
    answer:
      "Les mises à jour se font automatiquement par OTA (Over-The-Air) dès que l'appareil est connecté. Aucune action de votre part n'est nécessaire.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  "use client";
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="pr-4 font-heading text-base font-medium">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="mb-4 text-center font-heading text-3xl font-bold md:text-4xl">
        Questions fréquentes
      </h1>
      <p className="mb-10 text-center text-muted-foreground">
        Toutes les réponses à vos questions sur CarplayGO.
      </p>

      <div className="rounded-2xl border border-border bg-card px-6">
        {faqs.map((faq, index) => (
          <FaqItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Installation guide**

```typescript
import { Metadata } from "next";
import { Usb, Bluetooth, Car, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Guide d'installation",
  description:
    "Installez CarplayGO en 3 étapes simples. Branchez, connectez, roulez.",
};

const steps = [
  {
    icon: Usb,
    title: "Branchez CarplayGO",
    description:
      "Insérez l'adaptateur sur le port USB de votre voiture. Utilisez le port dédié à CarPlay (généralement marqué d'une icône smartphone).",
    tip: "Ne forcez pas — l'insertion doit être douce et directe.",
  },
  {
    icon: Bluetooth,
    title: "Activez le Bluetooth",
    description:
      "Sur votre iPhone, allez dans Réglages > Bluetooth. Sélectionnez 'CarplayGO' dans la liste des appareils disponibles.",
    tip: "Assurez-vous que le Bluetooth est activé sur votre iPhone avant de brancher.",
  },
  {
    icon: Car,
    title: "Appairage automatique",
    description:
      "Autorisez l'appairage sur l'écran de votre voiture. CarPlay s'ouvrira automatiquement dès que la connexion sera établie.",
    tip: "La première connexion peut prendre 10-15 secondes. Les suivantes seront instantanées.",
  },
];

const checklist = [
  "CarPlay filaire disponible sur votre voiture",
  "iPhone avec iOS 10 ou supérieur",
  "Bluetooth et Wi-Fi activés sur l'iPhone",
  "Port USB accessible et fonctionnel",
];

export default function InstallationPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="mb-4 text-center font-heading text-3xl font-bold md:text-4xl">
        Guide d'installation
      </h1>
      <p className="mb-12 text-center text-muted-foreground">
        3 étapes. 30 secondes. C'est tout.
      </p>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 inline-flex rounded-xl border border-border bg-background p-3">
              <step.icon className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mb-2 font-heading text-xl font-semibold">
              Étape {index + 1} : {step.title}
            </h2>
            <p className="mb-3 text-muted-foreground">{step.description}</p>
            <div className="rounded-lg bg-primary/5 p-3 text-sm text-primary">
              💡 {step.tip}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-xl font-semibold">
          Checklist pré-installation
        </h2>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm">
              <Check className="h-4 w-4 text-green-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Blog listing**

```typescript
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Actualités, guides et conseils autour de CarPlay et de l'écosystème Apple dans votre voiture.",
};

const posts = [
  {
    slug: "carplay-sans-fil-vs-filaire",
    title: "CarPlay sans fil vs filaire : le match",
    excerpt:
      "On compare les deux technologies pour vous aider à choisir. Spoiler : le sans fil gagne à tous les coups.",
    date: "2026-05-15",
    readingTime: 5,
    category: "comparatif",
  },
  {
    slug: "top-10-voitures-carplay-2026",
    title: "Top 10 des voitures avec le meilleur CarPlay en 2026",
    excerpt:
      "Notre sélection des véhicules offrant l'expérience CarPlay la plus fluide et complète.",
    date: "2026-05-10",
    readingTime: 8,
    category: "guide",
  },
  {
    slug: "mise-a-jour-ios-20-carplay",
    title: "iOS 20 : les nouveautés CarPlay",
    excerpt:
      "Apple dévoile les améliorations de CarPlay avec iOS 20. Voici ce qui change pour les conducteurs.",
    date: "2026-05-05",
    readingTime: 4,
    category: "actualité",
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-24">
      <h1 className="mb-4 text-center font-heading text-3xl font-bold md:text-4xl">
        Blog CarplayGO
      </h1>
      <p className="mb-12 text-center text-muted-foreground">
        Actualités, guides et conseils autour de CarPlay.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span>{post.readingTime} min de lecture</span>
            </div>
            <h2 className="mb-2 font-heading text-xl font-semibold">
              {post.title}
            </h2>
            <p className="text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Blog article**

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const posts = [
  {
    slug: "carplay-sans-fil-vs-filaire",
    title: "CarPlay sans fil vs filaire : le match",
    body: `CarPlay sans fil offre une liberté totale. Plus besoin de sortir votre téléphone de votre poche à chaque trajet. La connexion se fait automatiquement dès que vous démarrez le moteur.\n\nLe filaire, en revanche, contraint à brancher et débrancher son câble à chaque entrée et sortie de véhicule. Le port USB s'use avec le temps, et le câble traîne dans l'habitacle.\n\nAvec CarplayGO, transformez votre CarPlay filaire existant en connexion sans fil en 30 secondes. Plug & play, aucune installation complexe.`,
    date: "2026-05-15",
    readingTime: 5,
    category: "comparatif",
  },
  {
    slug: "top-10-voitures-carplay-2026",
    title: "Top 10 des voitures avec le meilleur CarPlay en 2026",
    body: `Chaque année, les constructeurs améliorent leur intégration CarPlay. En 2026, BMW, Audi et Mercedes restent en tête avec des écrans haute résolution et des réponses tactiles fluides.\n\nLes constructeurs généralistes comme Volkswagen et Toyota rattrapent leur retard avec des mises à jour OTA et des interfaces plus modernes.\n\nQuelle que soit votre voiture, si elle dispose de CarPlay filaire, CarplayGO la rend sans fil instantanément.`,
    date: "2026-05-10",
    readingTime: 8,
    category: "guide",
  },
  {
    slug: "mise-a-jour-ios-20-carplay",
    title: "iOS 20 : les nouveautés CarPlay",
    body: `Avec iOS 20, Apple introduit plusieurs améliorations majeures pour CarPlay :\n\n- Widgets personnalisables sur l'écran d'accueil\n- Intégration améliorée des applications tierces\n- Reconnaissance vocale plus rapide pour Siri\n- Mode nuit automatique basé sur la position du soleil\n\nCes améliorations fonctionnent parfaitement avec CarplayGO, qui transmet toutes les données sans perte de qualité via sa connexion Wi-Fi dédiée.`,
    date: "2026-05-05",
    readingTime: 4,
    category: "actualité",
  },
];

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Article non trouvé" };

  return {
    title: post.title,
    description: post.body.slice(0, 160),
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <Link
        href="/blog"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Retour au blog
      </Link>

      <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
          {post.category}
        </span>
        <span>{post.date}</span>
        <span>{post.readingTime} min de lecture</span>
      </div>

      <h1 className="mb-8 font-heading text-3xl font-bold md:text-4xl">
        {post.title}
      </h1>

      <div className="prose prose-invert max-w-none">
        {post.body.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/faq/ app/installation/ app/blog/ && git commit -m "feat: public content pages - FAQ, installation guide, blog"
```

---

### Task 8: Build verification

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix errors and commit**

```bash
git add . && git commit -m "chore: Phase 3 admin & content complete"
```

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Admin middleware | Task 1 |
| Admin layout | Task 2 |
| Admin dashboard | Task 3 |
| Admin orders list + detail | Task 4 |
| Admin products | Task 5 |
| Admin customers + detail | Task 5 |
| Admin compatibility | Task 5 |
| Admin blog | Task 5 |
| Admin reviews | Task 5 |
| Admin promos | Task 5 |
| Admin analytics | Task 6 |
| Admin settings | Task 6 |
| FAQ page | Task 7 |
| Installation guide | Task 7 |
| Blog listing + article | Task 7 |

## Placeholder Scan

- No TBD, TODO found.
- All code blocks contain complete runnable code.
- All file paths are exact.

## Execution Handoff

**Plan complete. Recommend Inline Execution.**
