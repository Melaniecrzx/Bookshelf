import { Search, BookOpen } from "lucide-react";

type State = "idle" | "searching" | "error" | "empty";

interface SearchStateViewProps {
  state: State;
  query?: string;
}

export function SearchStateView({ state, query }: SearchStateViewProps) {
  if (state === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Search size={36} strokeWidth={0.75} className="text-ink-300" />
        <p className="text-sm font-sans text-ink-400 text-center max-w-xs">
          Search by title, author or ISBN
        </p>
      </div>
    );
  }

  if (state === "searching") {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm font-sans text-ink-400">Searching…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm font-sans text-red-400">
          Search failed. Check your API key.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <BookOpen size={36} strokeWidth={0.75} className="text-ink-300" />
      <p className="text-sm font-sans text-ink-500">No results for "{query}"</p>
    </div>
  );
}
