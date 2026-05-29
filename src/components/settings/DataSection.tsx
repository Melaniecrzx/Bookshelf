import { useRef, useState } from "react";
import Papa from "papaparse";
import { Upload, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { useImportBooks, type ImportBookPayload } from "../../hooks/useBooks";

// Goodreads exports ISBN13 as ="9780..." — strip the ="..." wrapper
function cleanIsbn(raw: string): string | null {
  const stripped = raw.replace(/^="?|"?=?$/g, "").replace(/[^0-9X]/gi, "");
  return stripped.length >= 10 ? stripped : null;
}

function parseGoodreadsRow(row: Record<string, string>): ImportBookPayload | null {
  const title = row["Title"]?.trim();
  const author = row["Author"]?.trim();
  if (!title || !author) return null;

  const exclusiveShelf = row["Exclusive Shelf"]?.trim().toLowerCase() ?? "to-read";
  const validShelves = ["read", "currently-reading", "to-read"];

  const rawIsbn = row["ISBN13"] ?? row["ISBN"] ?? "";
  const isbn = cleanIsbn(rawIsbn);

  const pagesRaw = parseInt(row["Number of Pages"] ?? "", 10);
  const pages = isNaN(pagesRaw) || pagesRaw <= 0 ? null : pagesRaw;

  const yearRaw = parseInt(row["Original Publication Year"] ?? row["Year Published"] ?? "", 10);
  const published_year = isNaN(yearRaw) ? null : yearRaw;

  const ratingRaw = parseFloat(row["My Rating"] ?? "");
  const rating = isNaN(ratingRaw) || ratingRaw === 0 ? null : ratingRaw;

  // Date Read from Goodreads: "2023/04/15"
  const dateRaw = row["Date Read"]?.trim();
  let date_finished: string | null = null;
  if (dateRaw && dateRaw.length > 0) {
    // Goodreads format: YYYY/MM/DD → ISO YYYY-MM-DD
    const isoDate = dateRaw.replace(/\//g, "-");
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
      date_finished = isoDate;
    }
  }

  return {
    title,
    author,
    isbn,
    pages,
    published_year,
    rating,
    exclusive_shelf: validShelves.includes(exclusiveShelf) ? exclusiveShelf : "to-read",
    date_finished,
  };
}

type ImportState = "idle" | "parsing" | "importing" | "done" | "error";

export function DataSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: importBooks } = useImportBooks();

  const [state, setState] = useState<ImportState>("idle");
  const [progress, setProgress] = useState(0);      // 0–100
  const [total, setTotal] = useState(0);
  const [imported, setImported] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const reset = () => {
    setState("idle");
    setProgress(0);
    setTotal(0);
    setImported(0);
    setSkipped(0);
    setErrorMsg(null);
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setState("parsing");
    setProgress(0);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as Record<string, string>[];
        const parsed = rows.map(parseGoodreadsRow).filter((r): r is ImportBookPayload => r !== null);

        if (parsed.length === 0) {
          setState("error");
          setErrorMsg("No valid books found in this file. Make sure it's a Goodreads library export.");
          return;
        }

        setTotal(parsed.length);
        setState("importing");

        // Import by chunks of 10 to show progress
        const CHUNK = 10;
        let done = 0;
        let importedCount = 0;

        for (let i = 0; i < parsed.length; i += CHUNK) {
          const chunk = parsed.slice(i, i + CHUNK);
          try {
            const count = await importBooks(chunk);
            importedCount += typeof count === "number" ? count : chunk.length;
          } catch {
            // chunk failed silently
          }
          done += chunk.length;
          setProgress(Math.round((done / parsed.length) * 100));
        }

        const skippedCount = parsed.length - importedCount;
        setImported(importedCount);
        setSkipped(skippedCount);
        setState("done");
      },
      error: (err) => {
        setState("error");
        setErrorMsg(`Parsing error: ${err.message}`);
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".csv")) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Import Card */}
      <div className="bg-sand-100 border border-sand-300 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="font-sans text-sm font-semibold text-ink-900">Import from Goodreads</p>
            <p className="font-sans text-xs text-ink-400 mt-1">
              Import your library from a Goodreads CSV export.
              <br />
              <a
                href="https://www.goodreads.com/review/import"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terra-500 hover:underline"
              >
                Export my Goodreads data →
              </a>
            </p>
          </div>
        </div>

        {/* Drop zone — only shown when idle */}
        {state === "idle" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-sand-400 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-terra-400 hover:bg-terra-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center">
              <Upload size={18} strokeWidth={1.75} className="text-ink-400" />
            </div>
            <div className="text-center">
              <p className="font-sans text-sm font-medium text-ink-700">
                Drop your file here
              </p>
              <p className="font-sans text-xs text-ink-400 mt-0.5">
                or <span className="text-terra-500 font-medium">browse</span> — .csv files only
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Parsing state */}
        {state === "parsing" && (
          <div className="flex items-center gap-3 py-4">
            <FileText size={18} className="text-ink-400 shrink-0" />
            <div className="flex-1">
              <p className="font-sans text-sm text-ink-700">Reading <span className="font-medium">{fileName}</span>…</p>
              <div className="mt-2 h-1.5 bg-sand-300 rounded-full overflow-hidden">
                <div className="h-full bg-terra-400 rounded-full animate-pulse w-1/3" />
              </div>
            </div>
          </div>
        )}

        {/* Importing state */}
        {state === "importing" && (
          <div className="py-2">
            <div className="flex items-center justify-between mb-2">
              <p className="font-sans text-sm text-ink-700">
                Importing… <span className="font-medium">{Math.round((progress / 100) * total)}</span> / {total} books
              </p>
              <span className="font-sans text-xs text-ink-400">{progress}%</span>
            </div>
            <div className="h-2 bg-sand-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-terra-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Done state */}
        {state === "done" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-sans text-sm font-semibold text-green-800">
                  Import complete!
                </p>
                <p className="font-sans text-xs text-green-700 mt-0.5">
                  <span className="font-medium">{imported}</span> book{imported !== 1 ? "s" : ""} successfully imported
                  {skipped > 0 && (
                    <> · <span className="font-medium">{skipped}</span> skipped (already in your library)</>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="self-start px-4 py-2 rounded-lg border border-sand-300 text-sm font-sans text-ink-700 hover:bg-sand-200 transition-colors"
            >
              Import another file
            </button>
          </div>
        )}

        {/* Error state */}
        {state === "error" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-sans text-sm font-semibold text-red-800">Import failed</p>
                <p className="font-sans text-xs text-red-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={reset}
              className="self-start px-4 py-2 rounded-lg border border-sand-300 text-sm font-sans text-ink-700 hover:bg-sand-200 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Instructions card */}
      <div className="bg-sand-100 border border-sand-300 rounded-2xl p-5">
        <p className="font-sans text-xs font-semibold text-ink-700 mb-2">How to get your Goodreads export?</p>
        <ol className="font-sans text-xs text-ink-500 flex flex-col gap-1.5 list-decimal list-inside">
          <li>Go to <span className="font-medium text-ink-700">goodreads.com</span> → My Account → My Books</li>
          <li>Click <span className="font-medium text-ink-700">Import/Export</span> in the sidebar</li>
          <li>Click <span className="font-medium text-ink-700">Export Library</span></li>
          <li>Download the <span className="font-medium text-ink-700">goodreads_library_export.csv</span> file</li>
          <li>Import it here</li>
        </ol>
      </div>
    </div>
  );
}
