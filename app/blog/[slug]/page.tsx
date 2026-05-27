import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });
  if (!post) return { title: "Article introuvable" };
  return {
    title: `${post.title} — CarplayGO Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.isPublished) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <Link
        href="/blog"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Retour au blog
      </Link>

      <span className="mb-4 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        {post.category}
      </span>

      <h1 className="mb-4 font-heading text-3xl font-bold sm:text-4xl">
        {post.title}
      </h1>

      <p className="mb-8 text-sm text-muted-foreground">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("fr-FR")
          : ""}
      </p>

      <div className="prose prose-invert max-w-none">
        {post.body.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </main>
  );
}
