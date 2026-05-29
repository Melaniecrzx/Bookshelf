import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useHardcoverSearch } from "../hooks/useHardcoverSearch";
import { useBooks, useAddBook } from "../hooks/useBooks";
import { useGuestGuard } from "../hooks/useGuestGuard";
import { useDebounce } from "../hooks/useDebounce";
import { toBook } from "../utils/googleBook";
import { SearchInput } from "../components/ui/SearchInput";
import { SearchResultModal } from "../components/SearchResultModal";
import { SearchResultItem } from "../components/search/SearchResultItem";
import { SearchStateView } from "../components/search/SearchStateView";
import type { GoogleBookResult } from "../hooks/useHardcoverSearch";

export function SearchPage() {
  const [searchParams] = useSearchParams();

  const guard = useGuestGuard();
  const { books } = useBooks();
  const { mutate: addBook } = useAddBook();

  const [added, setAdded] = useState<Set<string>>(new Set());
  const [selectedResult, setSelectedResult] = useState<GoogleBookResult | null>(
    null,
  );

  const qParam = searchParams.get("q") ?? "";
  const [input, setInput] = useState(qParam);
  const debouncedQuery = useDebounce(input, 500);

  const { data, isFetching, isError } = useHardcoverSearch(debouncedQuery);
  console.log(data);

  useEffect(() => {
    setInput(qParam);
  }, [qParam]);

  function isInLibrary(result: GoogleBookResult) {
    if (result.isbn13) {
      return (
        books.some((b) => b.isbn === result.isbn13) ||
        added.has(result.googleId)
      );
    }
    return added.has(result.googleId);
  }

  function handleAdd(result: GoogleBookResult) {
    if (isInLibrary(result)) return;
    if (!guard("Sign up to save books to your library")) return;
    addBook(toBook(result));
    setAdded((prev) => new Set([...prev, result.googleId]));
  }

  const hasInput = input.trim().length >= 2;
  const isSearching = hasInput && (input !== debouncedQuery || isFetching);
  const showResults =
    hasInput && !isSearching && !isError && (data?.length ?? 0) > 0;
  const showEmpty = hasInput && !isSearching && !isError && data?.length === 0;

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-ink-400 hover:text-ink-700 transition-colors mb-6"
      >
        <ArrowLeft size={13} /> Back to Library
      </Link>

      <SearchInput
        value={input}
        onChange={setInput}
        placeholder="Title, author or ISBN…"
        autoFocus
      />

      {showResults && (
        <p className="text-xs font-sans text-ink-400 mt-3 mb-4 tabular-nums">
          {data!.length} result{data!.length !== 1 ? "s" : ""} for "
          {debouncedQuery}"
        </p>
      )}

      {!hasInput && <SearchStateView state="idle" />}
      {isSearching && <SearchStateView state="searching" />}
      {isError && <SearchStateView state="error" />}
      {showEmpty && <SearchStateView state="empty" query={debouncedQuery} />}

      {showResults && (
        <ul className="flex flex-col gap-3">
          {data!.map((result) => (
            <SearchResultItem
              key={result.googleId}
              result={result}
              inLibrary={isInLibrary(result)}
              onAdd={handleAdd}
              onClick={() => setSelectedResult(result)}
            />
          ))}
        </ul>
      )}

      <AnimatePresence>
        {selectedResult && (
          <SearchResultModal
            key={selectedResult.googleId}
            result={selectedResult}
            inLibrary={isInLibrary(selectedResult)}
            onClose={() => setSelectedResult(null)}
            onAdd={handleAdd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
