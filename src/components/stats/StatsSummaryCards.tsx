import { StatsCard } from "../ui/StatsCard";
import { AvgStarsDisplay } from "./AvgStarsDisplay";
import { CURRENT_YEAR } from "../../utils/date";

interface StatsSummaryCardsProps {
  totalBooks: number;
  readCount: number;
  pagesThisYear: number;
  avgRating: number;
  ratedCount: number;
}

export function StatsSummaryCards({
  totalBooks,
  readCount,
  pagesThisYear,
  avgRating,
  ratedCount,
}: StatsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
      <StatsCard value={totalBooks} label="books total" accent />
      <StatsCard value={readCount} label="read" />
      <div className="bg-sand-100 border border-sand-300 rounded-xl p-5 flex flex-col gap-1">
        <span className="font-serif text-4xl font-bold leading-none text-ink-900">
          {pagesThisYear.toLocaleString("en-US")}
        </span>
        <span className="text-sm text-ink-400 font-sans">
          pages in {CURRENT_YEAR}
        </span>
      </div>
      <div className="bg-sand-100 border border-sand-300 rounded-xl p-5 flex flex-col gap-1">
        <span className="font-serif text-4xl font-bold leading-none text-terra-500">
          {ratedCount > 0 ? avgRating.toFixed(1) : "—"}
        </span>
        {ratedCount > 0 && <AvgStarsDisplay avg={avgRating} />}
        <span className="text-sm text-ink-400 font-sans">avg rating</span>
      </div>
    </div>
  );
}
