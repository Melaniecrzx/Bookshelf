import { Check, Plus } from "lucide-react";
import { useShelves } from "../../hooks/useBooks";
import { useUserBookShelves, useToggleBookInShelf } from "../../hooks/useCustomShelves";

interface CustomShelvesSectionProps {
  bookId: string;
}

export function CustomShelvesSection({ bookId }: CustomShelvesSectionProps) {
  const { data: allShelves = [] } = useShelves();
  const customShelves = allShelves.filter((s) => s.type === "custom");
  const { data: userBookShelves = [] } = useUserBookShelves();
  const { mutate: toggle, isPending } = useToggleBookInShelf();

  if (customShelves.length === 0) return null;

  const bookShelfIds = new Set(
    userBookShelves
      .filter((ubs) => ubs.book_id === bookId)
      .map((ubs) => ubs.shelf_id),
  );

  return (
    <div className="px-6 pb-4">
      <p className="text-[11px] font-sans font-medium text-ink-400 uppercase tracking-wide mb-2">
        My shelves
      </p>
      <div className="flex flex-col gap-1">
        {customShelves.map((shelf) => {
          const isIn = bookShelfIds.has(shelf.id);
          return (
            <button
              key={shelf.id}
              disabled={isPending}
              onClick={() => toggle({ bookId, shelfId: shelf.id, add: !isIn })}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-sans transition-colors ${
                isIn
                  ? "bg-terra-500/10 text-terra-500 border border-terra-500/25"
                  : "bg-sand-100 text-ink-500 hover:bg-sand-200 border border-transparent"
              }`}
            >
              <span>{shelf.name}</span>
              {isIn ? (
                <Check size={11} strokeWidth={2.5} />
              ) : (
                <Plus size={11} strokeWidth={2} className="text-ink-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
