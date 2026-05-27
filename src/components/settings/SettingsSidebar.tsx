import {
  AlertTriangle,
  Paintbrush2,
  BookOpen,
  UserCircle2,
  Bell,
  ShieldCheck,
  Database,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SectionId =
  | "appearance"
  | "account"
  | "reading"
  | "notifications"
  | "privacy"
  | "data"
  | "danger";

const mainItems: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: "appearance",    label: "Appearance",       icon: Paintbrush2  },
  { id: "account",       label: "Account",          icon: UserCircle2  },
  { id: "reading",       label: "Reading",          icon: BookOpen     },
  { id: "notifications", label: "Notifications",    icon: Bell         },
  { id: "privacy",       label: "Privacy & Sharing",icon: ShieldCheck  },
  { id: "data",          label: "Data",             icon: Database     },
];

interface SettingsSidebarProps {
  active: SectionId;
  onChange: (s: SectionId) => void;
}

export function SettingsSidebar({ active, onChange }: SettingsSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0">
      <nav className="flex flex-col gap-0.5">
        {mainItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium text-left transition-colors ${
              active === id
                ? "bg-terra-100 text-terra-600"
                : "text-ink-700 hover:bg-sand-200 hover:text-ink-900"
            }`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-sand-300 mt-6 pt-3">
        <button
          onClick={() => onChange("danger")}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans font-medium text-left w-full transition-colors ${
            active === "danger"
              ? "bg-red-50 text-red-600"
              : "text-red-500 hover:bg-red-50"
          }`}
        >
          <AlertTriangle size={16} strokeWidth={1.75} />
          Danger Zone
        </button>
      </div>
    </aside>
  );
}
