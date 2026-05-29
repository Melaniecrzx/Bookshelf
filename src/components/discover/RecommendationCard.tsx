import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { BookCover } from "../ui/BookCover";
import { useHardcoverSearch } from "@/hooks/useHardcoverSearch";
import { useBooks, useAddBook } from "@/hooks/useBooks";
import { toBook } from "@/utils/googleBook";

interface RecommendationCardProps {
  title: string;
  author: string;
  reason: string;
}

export function RecommendationCard({
  title,
  author,
  reason,
}: RecommendationCardProps) {
  const query = `intitle:${title} inauthor:${author}`;
  const { data: googleData, isLoading: coverLoading } = useHardcoverSearch(query);
  const googleResult = googleData?.[0] ?? null;

  const { books: libraryBooks } = useBooks();
  const { mutate: addBook } = useAddBook();
  const [added, setAdded] = useState(false);

  const inLibrary =
    added ||
    libraryBooks.some(
      (b) =>
        b.isbn != null &&
        (b.isbn === googleResult?.isbn13 || b.isbn === googleResult?.isbn10),
    );

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!googleResult || inLibrary) return;
    addBook(toBook(googleResult));
    setAdded(true);
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-sand-100 border border-sand-200">
      {/* Couverture */}
      <div className="shrink-0 w-12 h-[72px] rounded-lg overflow-hidden bg-sand-200 shadow-sm">
        {coverLoading ? (
          <div className="w-full h-full animate-pulse bg-sand-200" />
        ) : (
          <BookCover
            coverUrl={googleResult?.coverUrl}
            isbn={googleResult?.isbn13 ?? googleResult?.isbn10}
            title={title}
          />
        )}
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="font-serif text-base font-bold text-ink-900 leading-snug line-clamp-2">
          {title}
        </p>
        <p className="font-sans text-xs text-ink-400 mt-0.5">
          {[
            author,
            googleResult?.pageCount ? `${googleResult.pageCount} pages` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p className="font-sans text-sm text-ink-700 leading-relaxed mt-2">
          {reason}
        </p>
      </div>

      {/* Bouton Add */}
      <div
        className="shrink-0 ml-2 mt-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        {inLibrary ? (
          <span className="flex items-center gap-1.5 text-xs font-sans font-medium text-terra-500">
            <Check size={13} strokeWidth={2.5} />
            Added
          </span>
        ) : (
          <button
            onClick={handleAdd}
            disabled={!googleResult || coverLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-terra-500 hover:bg-terra-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-sans font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus size={12} strokeWidth={2.5} />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
