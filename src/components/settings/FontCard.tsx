import type { Font } from "../../contexts/SettingsContext";

interface FontCardProps {
  value: Font;
  fontClass: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function FontCard({
  fontClass,
  label,
  description,
  selected,
  onClick,
}: FontCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? "border-terra-500 bg-terra-50"
          : "border-sand-300 hover:border-sand-400 hover:bg-sand-100"
      }`}
    >
      <span className={`${fontClass} text-3xl font-bold text-ink-900 leading-none`}>
        Aa
      </span>
      <div>
        <p className={`font-sans text-sm font-semibold ${selected ? "text-terra-600" : "text-ink-900"}`}>
          {label}
        </p>
        <p className="font-sans text-[11px] text-ink-400 mt-0.5">{description}</p>
      </div>
    </button>
  );
}
