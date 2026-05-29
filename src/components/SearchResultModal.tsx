import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, BookOpen, Hash, Plus, Check } from "lucide-react";
import type { GoogleBookResult } from "../hooks/useGoogleBooks";
import { GenreTag } from "./ui/GenreTag";
import { BookCover } from "./ui/BookCover";

interface SearchResultModalProps {
  result: GoogleBookResult;
  inLibrary: boolean;
  onClose: () => void;
  onAdd: (result: GoogleBookResult) => void;
}

export function SearchResultModal({ result, inLibrary, onClose, onAdd }: SearchResultModalProps) {
  const [added, setAdded] = useState(inLibrary);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const year = result.publishedDate?.slice(0, 4);
  const isbn = result.isbn13 ?? result.isbn10;

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
        className="relative z-10 bg-sand-50 w-full max-w-md rounded-2xl border border-sand-300 shadow-2xl flex flex-col max-h-[90dvh]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-sand-200 transition-colors z-10">
          <X size={16} strokeWidth={1.75} />
        </button>

        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <div className="flex gap-5 p-6 pb-4">
            <div className="shrink-0 w-24 aspect-[2/3] rounded-lg overflow-hidden bg-sand-200 shadow-md">
              <BookCover coverUrl={result.coverUrl} isbn={result.isbn13 ?? result.isbn10} title={result.title} />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0 pt-1 pr-6">
              <h2 className="font-serif text-lg font-bold text-ink-900 leading-snug">{result.title}</h2>
              <p className="text-sm font-sans text-ink-500">{result.authors.join(", ") || "Unknown author"}</p>
              <div className="flex flex-col gap-1.5 mt-1">
                {year && (
                  <span className="flex items-center gap-1.5 text-xs font-sans text-ink-400">
                    <Calendar size={11} strokeWidth={1.75} />
                    {year}{result.publisher ? ` · ${result.publisher}` : ""}
                  </span>
                )}
                {result.pageCount && (
                  <span className="flex items-center gap-1.5 text-xs font-sans text-ink-400">
                    <BookOpen size={11} strokeWidth={1.75} />{result.pageCount} pages
                  </span>
                )}
                {isbn && (
                  <span className="flex items-center gap-1.5 text-xs font-sans text-ink-400 tabular-nums">
                    <Hash size={11} strokeWidth={1.75} />{isbn}
                  </span>
                )}
              </div>
              {result.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.genres.map((g) => <GenreTag key={g} genre={g} />)}
                </div>
              )}
            </div>
          </div>
          {result.description && (
            <p className="px-6 pb-6 text-xs font-sans text-ink-500 leading-relaxed">
              {result.description}
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-sand-200 shrink-0">
          {added ? (
            <span className="flex items-center gap-2 text-sm font-sans font-medium text-terra-500">
              <Check size={14} strokeWidth={2.5} />Added to library
            </span>
          ) : (
            <button
              onClick={() => { onAdd(result); setAdded(true); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-terra-500 hover:bg-terra-600 text-white text-sm font-sans font-medium rounded-xl transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} />Add to library
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
