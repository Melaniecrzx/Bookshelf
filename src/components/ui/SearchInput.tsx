import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', autoFocus }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-9 pr-9 py-2.5 bg-sand-100 border border-sand-300 rounded-lg text-sm text-ink-900 placeholder:text-ink-400 font-sans focus:outline-none focus:border-terra-300 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
