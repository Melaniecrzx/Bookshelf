interface Milestone {
  pct: number;
  target: number;
  reached: boolean;
}

interface MilestonesCardProps {
  milestones: Milestone[];
}

export function MilestonesCard({ milestones }: MilestonesCardProps) {
  return (
    <section className="bg-sand-100 border border-sand-300 rounded-xl p-6">
      <h2 className="font-serif text-lg font-bold text-ink-900 mb-4">Milestones</h2>
      <div className="flex flex-col gap-2.5">
        {milestones.map(({ pct, target, reached }) => (
          <div
            key={pct}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
              reached ? "bg-terra-50 border border-terra-200" : "bg-sand-200"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                reached ? "bg-terra-500" : "bg-sand-300"
              }`}
            >
              {reached ? (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M2 6.5l3 3L11 3"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="text-[10px] font-sans font-semibold text-ink-400">
                  {pct}%
                </span>
              )}
            </div>
            <p
              className={`text-sm font-sans font-medium flex-1 ${
                reached ? "text-terra-600" : "text-ink-700"
              }`}
            >
              {pct}% — {target} book{target !== 1 ? "s" : ""}
            </p>
            {reached && (
              <span className="text-xs font-sans text-terra-500 font-semibold shrink-0">
                Reached!
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
