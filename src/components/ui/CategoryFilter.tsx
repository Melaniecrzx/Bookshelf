import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CategoryFilterProps {
  genres: string[];
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

export function CategoryFilter({ genres, selectedGenres, onChange }: CategoryFilterProps) {
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

  const label = selectedGenres.length === 0
    ? 'All categories'
    : selectedGenres.length === 1
    ? selectedGenres[0]
    : `${selectedGenres.length} categories`;

  function toggle(genre: string) {
    onChange(
      selectedGenres.includes(genre)
        ? selectedGenres.filter(g => g !== genre)
        : [...selectedGenres, genre],
    );
  }

  if (genres.length === 0) return null;

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-sans font-medium border transition-colors whitespace-nowrap ${
          selectedGenres.length > 0
            ? 'bg-terra-100 border-terra-200 text-terra-600'
            : 'bg-sand-100 border-sand-300 text-ink-700 hover:bg-sand-200'
        }`}
      >
        <span className="max-w-32 truncate">{label}</span>
        <ChevronDown
          size={13}
          strokeWidth={1.75}
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-sand-50 border border-sand-300 rounded-xl shadow-xl z-30 overflow-hidden">
          <div className="overflow-y-auto py-1" style={{ maxHeight: '240px', scrollBehavior: 'smooth' }}>
            <button
              onClick={() => { onChange([]); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-sans transition-colors ${
                selectedGenres.length === 0 ? 'text-terra-600 bg-terra-50' : 'text-ink-700 hover:bg-sand-100'
              }`}
            >
              All
              {selectedGenres.length === 0 && (
                <Check size={13} strokeWidth={2.5} className="text-terra-500 shrink-0" />
              )}
            </button>

            <div className="mx-3.5 my-1 h-px bg-sand-200" />

            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => toggle(genre)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-sans transition-colors ${
                  selectedGenres.includes(genre) ? 'text-terra-600 bg-terra-50' : 'text-ink-700 hover:bg-sand-100'
                }`}
              >
                <span className="truncate">{genre}</span>
                {selectedGenres.includes(genre) && (
                  <Check size={13} strokeWidth={2.5} className="text-terra-500 shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
