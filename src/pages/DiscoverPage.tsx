import { TrendingBooks } from "../components/discover/TrendingBooks";
import { PageHeader } from "../components/PageHeader";

export function DiscoverPage() {
  return (
    <div className="px-6 py-8">
      <PageHeader title="Discover" />
      <TrendingBooks />
    </div>
  );
}
