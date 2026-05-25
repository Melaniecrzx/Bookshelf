import { X, Trash2, Calendar, BookOpen, CheckCheck } from "lucide-react";
import type { Book } from "../types/book";
import { GenreTag } from "./ui/GenreTag";
import { BookCover } from "./ui/BookCover";
import { StarRating } from "./ui/StarRating";
import { ProgressBar } from "./ui/ProgressBar";
import { ShelfPicker } from "./modal/ShelfPicker";
import { CustomShelvesSection } from "./modal/CustomShelvesSection";
import { useBookModal } from "../hooks/useBookModal";

interface BookModalProps {
  book: Book;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
}

export function BookModal({ book, onClose, onMarkAsRead }: BookModalProps) {
  const {
    notes,
    localRating,
    localPages,
    publishedYear,
    currentStatus,
    handleNotesChange,
    handleRatingChange,
    handleRemove,
    handleMarkAsRead,
    handleShelfChange,
    handlePagesChange,
  } = useBookModal(book, onClose);

  const showProgress = currentStatus === "reading" && !!book.pages;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-sand-50 w-full max-w-md rounded-2xl border border-sand-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-sand-200 transition-colors"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
        <div className="flex gap-5 p-6 pb-4">
          <div className="shrink-0 w-24 aspect-[2/3] rounded-lg overflow-hidden bg-sand-200 shadow-md">
            <BookCover
              coverUrl={book.cover_url}
              isbn={book.isbn}
              title={book.title}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-0 pt-1">
            <h2 className="font-serif text-lg font-bold text-ink-900 leading-snug pr-6">
              {book.title}
            </h2>
            <p className="text-sm font-sans text-ink-500">{book.author}</p>
            <div className="flex flex-col gap-1 mt-0.5">
              {publishedYear && (
                <span className="flex items-center gap-1.5 text-xs font-sans text-ink-400">
                  <Calendar size={11} strokeWidth={1.75} />
                  {publishedYear}
                </span>
              )}
              {currentStatus === "to-read" && book.pages && (
                <span className="flex items-center gap-1.5 text-xs font-sans text-ink-400">
                  <BookOpen size={11} strokeWidth={1.75} />
                  {book.pages} pages
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {book.genres.map((g) => (
                <GenreTag key={g} genre={g} />
              ))}
            </div>
            {currentStatus === "read" && (
              <div className="mt-1.5">
                <StarRating
                  value={localRating}
                  onChange={handleRatingChange}
                  size={16}
                />
              </div>
            )}
            <ShelfPicker status={currentStatus} onChange={handleShelfChange} />
          </div>
        </div>

        <CustomShelvesSection bookId={book.id} />

        {showProgress && (
          <div className="px-6 pb-4">
            <ProgressBar
              value={localPages}
              max={book.pages!}
              className="mb-2"
            />
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={localPages ?? 0}
                min={0}
                max={book.pages!}
                onChange={(e) =>
                  handlePagesChange(
                    Math.max(0, Math.min(book.pages!, Number(e.target.value))),
                  )
                }
                className="w-14 text-xs font-sans font-medium text-ink-700 bg-transparent border-b border-dashed border-sand-300 focus:border-terra-500 focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs font-sans text-ink-400">
                / {book.pages} pages
              </span>
            </div>
          </div>
        )}

        {book.description && (
          <p className="px-6 pb-4 text-xs font-sans text-ink-400 leading-relaxed line-clamp-3">
            {book.description}
          </p>
        )}
        <div className="px-6 pb-5">
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add a note…"
            rows={3}
            className="w-full px-3 py-2.5 bg-white border border-sand-300 rounded-lg text-xs font-sans text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-terra-300 transition-colors resize-none"
          />
        </div>
        <div className="px-6 pt-3 pb-5 border-t border-sand-200 flex items-center justify-between gap-3">
          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-xs font-sans font-medium text-red-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={11} strokeWidth={1.75} />
            Remove from library
          </button>
          {(currentStatus === "reading" || currentStatus === "to-read") && (
            <button
              onClick={() => {
                handleMarkAsRead();
                onMarkAsRead?.(book.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-terra-500 border border-terra-500 rounded-lg hover:bg-terra-50 transition-colors"
            >
              <CheckCheck size={12} strokeWidth={1.75} />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
