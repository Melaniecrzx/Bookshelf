import { useState, useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBooks, useShelves } from '../hooks/useBooks';
import { useShelfBooks } from '../hooks/useCustomShelves';
import { BookGrid } from '../components/BookGrid';
import { PageHeader } from '../components/PageHeader';

const PAGE_SIZE = 24;

export function ShelfPage() {
  const { shelfId } = useParams<{ shelfId: string }>();
  const { allGenres } = useBooks();
  const { data: shelves = [] } = useShelves();
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);

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

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, selectedGenres]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="px-6 py-8">
      <Link to="/library" className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-ink-400 hover:text-ink-700 transition-colors mb-6">
        <ArrowLeft size={13} /> Back to Library
      </Link>
      <PageHeader title={shelf?.name ?? '…'} count={filtered.length} />
      <BookGrid
        books={paginated}
        allGenres={allGenres}
        search={search}
        onSearch={setSearch}
        selectedGenres={selectedGenres}
        onGenresChange={setSelectedGenres}
        showStatus={false}
        emptyMessage="No books in this shelf yet."
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => { setPage((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-sand-300 text-sm font-sans text-ink-700 hover:bg-sand-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <span className="font-sans text-sm text-ink-400">
            Page <span className="font-medium text-ink-700">{page}</span> of {totalPages}
          </span>

          <button
            onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === totalPages}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-sand-300 text-sm font-sans text-ink-700 hover:bg-sand-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
