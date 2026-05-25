import { useSettings, type Font, type TextSize } from "../../contexts/SettingsContext";
import { FontCard } from "./FontCard";
import { SettingsSectionCard } from "./SettingsSectionCard";

const fontConfig: { value: Font; fontClass: string; label: string; description: string }[] = [
  { value: "inria", fontClass: "font-serif", label: "Serif",  description: "Inria Serif headings" },
  { value: "inter", fontClass: "font-sans",  label: "Sans",   description: "Inter everywhere"     },
  { value: "mono",  fontClass: "font-mono",  label: "Mono",   description: "Monospace everywhere" },
];

const sizes: { value: TextSize; label: string }[] = [
  { value: "S", label: "Small"  },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large"  },
];

export function ReadingSection() {
  const { font, textSize, setFont, setTextSize } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionCard title="Font" subtitle="The typeface used across the app.">
        <div className="flex gap-3">
          {fontConfig.map((f) => (
            <FontCard
              key={f.value}
              {...f}
              selected={font === f.value}
              onClick={() => setFont(f.value)}
            />
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Text size">
        <div className="flex gap-2">
          {sizes.map((s) => (
            <button
              key={s.value}
              onClick={() => setTextSize(s.value)}
              className={`flex-1 py-2 rounded-lg border font-sans text-sm transition-all ${
                textSize === s.value
                  ? "border-terra-500 bg-terra-50 text-terra-600 font-medium"
                  : "border-sand-300 text-ink-700 hover:border-sand-400 hover:bg-sand-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </SettingsSectionCard>
    </div>
  );
}
