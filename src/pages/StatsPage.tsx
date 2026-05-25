import { useStatsData } from "../hooks/useStatsData";
import { PageHeader } from "../components/PageHeader";
import { StatsSummaryCards } from "../components/stats/StatsSummaryCards";
import { RatingDistributionCard } from "../components/stats/RatingDistributionCard";
import { TopAuthorsCard } from "../components/stats/TopAuthorsCard";
import { BookLengthsCard } from "../components/stats/BookLengthsCard";
import { GenreDonutChart } from "../components/stats/GenreDonutChart";

export function StatsPage() {
  const {
    counts,
    pagesThisYear,
    avgRating,
    ratedCount,
    ratingDistribution,
    highestRatedAuthor,
    mostCommonRating,
    topAuthors,
    authorCount,
    monthlyData,
    bookLengthData,
    shortest,
    longest,
    genreData,
  } = useStatsData();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl mx-auto">
      <PageHeader title="Statistics" subtitle="An overview of your library" />

      <StatsSummaryCards
        totalBooks={counts.read + counts.reading + counts.toRead}
        readCount={counts.read}
        pagesThisYear={pagesThisYear}
        avgRating={avgRating}
        ratedCount={ratedCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RatingDistributionCard
          avgRating={avgRating}
          ratedCount={ratedCount}
          totalRead={counts.read}
          distribution={ratingDistribution}
          highestRatedAuthor={highestRatedAuthor}
          mostCommonRating={mostCommonRating}
        />
        <TopAuthorsCard authors={topAuthors} authorCount={authorCount} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BookLengthsCard
          monthlyData={monthlyData}
          bookLengthData={bookLengthData}
          shortest={shortest}
          longest={longest}
        />
      </div>

      <GenreDonutChart data={genreData} />
    </div>
  );
}
