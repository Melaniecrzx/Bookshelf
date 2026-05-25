import { SearchInput } from './ui/SearchInput';
import { CategoryFilter } from './ui/CategoryFilter';
import { SortFilter, type SortKey } from './ui/SortFilter';

interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  genres: string[];
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
  sort: SortKey | null;
  onSortChange: (key: SortKey | null) => void;
}

export function FilterBar({ search, onSearch, genres, selectedGenres, onGenresChange, sort, onSortChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3">
      <SearchInput
        value={search}
        onChange={onSearch}
        placeholder="Search by title or author…"
      />
      <CategoryFilter
        genres={genres}
        selectedGenres={selectedGenres}
        onChange={onGenresChange}
      />
      <SortFilter value={sort} onChange={onSortChange} />
    </div>
  );
}
