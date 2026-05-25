import { useState } from "react";
import { CircularProgress } from "./CircularProgress";
import { CURRENT_YEAR } from "../../utils/date";
import { useGuestGuard } from "../../hooks/useGuestGuard";

interface AnnualGoalCardProps {
  goal: number;
  setGoal: (n: number) => void;
  read: number;
  onTrack: boolean;
  currentPerWeek: string;
  neededPerWeek: string;
}

export function AnnualGoalCard({
  goal,
  setGoal,
  read,
  onTrack,
  currentPerWeek,
  neededPerWeek,
}: AnnualGoalCardProps) {
  const guard = useGuestGuard();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(String(goal));

  function handleSave() {
    const n = parseInt(input, 10);
    if (!isNaN(n) && n > 0) setGoal(n);
    else setInput(String(goal));
    setEditing(false);
  }

  return (
    <section className="bg-sand-100 border border-sand-300 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-lg font-bold text-ink-900">Annual Reading Goal</h2>
        <span
          className={`text-xs font-sans font-medium px-2.5 py-1 rounded-full ${
            onTrack ? "bg-terra-50 text-terra-600" : "bg-sand-200 text-ink-500"
          }`}
        >
          {onTrack ? "On track 🎉" : "Behind pace ⚡️"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="shrink-0">
          <CircularProgress value={read} max={goal} />
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-sm font-sans text-ink-400">Goal:</span>
            {editing ? (
              <input
                autoFocus
                type="number"
                value={input}
                min={1}
                max={365}
                onChange={(e) => setInput(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }}
                className="w-16 font-serif text-xl font-bold text-ink-900 bg-transparent border-b-2 border-terra-500 focus:outline-none text-center"
              />
            ) : (
              <button
                onClick={() => { if (!guard('Sign up to set your reading goal')) return; setInput(String(goal)); setEditing(true); }}
                className="font-serif text-xl font-bold text-ink-900 border-b-2 border-dashed border-sand-300 hover:border-terra-300 transition-colors"
                title="Click to edit"
              >
                {goal}
              </button>
            )}
            <span className="text-sm font-sans text-ink-400">books in {CURRENT_YEAR}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sand-200 rounded-lg p-3">
              <p className="font-serif text-2xl font-bold text-ink-900 leading-tight">
                {currentPerWeek}
              </p>
              <p className="text-xs font-sans text-ink-400 mt-0.5">books/week now</p>
            </div>
            <div className="bg-sand-200 rounded-lg p-3">
              <p className={`font-serif text-2xl font-bold leading-tight ${onTrack ? "text-terra-500" : "text-ink-700"}`}>
                {neededPerWeek}
              </p>
              <p className="text-xs font-sans text-ink-400 mt-0.5">books/week needed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
