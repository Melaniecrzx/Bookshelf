import type { Book } from "../types/book";
import { StatusBadge } from "./ui/StatusBadge";
import { GenreTag } from "./ui/GenreTag";
import { BookCover } from "./ui/BookCover";
import { ProgressBar } from "./ui/ProgressBar";
import { StarRating } from "./ui/StarRating";
import { useReadingProgress } from "../hooks/useReadingProgress";

interface BookCardProps {
  book: Book;
  showStatus?: boolean;
  onClick?: () => void;
}

export function BookCard({ book, showStatus = true, onClick }: BookCardProps) {
  const pagesRead = useReadingProgress(book.id);
  const showProgress = book.status === "reading" && !!book.pages;
  const pct = showProgress ? Math.round((pagesRead / book.pages!) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className="group flex flex-col bg-sand-100 rounded-xl overflow-hidden border border-sand-300 hover:border-terra-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-sand-200 shrink-0">
        <BookCover
          coverUrl={book.cover_url}
          isbn={book.isbn}
          title={book.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>

      {book.status === "read" && book.rating != null && (
        <div className="px-3 pt-2 pb-0">
          <StarRating value={book.rating} readOnly size={11} />
        </div>
      )}

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {showStatus && <StatusBadge status={book.status} />}

        <h3 className="font-serif text-sm font-bold text-ink-900 line-clamp-2 leading-snug mt-0.5">
          {book.title}
        </h3>

        <p className="text-xs text-ink-400 font-sans truncate">{book.author}</p>

        {showProgress && (
          <div className="mt-1">
            <ProgressBar value={pagesRead} max={book.pages!} className="mb-1" />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-ink-400 font-sans">
                {pagesRead} / {book.pages} pages
              </p>
              <p className="text-[10px] font-sans font-medium text-terra-500">
                {pct}%
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-auto pt-1.5">
          {book.genres.slice(0, 2).map((g) => (
            <GenreTag key={g} genre={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
