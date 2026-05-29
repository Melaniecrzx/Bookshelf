import { TrendingBooks } from "../components/discover/TrendingBooks";
import { RecommendationsSection } from "../components/discover/RecommendationsSection";
import { PageHeader } from "../components/PageHeader";

export function DiscoverPage() {
  return (
    <div className="px-6 py-8">
      <PageHeader title="Discover" />
      <TrendingBooks />
      <RecommendationsSection />
    </div>
  );
}
