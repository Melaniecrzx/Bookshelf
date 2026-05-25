import { ProgressBar } from "../ui/ProgressBar";
import type { ReadingStatus } from "../../types/book";

interface BookProgressProps {
  status: ReadingStatus;
  pagesRead: number;
  localPages: number;
  pageCount: number;
  setLocalPages: (n: number) => void;
  onSave: () => void;
}

export function BookProgress({
  status,
  pagesRead,
  localPages,
  pageCount,
  setLocalPages,
  onSave,
}: BookProgressProps) {
  return (
    <div className="px-6 pb-4">
      <ProgressBar
        value={status === "reading" ? localPages : pagesRead}
        max={pageCount}
        className="mb-1.5"
      />
      <p className="text-xs font-sans text-ink-400 flex items-baseline gap-0.5">
        {status === "reading" ? (
          <input
            type="number"
            value={localPages}
            min={0}
            max={pageCount}
            onChange={(e) => setLocalPages(Number(e.target.value))}
            onBlur={onSave}
            onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
            className="w-12 text-xs font-sans font-medium text-ink-700 bg-transparent border-b border-dashed border-sand-300 focus:border-terra-500 focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ) : (
          <span className="font-medium text-ink-700">{pagesRead}</span>
        )}
        <span>&nbsp;/ {pageCount} pages</span>
      </p>
    </div>
  );
}
