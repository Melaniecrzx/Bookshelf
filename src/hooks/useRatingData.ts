import { useMemo } from "react";
import type { Book } from "../types/book";

export function useRatingData(books: Book[]) {
  const ratingDistribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: books.filter((b) => b.rating === star).length,
      })),
    [books],
  );

  const { avgRating, ratedCount } = useMemo(() => {
    const rated = books.filter((b) => b.rating != null && b.rating > 0);
    const avg =
      rated.length > 0
        ? rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length
        : 0;
    return { avgRating: avg, ratedCount: rated.length };
  }, [books]);

  const { highestRatedAuthor, mostCommonRating } = useMemo(() => {
    const maxCount = Math.max(...ratingDistribution.map((r) => r.count), 0);
    const mostCommon =
      maxCount > 0
        ? (ratingDistribution.find((r) => r.count === maxCount) ?? null)
        : null;

    const authorRatings: Record<string, number[]> = {};
    books.forEach((b) => {
      if (b.rating && b.rating > 0 && b.author) {
        if (!authorRatings[b.author]) authorRatings[b.author] = [];
        authorRatings[b.author].push(b.rating);
      }
    });

    let topAuthor: { name: string; avg: number; count: number } | null = null;
    Object.entries(authorRatings).forEach(([name, ratings]) => {
      const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
      if (!topAuthor || avg > topAuthor.avg) {
        topAuthor = { name, avg, count: ratings.length };
      }
    });

    return { highestRatedAuthor: topAuthor, mostCommonRating: mostCommon };
  }, [books, ratingDistribution]);

  return { avgRating, ratedCount, ratingDistribution, highestRatedAuthor, mostCommonRating };
}
