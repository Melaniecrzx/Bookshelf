import type { Theme } from "../../contexts/SettingsContext";

const themeConfig: Record<
  Theme,
  { label: string; bg: string; header: string; line1: string; line2: string; accent: string }
> = {
  light:  { label: "Light",  bg: "#FDFAF6", header: "#EFE6D8", line1: "#D4C4AF", line2: "#C0AFA6", accent: "#E8825A" },
  dark:   { label: "Dark",   bg: "#1C1C1E", header: "#2C2C2E", line1: "#48484A", line2: "#3A3A3C", accent: "#E8825A" },
  system: { label: "System", bg: "#FDFAF6", header: "#EFE6D8", line1: "#D4C4AF", line2: "#C0AFA6", accent: "#E8825A" },
};

interface ThemePreviewProps {
  value: Theme;
  selected: boolean;
  onClick: () => void;
}

export function ThemePreview({ value, selected, onClick }: ThemePreviewProps) {
  const c = themeConfig[value];
  const isSystem = value === "system";
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col rounded-xl overflow-hidden border-2 transition-all ${
        selected ? "border-terra-500" : "border-sand-300 hover:border-sand-400"
      }`}
    >
      <div className="relative h-20 p-2.5 overflow-hidden" style={{ background: c.bg }}>
        {isSystem && <div className="absolute inset-0 right-0 left-1/2" style={{ background: "#1C1C1E" }} />}
        <div className="relative flex flex-col gap-1.5">
          <div className="h-1.5 w-1/2 rounded-sm" style={{ background: isSystem ? "linear-gradient(90deg,#D4C4AF 50%,#48484A 50%)" : c.header }} />
          <div className="h-1 w-full rounded-sm"   style={{ background: isSystem ? "linear-gradient(90deg,#EFE6D8 50%,#2C2C2E 50%)" : c.header }} />
          <div className="h-[3px] w-2/3 rounded-sm mt-1" style={{ background: isSystem ? "linear-gradient(90deg,#C0AFA6 50%,#3A3A3C 50%)" : c.line1 }} />
          <div className="h-[3px] w-3/4 rounded-sm"      style={{ background: isSystem ? "linear-gradient(90deg,#D4C4AF 50%,#48484A 50%)" : c.line2 }} />
          <div className="h-[3px] w-1/3 rounded-sm"      style={{ background: c.accent }} />
        </div>
      </div>
      <div
        className={`py-2 text-center font-sans text-xs transition-colors ${selected ? "text-terra-600 font-medium" : "text-ink-500"}`}
        style={{ background: isSystem ? "linear-gradient(90deg,#EFE6D8 50%,#2C2C2E 50%)" : c.header }}
      >
        {c.label}
      </div>
    </button>
  );
}
