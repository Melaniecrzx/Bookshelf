import { Star } from "lucide-react";
import { BookCover } from "../ui/BookCover";
import type { Book } from "../../types/book";

interface TrendingBookItemProps {
  book: Book;
  onClick?: () => void;
}

export function TrendingBookItem({ book, onClick }: TrendingBookItemProps) {
  const avg = book.avg_rating != null ? book.avg_rating.toFixed(1) : null;

  return (
    <div className="flex flex-col w-36 shrink-0 cursor-pointer" onClick={onClick}>
      <div className="w-36 h-52 rounded-md overflow-hidden bg-sand-200">
        <BookCover
          coverUrl={book.cover_url}
          isbn={book.isbn}
          title={book.title}
        />
      </div>
      <div className="mt-2 min-w-0">
        <p className="font-serif text-sm font-bold text-ink-900 line-clamp-2 leading-snug">
          {book.title}
        </p>
        <p className="font-sans text-xs text-ink-400 truncate mt-0.5">
          {book.author}
        </p>
        {avg != null && (
          <div className="flex items-center gap-1 mt-1">
            <Star
              size={11}
              strokeWidth={1.5}
              className="fill-terra-500 text-terra-500 shrink-0"
            />
            <span className="font-sans text-xs font-medium text-ink-700">
              {avg}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
