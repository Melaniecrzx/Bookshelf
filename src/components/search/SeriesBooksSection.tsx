import { BookOpen } from "lucide-react";
import { BookCover } from "../ui/BookCover";
import { useSeriesBooks } from "@/hooks/useSeriesBooks";

interface SeriesBooksSectionProps {
  seriesId: number;
  seriesName: string;
  currentTitle: string;
  author: string;
  onBookClick?: (title: string) => void;
}

export function SeriesBooksSection({
  seriesId,
  seriesName,
  currentTitle,
  author,
  onBookClick,
}: SeriesBooksSectionProps) {
  const { data: books, isLoading } = useSeriesBooks(seriesId);

  const others = books?.filter((b) => b.title !== currentTitle) ?? [];

  if (!isLoading && others.length === 0) return null;

  const totalCount = books ? books.length + 1 : null; // +1 pour le livre courant

  return (
    <div className="w-full rounded-2xl border border-sand-200 bg-sand-100 overflow-hidden">

      {/* Header */}
      <div className="flex items-start gap-2 px-4 py-3 border-b border-sand-200">
        <BookOpen size={14} strokeWidth={1.75} className="text-ink-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-serif text-sm font-bold text-ink-900 leading-snug">
            {seriesName}
          </p>
          <p className="font-sans text-xs text-ink-400 mt-0.5">
            by {author}{totalCount ? ` · ${totalCount} books` : ""}
          </p>
        </div>
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className="divide-y divide-sand-200">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <div className="w-5 shrink-0" />
              <div className="w-8 h-[46px] rounded bg-sand-200 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-sand-200 animate-pulse rounded w-4/5" />
                <div className="h-2.5 bg-sand-200 animate-pulse rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liste */}
      {!isLoading && others.length > 0 && (
        <div className="divide-y divide-sand-200 max-h-64 overflow-y-auto scrollbar-hide">
          {others.map((book) => (
            <button
              key={book.position}
              onClick={() => onBookClick?.(book.title)}
              disabled={!onBookClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-sand-200 transition-colors disabled:cursor-default"
            >
              <span className="font-sans text-xs text-ink-300 tabular-nums w-5 text-right shrink-0">
                {book.position}
              </span>
              <div className="w-8 h-[46px] rounded overflow-hidden bg-sand-200 shrink-0 shadow-sm">
                <BookCover coverUrl={book.coverUrl} title={book.title} />
              </div>
              <p className="font-sans text-xs text-ink-900 leading-snug line-clamp-2">
                {book.title}
              </p>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
