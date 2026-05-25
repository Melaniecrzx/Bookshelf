import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBooks, useShelves } from '../hooks/useBooks';
import { useShelfBooks } from '../hooks/useCustomShelves';
import { BookGrid } from '../components/BookGrid';
import { PageHeader } from '../components/PageHeader';

export function ShelfPage() {
  const { shelfId } = useParams<{ shelfId: string }>();
  const { allGenres } = useBooks();
  const { data: shelves = [] } = useShelves();
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const shelf = shelves.find((s) => s.id === shelfId);
  const shelfBooks = useShelfBooks(shelfId);

  const filtered = useMemo(() => {
    return shelfBooks.filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        if (!b.title.toLowerCase().includes(q) && !b.author.toLowerCase().includes(q)) return false;
      }
      if (selectedGenres.length > 0 && !selectedGenres.some((g) => b.genres.includes(g))) return false;
      return true;
    });
  }, [shelfBooks, search, selectedGenres]);

  return (
    <div className="px-6 py-8">
      <Link to="/library" className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-ink-400 hover:text-ink-700 transition-colors mb-6">
        <ArrowLeft size={13} /> Back to Library
      </Link>
      <PageHeader title={shelf?.name ?? '…'} count={filtered.length} />
      <BookGrid
        books={filtered}
        allGenres={allGenres}
        search={search}
        onSearch={setSearch}
        selectedGenres={selectedGenres}
        onGenresChange={setSelectedGenres}
        showStatus={false}
        emptyMessage="No books in this shelf yet."
      />
    </div>
  );
}
