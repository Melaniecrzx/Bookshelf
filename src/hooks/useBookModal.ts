import { useEffect, useRef, useState } from "react";
import type { Book, ReadingStatus } from "../types/book";
import { useDeleteBook, useUpdateBook, useShelves } from "./useBooks";
import {
  useReadingProgress,
  useUpdateReadingProgress,
} from "./useReadingProgress";
import { useDebounce } from "./useDebounce";
import { useGuestGuard } from "./useGuestGuard";

const STATUS_BY_SHELF_NAME: Record<string, ReadingStatus> = {
  "Want to Read": "to-read",
  "Currently Reading": "reading",
  Read: "read",
};

const SHELF_NAME_BY_STATUS: Record<ReadingStatus, string> = {
  "to-read": "Want to Read",
  reading: "Currently Reading",
  read: "Read",
};

export function useBookModal(book: Book, onClose: () => void) {
  const guard = useGuestGuard();
  const { mutate: removeMutate } = useDeleteBook();
  const { mutate: updateMutate } = useUpdateBook();
  const { data: shelves = [] } = useShelves();

  const pagesRead = useReadingProgress(book.id);
  const { mutate: updateProgress } = useUpdateReadingProgress(book.id);

  const [notes, setNotes] = useState(book.notes ?? "");
  const [localRating, setLocalRating] = useState<number | null>(
    book.rating ?? null,
  );
  const [localPages, setLocalPages] = useState(pagesRead ?? 0);
  const debouncedPages = useDebounce(localPages, 500);
  const hasInteracted = useRef(false);

  const publishedYear = book.published_year ?? null;

  const currentShelf = shelves.find((s) => s.id === book.shelf_id);
  const currentStatus: ReadingStatus =
    (currentShelf ? STATUS_BY_SHELF_NAME[currentShelf.name] : undefined) ??
    book.status ??
    "to-read";

  useEffect(() => {
    if (pagesRead !== undefined && !hasInteracted.current) {
      setLocalPages(pagesRead);
    }
  }, [pagesRead]);
  // Auto-save after user input (debounced)
  useEffect(() => {
    if (hasInteracted.current) {
      updateProgress(debouncedPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPages]);

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

  function handleNotesChange(value: string) {
    setNotes(value);
    updateMutate({ ...book, notes: value });
  }

  function handleRatingChange(rating: number | null) {
    setLocalRating(rating);
    updateMutate({ ...book, rating });
  }

  function handleRemove() {
    removeMutate(book.id);
    onClose();
  }

  function handleMarkAsRead() {
    const readShelf = shelves.find((s) => s.name === "Read");
    updateMutate({
      ...book,
      status: "read",
      shelf_id: readShelf?.id ?? book.shelf_id,
      date_finished: new Date().toISOString(),
    });
  }

  function handleShelfChange(status: ReadingStatus) {
    if (status === currentStatus) return;
    const newShelf = shelves.find(
      (s) => s.name === SHELF_NAME_BY_STATUS[status],
    );
    updateMutate({
      ...book,
      status,
      shelf_id: newShelf?.id ?? book.shelf_id,
    });
    onClose();
  }

  function handlePagesChange(n: number) {
    if (!guard('Sign up to track your reading progress')) return;
    hasInteracted.current = true;
    setLocalPages(n);
  }

  return {
    notes,
    localRating,
    localPages,
    publishedYear,
    currentStatus,
    pagesRead,
    updateProgress,
    handleNotesChange,
    handleRatingChange,
    handleRemove,
    handleMarkAsRead,
    handleShelfChange,
    handlePagesChange,
  };
}
