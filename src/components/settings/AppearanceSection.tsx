import { Check } from "lucide-react";
import {
  useSettings,
  accentMap,
  type Theme,
  type AccentColor,
} from "../../contexts/SettingsContext";
import { ThemePreview } from "./ThemePreview";
import { SettingsSectionCard } from "./SettingsSectionCard";

const accents: { value: AccentColor; label: string }[] = [
  { value: "orange", label: "Orange" },
  { value: "blue",   label: "Blue"   },
  { value: "rose",   label: "Rose"   },
  { value: "green",  label: "Green"  },
];

export function AppearanceSection() {
  const { theme, accentColor, setTheme, setAccentColor } = useSettings();

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionCard title="Theme">
        <div className="flex gap-3">
          {(["light", "dark", "system"] as Theme[]).map((t) => (
            <ThemePreview key={t} value={t} selected={theme === t} onClick={() => setTheme(t)} />
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Accent color" subtitle="The highlight color used across the app.">
        <div className="flex gap-5">
          {accents.map((a) => {
            const color = accentMap[a.value].main;
            const active = accentColor === a.value;
            return (
              <button
                key={a.value}
                onClick={() => setAccentColor(a.value)}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{
                    background: color,
                    boxShadow: active
                      ? `0 0 0 2px var(--color-sand-100), 0 0 0 4px ${color}`
                      : "none",
                  }}
                >
                  {active && <Check size={15} strokeWidth={2.5} color="white" />}
                </span>
                <span className={`font-sans text-xs ${active ? "text-ink-900 font-medium" : "text-ink-400"}`}>
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsSectionCard>
    </div>
  );
}
