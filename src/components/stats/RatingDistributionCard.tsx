interface RatingDistItem { star: number; count: number }
interface Author { name: string; avg: number; count: number }

interface RatingDistributionCardProps {
  avgRating: number;
  ratedCount: number;
  totalRead: number;
  distribution: RatingDistItem[];
  highestRatedAuthor: Author | null;
  mostCommonRating: RatingDistItem | null;
}

export function RatingDistributionCard({
  avgRating,
  ratedCount,
  totalRead,
  distribution,
  highestRatedAuthor,
  mostCommonRating,
}: RatingDistributionCardProps) {
  const maxCount = Math.max(...distribution.map((r) => r.count), 1);

  return (
    <section className="bg-sand-100 border border-sand-300 rounded-xl p-6">
      <h2 className="font-serif text-lg font-bold text-ink-900 mb-4">
        Rating Distribution
      </h2>

      {/* Average */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="font-serif text-4xl font-bold text-ink-900 leading-none">
          {ratedCount > 0 ? avgRating.toFixed(1) : "—"}
        </span>
        {ratedCount > 0 && (
          <>
            <span className="text-amber-400 text-xl leading-none">★</span>
            <span className="font-serif text-xl font-bold text-ink-900">average</span>
            <span className="text-sm text-ink-400 font-sans ml-1">
              {ratedCount} of {totalRead} rated
            </span>
          </>
        )}
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-3 mb-6">
        {distribution.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3">
            {/* Only filled stars, right-aligned */}
            <span
              className="text-amber-400 text-xs shrink-0 text-right leading-none"
              style={{ width: "4.5rem" }}
            >
              {"★".repeat(star)}
            </span>
            <div className="flex-1 h-2.5 bg-sand-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                  backgroundColor: "#C97C42",
                }}
              />
            </div>
            <span className="text-sm text-ink-400 font-sans w-4 text-right shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* Insight badges */}
      {(highestRatedAuthor || mostCommonRating) && (
        <div className="flex flex-col gap-2">
          {highestRatedAuthor && (
            <div className="flex items-center gap-2.5 bg-sand-200 rounded-lg px-3 py-2.5">
              <span className="text-amber-400 text-sm shrink-0">☆</span>
              <p className="text-xs font-sans text-ink-700">
                <strong className="text-ink-900">{highestRatedAuthor.name}</strong>
                {" "}is your highest rated author
                <span className="text-ink-400">
                  {" "}· {highestRatedAuthor.avg.toFixed(0)}★ across {highestRatedAuthor.count} book{highestRatedAuthor.count > 1 ? "s" : ""}
                </span>
              </p>
            </div>
          )}
          {mostCommonRating && mostCommonRating.count > 0 && (
            <div className="flex items-center gap-2.5 bg-sand-200 rounded-lg px-3 py-2.5">
              <span className="text-terra-400 text-sm shrink-0">↗</span>
              <p className="text-xs font-sans text-ink-700">
                You most often give{" "}
                <strong className="text-ink-900">{mostCommonRating.star}★</strong>
                <span className="text-ink-400">
                  {" "}· {mostCommonRating.count} time{mostCommonRating.count > 1 ? "s" : ""}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
