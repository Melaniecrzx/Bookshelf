import { useState } from "react";
import type { Book } from "../../types/book";
import { CoverPlaceholder } from "../ui/CoverPlaceholder";
import { useReadingProgress } from "../../hooks/useReadingProgress";

interface ShelfBookProps {
  book: Book;
  onClick: () => void;
}

export function ShelfBook({ book, onClick }: ShelfBookProps) {
  const [imgError, setImgError] = useState(false);
  const pagesRead = useReadingProgress(book.id);

  const showProgress = book.status === "reading" && !!book.pages;
  const pct = showProgress ? Math.min(100, ((pagesRead ?? 0) / book.pages!) * 100) : 0;

  return (
    <div
      onClick={onClick}
      title={`${book.title} — ${book.author}`}
      className="flex flex-col cursor-pointer hover:-translate-y-1.5 transition-transform duration-200"
      style={{
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: "calc((100% - 90px) / 10)",
        minWidth: "80px",
      }}
    >
      <div
        className="rounded-[3px] overflow-hidden shadow-sm hover:shadow-md w-full"
        style={{ aspectRatio: "2/3" }}
      >
        {!imgError && book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <CoverPlaceholder title={book.title} />
        )}
      </div>
      {showProgress && (
        <div className="mt-1.5 h-1 w-full rounded-full bg-sand-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-terra-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
