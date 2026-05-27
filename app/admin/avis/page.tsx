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
