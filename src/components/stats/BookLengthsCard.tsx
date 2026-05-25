import { MonthlyBarChart } from "../charts/MonthlyBarChart";
import type { Book } from "../../types/book";

interface LengthCategory {
  label: string;
  color: string;
  count: number;
  pct: number;
}

interface BookLengthsCardProps {
  monthlyData: { name: string; count: number; isCurrent: boolean }[];
  bookLengthData: LengthCategory[];
  shortest: Book | null;
  longest: Book | null;
}

export function BookLengthsCard({
  monthlyData,
  bookLengthData,
  shortest,
  longest,
}: BookLengthsCardProps) {
  return (
    <>
      <section className="bg-sand-100 border border-sand-300 rounded-xl p-6">
        <h2 className="font-serif text-lg font-bold text-ink-900 mb-5">
          Books read per month
        </h2>
        <MonthlyBarChart data={monthlyData} />
      </section>

      <section className="bg-sand-100 border border-sand-300 rounded-xl p-6">
        <h2 className="font-serif text-lg font-bold text-ink-900 mb-5">
          Book lengths
        </h2>
        <div className="flex flex-col gap-4">
          {bookLengthData.map(({ label, color, count, pct }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs font-sans text-ink-400 w-20 shrink-0">
                {label}
              </span>
              <div className="flex-1 h-2.5 bg-sand-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-sm font-sans text-ink-500 w-4 text-right shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
        {(shortest || longest) && (
          <div className="mt-5 pt-4 border-t border-sand-200 grid grid-cols-2 gap-3">
            {[{ label: "Shortest", book: shortest }, { label: "Longest", book: longest }].map(
              ({ label, book }) =>
                book ? (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-8 h-11 rounded shrink-0 overflow-hidden bg-sand-200">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-sand-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-sans text-ink-400 uppercase tracking-wide mb-0.5">
                        {label}
                      </p>
                      <p className="text-xs font-sans font-medium text-ink-900 truncate leading-tight">
                        {book.title}
                      </p>
                      <p className="text-xs font-sans text-ink-400">{book.pageCount} pages</p>
                    </div>
                  </div>
                ) : null,
            )}
          </div>
        )}
      </section>
    </>
  );
}
