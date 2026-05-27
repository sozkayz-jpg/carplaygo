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
