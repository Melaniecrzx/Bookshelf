import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, BookOpen, Hash, Plus, Check, Loader2 } from "lucide-react";
import type { GoogleBookResult } from "../hooks/useHardcoverSearch";
import { useHardcoverSearch } from "../hooks/useHardcoverSearch";
import { GenreTag } from "./ui/GenreTag";
import { BookCover } from "./ui/BookCover";
import { SeriesBooksSection } from "./search/SeriesBooksSection";

interface SearchResultModalProps {
  result: GoogleBookResult;
  inLibrary: boolean;
  onClose: () => void;
  onAdd: (result: GoogleBookResult) => void;
}

export function SearchResultModal({
  result,
  inLibrary,
  onClose,
  onAdd,
}: SearchResultModalProps) {
  const [added, setAdded] = useState(inLibrary);
  const [current, setCurrent] = useState<GoogleBookResult>(result);
  const [innerQuery, setInnerQuery] = useState("");

  const { data: innerResults, isFetching } = useHardcoverSearch(innerQuery);

  // Quand les résultats de la recherche série arrivent, on navigue vers le premier
  useEffect(() => {
    if (innerQuery && innerResults && innerResults.length > 0) {
      setCurrent(innerResults[0]);
      setAdded(false);
      setInnerQuery("");
    }
  }, [innerResults, innerQuery]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const year = current.publishedDate?.slice(0, 4);
  const isbn = current.isbn13 ?? current.isbn10;
  const seriesLabel =
    current.series && current.seriesPosition != null
      ? `${current.series} #${current.seriesPosition}`
      : current.series ?? null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />
      <motion.div
        className="relative z-10 bg-sand-50 w-full max-w-6xl rounded-2xl border border-sand-300 shadow-2xl flex flex-col max-h-[90dvh]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-sand-200 transition-colors z-10"
        >
          <X size={16} strokeWidth={1.75} />
        </button>

        <div className="overflow-y-auto flex-1 scrollbar-hide">

          {/* ── Mobile : colonne unique ───────────────────────── */}
          <div className="md:hidden flex flex-col gap-4 p-5">
            <div className="w-28 mx-auto aspect-[2/3] rounded-lg overflow-hidden bg-sand-200 shadow-md">
              <BookCover coverUrl={current.coverUrl} isbn={current.isbn13 ?? current.isbn10} title={current.title} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink-900 leading-snug">{current.title}</h2>
            <p className="text-base font-sans text-ink-500 -mt-2">{current.authors.join(", ") || "Unknown author"}</p>
            {seriesLabel && (
              <p className="text-sm font-sans text-terra-500 font-medium -mt-2">{seriesLabel}</p>
            )}
            <div className="flex flex-col gap-2">
              {year && (
                <span className="flex items-center gap-2 text-sm font-sans text-ink-400">
                  <Calendar size={13} strokeWidth={1.75} />{year}{current.publisher ? ` · ${current.publisher}` : ""}
                </span>
              )}
              {current.pageCount && (
                <span className="flex items-center gap-2 text-sm font-sans text-ink-400">
                  <BookOpen size={13} strokeWidth={1.75} />{current.pageCount} pages
                </span>
              )}
              {isbn && (
                <span className="flex items-center gap-2 text-sm font-sans text-ink-400 tabular-nums">
                  <Hash size={13} strokeWidth={1.75} />{isbn}
                </span>
              )}
            </div>
            {current.genres.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {current.genres.map((g) => <GenreTag key={g} genre={g} />)}
              </div>
            )}
            {current.seriesId && current.series && (
              <SeriesBooksSection
                seriesId={current.seriesId}
                seriesName={current.series}
                currentTitle={current.title}
                author={current.authors[0] ?? ""}
                onBookClick={setInnerQuery}
              />
            )}
            {current.description && (
              <p className="text-sm font-sans text-ink-500 leading-relaxed">{current.description}</p>
            )}
          </div>

          {/* ── Desktop : deux colonnes ───────────────────────── */}
          <div className="hidden md:flex gap-6 p-6">
            {/* Colonne gauche — cover + série */}
            <div className="w-44 shrink-0 flex flex-col gap-4">
              <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-sand-200 shadow-md">
                <BookCover coverUrl={current.coverUrl} isbn={current.isbn13 ?? current.isbn10} title={current.title} />
              </div>
              {current.seriesId && current.series && (
                <SeriesBooksSection
                  seriesId={current.seriesId}
                  seriesName={current.series}
                  currentTitle={current.title}
                  author={current.authors[0] ?? ""}
                  onBookClick={setInnerQuery}
                />
              )}
            </div>

            {/* Colonne droite — métadonnées + description */}
            <div className="flex-1 min-w-0 pr-8">
              <h2 className="font-serif text-3xl font-bold text-ink-900 leading-snug">{current.title}</h2>
              <p className="text-base font-sans text-ink-500 mt-2">{current.authors.join(", ") || "Unknown author"}</p>
              {seriesLabel && (
                <p className="text-sm font-sans text-terra-500 font-medium mt-1">{seriesLabel}</p>
              )}
              <div className="flex flex-col gap-2 mt-5">
                {year && (
                  <span className="flex items-center gap-2 text-sm font-sans text-ink-400">
                    <Calendar size={13} strokeWidth={1.75} />{year}{current.publisher ? ` · ${current.publisher}` : ""}
                  </span>
                )}
                {current.pageCount && (
                  <span className="flex items-center gap-2 text-sm font-sans text-ink-400">
                    <BookOpen size={13} strokeWidth={1.75} />{current.pageCount} pages
                  </span>
                )}
                {isbn && (
                  <span className="flex items-center gap-2 text-sm font-sans text-ink-400 tabular-nums">
                    <Hash size={13} strokeWidth={1.75} />{isbn}
                  </span>
                )}
              </div>
              {current.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {current.genres.map((g) => <GenreTag key={g} genre={g} />)}
                </div>
              )}
              {current.description && (
                <p className="text-sm font-sans text-ink-500 leading-relaxed mt-4">{current.description}</p>
              )}
            </div>
          </div>

          {/* Overlay de chargement lors de la navigation entre livres */}
          {isFetching && (
            <div className="absolute inset-0 bg-sand-50/70 flex items-center justify-center rounded-2xl z-20">
              <Loader2 size={24} className="text-terra-500 animate-spin" />
            </div>
          )}

        </div>

        <div className="px-6 py-4 border-t border-sand-200 shrink-0">
          {added ? (
            <span className="flex items-center gap-2 text-sm font-sans font-medium text-terra-500">
              <Check size={14} strokeWidth={2.5} />
              Added to library
            </span>
          ) : (
            <button
              onClick={() => {
                onAdd(current);
                setAdded(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-terra-500 hover:bg-terra-600 text-white text-sm font-sans font-medium rounded-xl transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add to library
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
