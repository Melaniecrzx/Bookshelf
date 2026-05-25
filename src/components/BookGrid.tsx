import { useMemo, useState } from "react";
import { BookCard } from "./BookCard";
import { BookModal } from "./BookModal";
import { RatingModal } from "./RatingModal";
import { FilterBar } from "./FilterBar";
import { Confetti } from "./ui/Confetti";
import { type SortKey } from "./ui/SortFilter";
import type { Book } from "../types/book";
import { useUpdateBook } from "../hooks/useBooks";

interface BookGridProps {
  books: Book[];
  allGenres: string[];
  search: string;
  onSearch: (v: string) => void;
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
  showStatus?: boolean;
  emptyMessage?: string;
}

export function BookGrid({
  books, allGenres, search, onSearch, selectedGenres, onGenresChange,
  showStatus = true, emptyMessage = "No books found.",
}: BookGridProps) {
  const { mutate: updateBook } = useUpdateBook();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sort, setSort] = useState<SortKey | null>(null);
  const [ratingBook, setRatingBook] = useState<{ id: string; title: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  function handleMarkAsRead(id: string) {
    const book = books.find((b) => b.id === id);
    setRatingBook(book ? { id: book.id, title: book.title } : null);
  }

  function handleRatingDone(rating: number | null) {
    if (ratingBook && rating !== null) {
      const existing = books.find((b) => b.id === ratingBook.id);
      if (existing) updateBook({ ...existing, rating });
    }
    setRatingBook(null);
    setShowConfetti(true);
  }

  const sortedBooks = useMemo(() => {
    if (!sort) return books;
    return [...books].sort((a, b) => {
      switch (sort) {
        case "title":         return a.title.localeCompare(b.title);
        case "author":        return a.author.localeCompare(b.author);
        case "published_year": return (a.published_year ?? 0) - (b.published_year ?? 0);
        case "pages":         return (a.pages ?? 0) - (b.pages ?? 0);
        case "rating":        return (b.rating ?? 0) - (a.rating ?? 0);
      }
    });
  }, [books, sort]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <FilterBar search={search} onSearch={onSearch} genres={allGenres} selectedGenres={selectedGenres} onGenresChange={onGenresChange} sort={sort} onSortChange={setSort} />
        {sortedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="font-serif text-4xl text-sand-300 mb-3">⊘</span>
            <p className="text-ink-400 font-sans text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sortedBooks.map((book) => (
              <BookCard key={book.id} book={book} showStatus={showStatus} onClick={() => setSelectedBook(book)} />
            ))}
          </div>
        )}
      </div>
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
      {ratingBook && <RatingModal bookTitle={ratingBook.title} onDismiss={() => handleRatingDone(null)} onSave={handleRatingDone} />}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </>
  );
}
