import { Plus, Check } from "lucide-react";
import type { GoogleBookResult } from "../../hooks/useGoogleBooks";
import { BookCover } from "../ui/BookCover";

interface SearchResultItemProps {
  result: GoogleBookResult;
  inLibrary: boolean;
  onAdd: (result: GoogleBookResult) => void;
  onClick: () => void;
}

export function SearchResultItem({
  result,
  inLibrary,
  onAdd,
  onClick,
}: SearchResultItemProps) {
  return (
    <li
      onClick={onClick}
      className="flex items-center gap-4 bg-sand-100 border border-sand-200 rounded-xl p-4 cursor-pointer hover:border-sand-300 transition-colors"
    >
      <div className="shrink-0 w-12 h-[72px] rounded-lg overflow-hidden bg-sand-200 shadow-sm">
        <BookCover
          coverUrl={result.coverUrl}
          isbn={result.isbn13 ?? result.isbn10}
          title={result.title}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-base font-bold text-ink-900 leading-snug line-clamp-2">
          {result.title}
        </p>
        <p className="text-sm font-sans text-ink-500 mt-0.5 truncate">
          {result.authors.join(", ") || "Unknown author"}
        </p>
        {(result.publishedDate || result.pageCount) && (
          <p className="text-xs font-sans text-ink-400 mt-1 tabular-nums">
            {[
              result.publishedDate?.slice(0, 4),
              result.pageCount ? `${result.pageCount} p.` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>
      <div className="shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
        {inLibrary ? (
          <span className="flex items-center gap-1.5 text-xs font-sans font-medium text-terra-500">
            <Check size={13} strokeWidth={2.5} />
            Added
          </span>
        ) : (
          <button
            onClick={() => onAdd(result)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-terra-500 hover:bg-terra-600 text-white text-xs font-sans font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus size={12} strokeWidth={2.5} />
            Add
          </button>
        )}
      </div>
    </li>
  );
}
