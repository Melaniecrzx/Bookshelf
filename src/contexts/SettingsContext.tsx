import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react';

export type Font        = 'inria' | 'inter' | 'mono';
export type Theme       = 'light' | 'dark' | 'oled' | 'system';
export type TextSize    = 'S' | 'M' | 'L' | 'XL';
export type AccentColor = 'copper' | 'teal' | 'plum' | 'slate' | 'forest';
export type LineHeight  = 'compact' | 'default' | 'relaxed' | 'spacious';

interface AccentPalette {
  main: string; shade: string; tint3: string; tint2: string; tint1: string; tint0: string;
}

export const accentMap: Record<AccentColor, AccentPalette> = {
  copper: { main: '#C1714F', shade: '#A85C3C', tint3: '#D48E6F', tint2: '#E5B49D', tint1: '#F5DDD2', tint0: '#FBF0EB' },
  teal:   { main: '#4CA6A8', shade: '#378D8F', tint3: '#78BFC0', tint2: '#A5D5D6', tint1: '#CEEBEC', tint0: '#E9F5F5' },
  plum:   { main: '#8B5EA6', shade: '#6F4589', tint3: '#A882BC', tint2: '#C4A8D2', tint1: '#E3D4EC', tint0: '#F3EEF8' },
  slate:  { main: '#6B7FA8', shade: '#536695', tint3: '#92A3C2', tint2: '#B5C1D7', tint1: '#D9E0EE', tint0: '#EDF0F7' },
  forest: { main: '#3D7A5A', shade: '#2A5F43', tint3: '#6C9E85', tint2: '#97BCAB', tint1: '#C6D9D0', tint0: '#E5EFEB' },
};

// Migration table from old accent names
const ACCENT_MIGRATION: Record<string, AccentColor> = {
  orange: 'copper',
  blue:   'teal',
  rose:   'plum',
  green:  'forest',
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Settings {
  font:            Font;
  theme:           Theme;
  textSize:        TextSize;
  accentColor:     AccentColor;
  lineHeight:      LineHeight;
  simplifiedShelf: boolean;
  highContrast:    boolean;
}

interface SettingsContextValue extends Settings {
  setFont:             (f: Font)        => void;
  setTheme:            (t: Theme)       => void;
  setTextSize:         (s: TextSize)    => void;
  setAccentColor:      (a: AccentColor) => void;
  setLineHeight:       (l: LineHeight)  => void;
  setSimplifiedShelf:  (v: boolean)     => void;
  setHighContrast:     (v: boolean)     => void;
  reset: () => void;
}

const defaults: Settings = {
  font:            'inria',
  theme:           'system',
  textSize:        'M',
  accentColor:     'copper',
  lineHeight:      'default',
  simplifiedShelf: false,
  highContrast:    false,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem('bookshelf-settings');
    if (raw) {
      const stored = JSON.parse(raw) as Partial<Settings> & { accentColor?: string };
      // Migrate old accent color names
      if (stored.accentColor && !(stored.accentColor in accentMap)) {
        stored.accentColor = ACCENT_MIGRATION[stored.accentColor] ?? defaults.accentColor;
      }
      return { ...defaults, ...stored };
    }
  } catch {}
  return defaults;
}

function resolveTheme(theme: Theme): 'light' | 'dark' | 'oled' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useLayoutEffect(() => {
    const el = document.documentElement;

    const apply = () => {
      const resolved = resolveTheme(settings.theme);
      el.setAttribute('data-theme', resolved);
      el.setAttribute('data-font', settings.font);
      el.setAttribute('data-size', settings.textSize);
      el.setAttribute('data-line', settings.lineHeight);

      if (settings.highContrast) {
        el.setAttribute('data-contrast', 'high');
      } else {
        el.removeAttribute('data-contrast');
      }

      const p = accentMap[settings.accentColor];
      const isDark = resolved === 'dark' || resolved === 'oled';
      el.style.setProperty('--color-terra-500', p.main);
      el.style.setProperty('--color-terra-600', p.shade);
      el.style.setProperty('--color-terra-300', p.tint3);
      el.style.setProperty('--color-terra-200', p.tint2);
      el.style.setProperty('--color-terra-100', isDark ? hexToRgba(p.main, 0.2)  : p.tint1);
      el.style.setProperty('--color-terra-50',  isDark ? hexToRgba(p.main, 0.12) : p.tint0);
    };

    apply();
    localStorage.setItem('bookshelf-settings', JSON.stringify(settings));

    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setFont:            (font)            => setSettings(s => ({ ...s, font })),
      setTheme:           (theme)           => setSettings(s => ({ ...s, theme })),
      setTextSize:        (textSize)        => setSettings(s => ({ ...s, textSize })),
      setAccentColor:     (accentColor)     => setSettings(s => ({ ...s, accentColor })),
      setLineHeight:      (lineHeight)      => setSettings(s => ({ ...s, lineHeight })),
      setSimplifiedShelf: (simplifiedShelf) => setSettings(s => ({ ...s, simplifiedShelf })),
      setHighContrast:    (highContrast)    => setSettings(s => ({ ...s, highContrast })),
      reset:              ()                => setSettings(defaults),
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
