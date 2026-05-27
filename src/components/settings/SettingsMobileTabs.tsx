import type { SectionId } from "./SettingsSidebar";

const items: { id: SectionId; label: string; danger?: boolean }[] = [
  { id: "appearance",    label: "Appearance" },
  { id: "account",       label: "Account" },
  { id: "reading",       label: "Reading" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy",       label: "Privacy" },
  { id: "data",          label: "Data" },
  { id: "danger",        label: "Danger Zone", danger: true },
];

interface SettingsMobileTabsProps {
  active: SectionId;
  onChange: (s: SectionId) => void;
}

export function SettingsMobileTabs({ active, onChange }: SettingsMobileTabsProps) {
  return (
    <div className="md:hidden flex gap-1 mb-6 overflow-x-auto scrollbar-hide">
      {items.map(({ id, label, danger }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-sans font-medium transition-colors ${
            active === id
              ? danger
                ? "bg-red-100 text-red-600"
                : "bg-terra-100 text-terra-600"
              : danger
              ? "text-red-500 hover:bg-red-50"
              : "text-ink-500 hover:bg-sand-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
