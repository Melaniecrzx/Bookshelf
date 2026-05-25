interface AuthorEntry {
  name: string;
  count: number;
  cover?: string;
}

interface TopAuthorsCardProps {
  authors: AuthorEntry[];
  authorCount: number;
}

export function TopAuthorsCard({ authors, authorCount }: TopAuthorsCardProps) {
  return (
    <section className="bg-sand-100 border border-sand-300 rounded-xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-lg font-bold text-ink-900">Top authors</h2>
        <span className="text-sm text-ink-400 font-sans">
          {authorCount} author{authorCount !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="flex flex-col gap-3">
        {authors.map(({ name, count, cover }, i) => (
          <li key={name} className="flex items-center gap-3">
            <span className="text-xs text-ink-300 font-sans w-4 shrink-0 text-right">
              {i + 1}
            </span>
            <div className="w-8 h-11 rounded shrink-0 overflow-hidden bg-sand-200">
              {cover ? (
                <img src={cover} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-sand-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans font-medium text-ink-900 truncate">{name}</p>
              <p className="text-xs text-ink-400 font-sans">
                {count} book{count !== 1 ? "s" : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
