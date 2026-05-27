import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://carplaygo.fr";

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
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
