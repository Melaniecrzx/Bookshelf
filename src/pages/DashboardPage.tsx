import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { Book } from "../types/book";
import type { Shelf } from "../hooks/useBooks";
import { BookModal } from "../components/BookModal";
import { RatingModal } from "../components/RatingModal";
import { Confetti } from "../components/ui/Confetti";
import { ShelfSection } from "../components/dashboard/ShelfSection";
import { useBooks, useUpdateBook, useShelves } from "../hooks/useBooks";
import {
  useUserBookShelves,
  useCreateCustomShelf,
  useRenameShelf,
  useDeleteShelf,
  type UserBookShelf,
} from "../hooks/useCustomShelves";
import { useGuestGuard } from "../hooks/useGuestGuard";

export function DashboardPage() {
  const { books } = useBooks();
  const { mutate: updateBook } = useUpdateBook();
  const { data: shelves = [] } = useShelves();
  const { data: userBookShelves = [] } = useUserBookShelves();
  const { mutate: createShelf, isPending: isCreating } = useCreateCustomShelf();
  const { mutate: renameShelf } = useRenameShelf();
  const { mutate: deleteShelf } = useDeleteShelf();

  const guard = useGuestGuard();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [ratingBook, setRatingBook] = useState<{ id: string; title: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [addingShelf, setAddingShelf] = useState(false);
  const [newShelfName, setNewShelfName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function getBooksForShelf(shelf: Shelf): Book[] {
    if (shelf.type === "default") {
      return books.filter((b) => b.shelf_id === shelf.id);
    }
    const bookIds = new Set(
      (userBookShelves as UserBookShelf[])
        .filter((ubs) => ubs.shelf_id === shelf.id)
        .map((ubs) => ubs.book_id),
    );
    return books.filter((b) => bookIds.has(b.id));
  }

  const defaultShelves = shelves.filter((s) => s.type === "default");
  const customShelves = shelves.filter((s) => s.type === "custom");
  const orderedShelves = [...defaultShelves, ...customShelves];

  function openNewShelf() {
    if (!guard('Sign up to create custom shelves')) return;
    setAddingShelf(true);
    setNewShelfName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function cancelNewShelf() {
    setAddingShelf(false);
    setNewShelfName("");
  }

  function handleCreateShelf() {
    const name = newShelfName.trim();
    if (!name) return;
    createShelf(name, { onSuccess: cancelNewShelf });
  }

  function handleMarkAsRead(id: string) {
    const book = books.find((b) => b.id === id);
    setSelectedBook(null);
    setRatingBook(book ? { id: book.id, title: book.title } : null);
  }

  function handleRatingDone(rating: number | null) {
    if (ratingBook && rating !== null) {
      const existing = books.find((b) => b.id === ratingBook.id);
      if (existing) updateBook({ ...existing, rating });
    }
    setRatingBook(null);
    setShowConfetti(true);
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-sand-100 border-b border-sand-200 px-6 py-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 leading-tight">
            Your Library
          </h1>
          <button
            onClick={openNewShelf}
            className="flex items-center gap-1.5 text-xs font-sans font-medium text-terra-500 hover:text-terra-600 transition-colors"
          >
            <Plus size={14} /> New Shelf
          </button>
        </div>
        <div className="py-8 flex flex-col gap-10">
          {addingShelf && (
            <div className="px-6 flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateShelf();
                  if (e.key === "Escape") cancelNewShelf();
                }}
                placeholder="Shelf name..."
                className="flex-1 min-w-0 h-8 md:h-9 px-2.5 md:px-3 rounded-lg border border-sand-300 bg-white font-sans text-xs md:text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-terra-400"
              />
              <button
                onClick={handleCreateShelf}
                disabled={!newShelfName.trim() || isCreating}
                className="shrink-0 h-8 md:h-9 px-2.5 md:px-4 rounded-lg bg-terra-500 text-white font-sans text-xs md:text-sm font-medium hover:bg-terra-600 transition-colors disabled:opacity-40"
              >
                Create
              </button>
              <button
                onClick={cancelNewShelf}
                className="shrink-0 h-8 md:h-9 px-2.5 md:px-4 rounded-lg border border-sand-300 font-sans text-xs md:text-sm text-ink-500 hover:text-ink-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          {orderedShelves.map((shelf, index) => (
            <ShelfSection
              key={shelf.id}
              title={shelf.name}
              books={getBooksForShelf(shelf)}
              onBookClick={setSelectedBook}
              emptyMessage="No books here yet."
              viewMoreTo={`/library/shelf/${shelf.id}`}
              onRename={shelf.type === "custom" ? (name) => renameShelf({ id: shelf.id, name }) : undefined}
              onDelete={shelf.type === "custom" ? () => deleteShelf(shelf.id) : undefined}
              animationDelay={index * 0.07}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedBook && (
          <BookModal
            key={selectedBook.id}
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </AnimatePresence>
      {ratingBook && (
        <RatingModal
          bookTitle={ratingBook.title}
          onDismiss={() => handleRatingDone(null)}
          onSave={handleRatingDone}
        />
      )}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    </>
  );
}
