import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — CarplayGO",
  description:
    "Conseils, guides et actualités sur la connectivité automobile et CarPlay sans fil.",
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: Date | null;
  isPublished: boolean;
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    posts = (await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    })) as BlogPost[];
  } catch {
    posts = [];
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="mb-4 font-heading text-4xl font-bold">Blog CarplayGO</h1>
      <p className="mb-12 text-muted-foreground">
        Conseils, guides et actualités sur la connectivité automobile.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <span className="mb-3 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {post.category}
            </span>
            <h2 className="mb-2 font-heading text-lg font-semibold group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
            <span className="text-xs text-muted-foreground">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("fr-FR")
                : ""}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
