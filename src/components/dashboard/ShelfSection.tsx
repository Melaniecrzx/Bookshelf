import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import type { Book } from "../../types/book";
import { ShelfBook } from "./ShelfBook";
import { Shelf } from "./Shelf";

interface ShelfSectionProps {
  title: string;
  books: Book[];
  onBookClick: (book: Book) => void;
  emptyMessage: string;
  viewMoreTo: string;
  onRename?: (name: string) => void;
  onDelete?: () => void;
  animationDelay?: number;
}

export function ShelfSection({
  title,
  books,
  onBookClick,
  emptyMessage,
  viewMoreTo,
  onRename,
  onDelete,
  animationDelay = 0,
}: ShelfSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  function startRename() {
    setMenuOpen(false);
    setRenameValue(title);
    setRenaming(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function confirmRename() {
    const name = renameValue.trim();
    if (name && name !== title) onRename?.(name);
    setRenaming(false);
  }

  function cancelRename() {
    setRenaming(false);
    setRenameValue(title);
  }

  const hasActions = !!(onRename || onDelete);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: animationDelay }}
    >
      <div className="flex items-center justify-between mb-3 px-6">
        {/* Left — title or rename input */}
        <div className="flex items-center gap-2 min-w-0">
          {renaming ? (
            <>
              <input
                ref={inputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmRename();
                  if (e.key === "Escape") cancelRename();
                }}
                className="font-serif text-lg font-bold text-ink-900 bg-transparent border-b-2 border-terra-500 focus:outline-none min-w-[80px] max-w-[200px]"
              />
              <button
                onClick={confirmRename}
                className="shrink-0 text-terra-500 hover:text-terra-600 transition-colors"
              >
                <Check size={14} strokeWidth={2} />
              </button>
              <button
                onClick={cancelRename}
                className="shrink-0 text-ink-400 hover:text-ink-700 transition-colors"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <h2 className="font-serif text-lg font-bold text-ink-900 truncate">{title}</h2>
              {books.length > 0 && (
                <span className="text-xs font-sans text-ink-400 shrink-0">{books.length}</span>
              )}
            </>
          )}
        </div>

        {/* Right — actions + view more */}
        {!renaming && (
          <div className="flex items-center gap-3 shrink-0">
            {hasActions && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1 rounded-md text-ink-400 hover:text-ink-700 hover:bg-sand-200 transition-colors"
                >
                  <MoreHorizontal size={15} strokeWidth={1.75} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 z-20 min-w-[136px] bg-sand-50 border border-sand-300 rounded-xl shadow-lg py-1">
                    {onRename && (
                      <button
                        onClick={startRename}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-ink-700 hover:bg-sand-100 transition-colors"
                      >
                        <Pencil size={11} strokeWidth={1.75} />
                        Rename
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => { setMenuOpen(false); onDelete(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-red-400 hover:bg-sand-100 transition-colors"
                      >
                        <Trash2 size={11} strokeWidth={1.75} />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            <Link
              to={viewMoreTo}
              className="flex items-center gap-1 text-xs font-sans font-medium text-terra-500 hover:text-terra-600 transition-colors"
            >
              View more <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      <div className="px-6">
        {books.length === 0 ? (
          <p className="text-sm font-sans text-ink-400 italic pb-3">{emptyMessage}</p>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-0.5">
            {books.map((book) => (
              <ShelfBook key={book.id} book={book} onClick={() => onBookClick(book)} />
            ))}
          </div>
        )}
        <Shelf />
      </div>
    </motion.section>
  );
}
