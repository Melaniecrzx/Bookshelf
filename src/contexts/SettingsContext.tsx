import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react';

export type Font        = 'inria' | 'inter' | 'mono';
export type Theme       = 'light' | 'dark' | 'system';
export type TextSize    = 'S' | 'M' | 'L';
export type AccentColor = 'orange' | 'blue' | 'rose' | 'green';

interface AccentPalette {
  main: string; shade: string; tint3: string; tint2: string; tint1: string; tint0: string;
}

export const accentMap: Record<AccentColor, AccentPalette> = {
  orange: { main: '#E8825A', shade: '#CF6642', tint3: '#EFA082', tint2: '#F5C5AC', tint1: '#FCEADF', tint0: '#FEF4EF' },
  blue:   { main: '#6B9FD4', shade: '#4F86C0', tint3: '#94BCE0', tint2: '#BDD5EC', tint1: '#DEEAF5', tint0: '#EFF5FB' },
  rose:   { main: '#D4788A', shade: '#BA5A6C', tint3: '#E09BAA', tint2: '#EBBEC7', tint1: '#F5DADE', tint0: '#FBF0F2' },
  green:  { main: '#7BAF8E', shade: '#5E9374', tint3: '#9CC4AE', tint2: '#BDD9C9', tint1: '#DCEEE4', tint0: '#EEF7F1' },
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Settings {
  font: Font;
  theme: Theme;
  textSize: TextSize;
  accentColor: AccentColor;
}

interface SettingsContextValue extends Settings {
  setFont: (f: Font) => void;
  setTheme: (t: Theme) => void;
  setTextSize: (s: TextSize) => void;
  setAccentColor: (a: AccentColor) => void;
  reset: () => void;
}

const defaults: Settings = { font: 'inria', theme: 'system', textSize: 'M', accentColor: 'orange' };

function load(): Settings {
  try {
    const raw = localStorage.getItem('bookshelf-settings');
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return defaults;
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
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

      const p = accentMap[settings.accentColor];
      el.style.setProperty('--color-terra-500', p.main);
      el.style.setProperty('--color-terra-600', p.shade);
      el.style.setProperty('--color-terra-300', p.tint3);
      el.style.setProperty('--color-terra-200', p.tint2);
      el.style.setProperty('--color-terra-100', resolved === 'dark' ? hexToRgba(p.main, 0.2)  : p.tint1);
      el.style.setProperty('--color-terra-50',  resolved === 'dark' ? hexToRgba(p.main, 0.12) : p.tint0);
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
      setFont:        (font)        => setSettings(s => ({ ...s, font })),
      setTheme:       (theme)       => setSettings(s => ({ ...s, theme })),
      setTextSize:    (textSize)    => setSettings(s => ({ ...s, textSize })),
      setAccentColor: (accentColor) => setSettings(s => ({ ...s, accentColor })),
      reset:          ()            => setSettings(defaults),
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
