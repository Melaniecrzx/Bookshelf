import { NavLink } from "react-router-dom";
import { Search, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BookshelfLogo } from "@/components/ui/BookshelfLogo";

interface NavLink { to: string; label: string; icon: LucideIcon; end: boolean }
interface Counts { reading: number; read: number; toRead: number }

interface NavDesktopProps {
  links: NavLink[];
  counts: Counts;
  query: string;
  onQueryChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function NavDesktop({ links, query, onQueryChange, onKeyDown }: NavDesktopProps) {
  const { signOut } = useAuth();

  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 bg-sand-100 border-b border-sand-300 z-20">
      <div className="px-6 py-3.5 border-b border-sand-200 flex items-center">
        <div className="flex items-center gap-2.5 flex-1">
          <BookshelfLogo size={28} />
          <span className="font-serif text-xl font-bold text-ink-900 tracking-tight">
            Bookshelf
          </span>
        </div>
        <div className="relative w-[480px]">
          <Search
            size={13}
            strokeWidth={1.75}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search books… (press Enter)"
            className="w-full pl-8 pr-3 py-2 bg-white border border-sand-300 rounded-lg text-sm font-sans text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-terra-300 transition-colors"
          />
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-medium text-ink-500 hover:bg-sand-200 hover:text-ink-900 transition-colors"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </div>
      <nav className="flex items-center gap-0.5 px-3 py-2">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans font-medium transition-colors ${
                isActive
                  ? "bg-terra-100 text-terra-600"
                  : "text-ink-700 hover:bg-sand-200 hover:text-ink-900"
              }`
            }
          >
            <Icon size={15} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
