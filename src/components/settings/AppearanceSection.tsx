import { Check } from "lucide-react";
import {
  useSettings,
  accentMap,
  type Theme,
  type AccentColor,
  type Font,
  type TextSize,
  type LineHeight,
} from "../../contexts/SettingsContext";
import { ThemePreview } from "./ThemePreview";
import { SettingsSectionCard } from "./SettingsSectionCard";
import { FontCard } from "./FontCard";

/* ── Data ──────────────────────────────────────────────── */

const accents: { value: AccentColor; label: string }[] = [
  { value: "copper", label: "Copper" },
  { value: "teal",   label: "Teal"   },
  { value: "plum",   label: "Plum"   },
  { value: "slate",  label: "Slate"  },
  { value: "forest", label: "Forest" },
];

const fontConfig: { value: Font; fontClass: string; label: string; description: string }[] = [
  { value: "inria", fontClass: "font-serif", label: "Default",    description: "Inria Serif headings + Inter body" },
  { value: "inter", fontClass: "font-sans",  label: "Sans-serif", description: "Inter everywhere"                 },
  { value: "mono",  fontClass: "font-mono",  label: "Mono",       description: "Monospace everywhere"            },
];

const textSizes: { value: TextSize; label: string }[] = [
  { value: "S",  label: "Small"       },
  { value: "M",  label: "Default"     },
  { value: "L",  label: "Large"       },
  { value: "XL", label: "Extra Large" },
];

const lineHeights: { value: LineHeight; label: string }[] = [
  { value: "compact",  label: "Compact"  },
  { value: "default",  label: "Default"  },
  { value: "relaxed",  label: "Relaxed"  },
  { value: "spacious", label: "Spacious" },
];

/* ── Toggle switch ─────────────────────────────────────── */

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terra-500 focus-visible:ring-offset-2 ${
        checked ? "bg-terra-500" : "bg-sand-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ── Pill button group ─────────────────────────────────── */

function PillGroup<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="font-sans text-xs font-medium text-ink-500 mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={`px-4 py-1.5 rounded-lg border font-sans text-sm transition-all ${
              value === item.value
                ? "border-terra-500 bg-terra-500 text-white font-medium"
                : "border-sand-300 text-ink-700 hover:border-sand-400 hover:bg-sand-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────── */

export function AppearanceSection() {
  const {
    theme,
    accentColor,
    font,
    textSize,
    lineHeight,
    simplifiedShelf,
    highContrast,
    setTheme,
    setAccentColor,
    setFont,
    setTextSize,
    setLineHeight,
    setSimplifiedShelf,
    setHighContrast,
  } = useSettings();

  return (
    <div className="flex flex-col gap-4">

      {/* Theme */}
      <SettingsSectionCard title="Theme">
        <div className="grid grid-cols-4 gap-3">
          {(["system", "light", "dark", "oled"] as Theme[]).map((t) => (
            <ThemePreview
              key={t}
              value={t}
              selected={theme === t}
              onClick={() => setTheme(t)}
            />
          ))}
        </div>
      </SettingsSectionCard>

      {/* Accent color */}
      <SettingsSectionCard
        title="Accent color"
        subtitle="Choose the highlight color used for buttons, links, and focus states."
      >
        <div className="flex gap-5 flex-wrap">
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
                <span
                  className={`font-sans text-xs ${
                    active ? "text-ink-900 font-medium" : "text-ink-400"
                  }`}
                >
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsSectionCard>

      {/* Font */}
      <SettingsSectionCard
        title="Font"
        subtitle="Change the typeface used across the app."
      >
        <div className="grid grid-cols-3 gap-3">
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

      {/* Accessibility */}
      <SettingsSectionCard title="Accessibility">
        <div className="flex flex-col gap-5">

          <PillGroup
            label="Font size"
            items={textSizes}
            value={textSize}
            onChange={setTextSize}
          />

          <PillGroup
            label="Line height"
            items={lineHeights}
            value={lineHeight}
            onChange={setLineHeight}
          />

          <div className="border-t border-sand-300" />

          {/* Simplified shelf view */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="font-sans text-sm font-medium text-ink-900">
                Simplified shelf view
              </p>
              <p className="font-sans text-xs text-ink-400 mt-0.5">
                Disables 3D book animations for a cleaner, flatter layout.
              </p>
            </div>
            <ToggleSwitch checked={simplifiedShelf} onChange={setSimplifiedShelf} />
          </div>

          {/* High contrast */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="font-sans text-sm font-medium text-ink-900">
                High contrast
              </p>
              <p className="font-sans text-xs text-ink-400 mt-0.5">
                Increases border and text contrast for improved visibility.
              </p>
            </div>
            <ToggleSwitch checked={highContrast} onChange={setHighContrast} />
          </div>

        </div>
      </SettingsSectionCard>

    </div>
  );
}
