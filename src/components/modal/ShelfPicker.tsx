import { useRef, useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { ReadingStatus } from "../../types/book";

const SHELVES: { status: ReadingStatus; label: string }[] = [
  { status: "reading",  label: "Currently Reading" },
  { status: "to-read",  label: "Want to Read" },
  { status: "read",     label: "Read" },
];

const SHELF_STYLE: Record<ReadingStatus, { label: string; color: string; bg: string }> = {
  reading:   { label: "Reading",  color: "#E8825A", bg: "#FEF4EF" },
  read:      { label: "Read",     color: "#6B9B6E", bg: "#EBF5EC" },
  "to-read": { label: "To Read",  color: "#8A8B90", bg: "#F0F0F2" },
};

interface ShelfPickerProps {
  status: ReadingStatus;
  onChange: (s: ReadingStatus) => void;
}

export function ShelfPicker({ status, onChange }: ShelfPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const style = SHELF_STYLE[status];

  return (
    <div ref={ref} className="relative mt-1.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-sans font-medium border transition-colors hover:brightness-95"
        style={{ color: style.color, backgroundColor: style.bg, borderColor: style.color }}
      >
        {style.label}
        <ChevronDown
          size={10}
          strokeWidth={2}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-20 min-w-[168px] bg-sand-50 border border-sand-300 rounded-xl shadow-lg py-1">
          {SHELVES.map((s) => (
            <button
              key={s.status}
              onClick={() => { onChange(s.status); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans text-left transition-colors ${
                s.status === status ? "font-medium bg-sand-100" : "text-ink-700 hover:bg-sand-100"
              }`}
              style={s.status === status ? { color: SHELF_STYLE[s.status].color } : {}}
            >
              {s.label}
              {s.status === status && <Check size={10} strokeWidth={2.5} className="shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
