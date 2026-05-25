import { useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";

export function DangerSection() {
  const { reset } = useSettings();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="bg-sand-100 border border-red-200 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-sm font-semibold text-ink-900">Reset all settings</p>
          <p className="font-sans text-xs text-ink-400 mt-1">
            Restore theme, font, text size and accent color to their default values.
          </p>
        </div>
        {confirm ? (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { reset(); setConfirm(false); }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-sans font-medium hover:bg-red-600 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirm(false)}
              className="px-4 py-2 rounded-lg border border-sand-300 text-sm font-sans text-ink-700 hover:bg-sand-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirm(true)}
            className="shrink-0 px-4 py-2 rounded-lg border border-red-300 text-sm font-sans text-red-500 hover:bg-red-50 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
