import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useDiscoverBooks } from "../../hooks/useDiscoverBooks";
import { useBooks, useAddBook } from "../../hooks/useBooks";
import { useGuestGuard } from "../../hooks/useGuestGuard";
import { SearchResultModal } from "../SearchResultModal";
import { TrendingBookItem } from "./TrendingBookItem";
import { toBook } from "../../utils/googleBook";
import type { Book } from "../../types/book";
import type { GoogleBookResult } from "../../hooks/useGoogleBooks";

function toGoogleBookResult(book: Book): GoogleBookResult {
  const isIsbn13 = book.isbn?.length === 13;
  return {
    googleId: book.id,
    title: book.title,
    authors: [book.author],
    coverUrl: book.cover_url,
    isbn13: isIsbn13 ? book.isbn : null,
    isbn10: !isIsbn13 ? book.isbn : null,
    pageCount: book.pages,
    publishedDate: book.published_year?.toString() ?? "",
    genres: book.genres,
    description: book.description,
    publisher: "",
  };
}

export function TrendingBooks() {
  const guard = useGuestGuard();
  const { books, isLoading } = useDiscoverBooks();
  const { books: libraryBooks } = useBooks();
  const { mutate: addBook } = useAddBook();
  const [selected, setSelected] = useState<GoogleBookResult | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  function isInLibrary(result: GoogleBookResult) {
    return (
      libraryBooks.some((b) => b.isbn === result.isbn13) ||
      addedIds.has(result.googleId)
    );
  }

  function handleAdd(result: GoogleBookResult) {
    if (isInLibrary(result)) return;
    if (!guard('Sign up to save books to your library')) return;
    addBook(toBook(result));
    setAddedIds((prev) => new Set([...prev, result.googleId]));
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} strokeWidth={1.75} className="text-terra-500" />
        <h2 className="font-serif text-xl font-bold text-ink-900">
          Trending on Bookshelf
        </h2>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto -mx-6 px-6 pb-2 scrollbar-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col w-36 shrink-0">
              <div className="w-36 h-52 rounded-md bg-sand-200 animate-pulse" />
              <div className="mt-2 space-y-2">
                <div className="h-3 bg-sand-200 animate-pulse rounded w-4/5" />
                <div className="h-3 bg-sand-200 animate-pulse rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <p className="font-sans text-sm text-ink-400 text-center py-12">
          No trending books yet.
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto -mx-6 px-6 pb-2 scrollbar-none">
          {books.map((book) => (
            <TrendingBookItem
              key={book.id}
              book={book}
              onClick={() => setSelected(toGoogleBookResult(book))}
            />
          ))}
        </div>
      )}

      {selected && (
        <SearchResultModal
          result={selected}
          inLibrary={isInLibrary(selected)}
          onClose={() => setSelected(null)}
          onAdd={handleAdd}
        />
      )}
    </section>
  );
}
