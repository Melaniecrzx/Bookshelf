import { useEffect, useRef, useState } from 'react';
import { ArrowUpDown, Check } from 'lucide-react';

export type SortKey = 'title' | 'author' | 'published_year' | 'pages' | 'rating';

const options: { key: SortKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'published_year', label: 'Published date' },
  { key: 'pages', label: 'Pages' },
  { key: 'rating', label: 'Rating' },
];

interface SortFilterProps {
  value: SortKey | null;
  onChange: (key: SortKey | null) => void;
}

export function SortFilter({ value, onChange }: SortFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const label = value ? options.find(o => o.key === value)?.label ?? 'Sort by' : 'Sort by';

  function select(key: SortKey) {
    onChange(value === key ? null : key);
    setOpen(false);
  }

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-sans font-medium border transition-colors whitespace-nowrap ${
          value
            ? 'bg-terra-100 border-terra-200 text-terra-600'
            : 'bg-sand-100 border-sand-300 text-ink-700 hover:bg-sand-200'
        }`}
      >
        <ArrowUpDown size={13} strokeWidth={1.75} className="shrink-0" />
        <span>{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-sand-50 border border-sand-300 rounded-xl shadow-xl z-30 overflow-hidden">
          <div className="py-1">
            {options.map(({ key, label: optLabel }) => (
              <button
                key={key}
                onClick={() => select(key)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-sans transition-colors ${
                  value === key ? 'text-terra-600 bg-terra-50' : 'text-ink-700 hover:bg-sand-100'
                }`}
              >
                {optLabel}
                {value === key && (
                  <Check size={13} strokeWidth={2.5} className="text-terra-500 shrink-0" />
                )}
              </button>
            ))}

            <div className="mx-3.5 my-1 h-px bg-sand-200" />

            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full flex items-center px-3.5 py-2 text-sm font-sans text-ink-400 hover:text-ink-700 hover:bg-sand-100 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
