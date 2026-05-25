import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, LogOut, MoreHorizontal, ChevronRight, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavLinkItem { to: string; label: string; icon: LucideIcon; end: boolean }
interface Counts { reading: number; read: number; toRead: number }

interface NavMobileProps {
  leftLinks: NavLinkItem[];
  rightLinks: NavLinkItem[];
  counts: Counts;
  isOnSearch: boolean;
}

type MoreItem =
  | { type: "link"; to: string; label: string; icon: LucideIcon; end: boolean }
  | { type: "action"; label: string; icon: LucideIcon; onClick: () => void }

export function NavMobile({ leftLinks, rightLinks, isOnSearch }: NavMobileProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const leftVisible = leftLinks.slice(0, 2);
  const leftOverflow = leftLinks.slice(2);
  const rightVisible = rightLinks.slice(0, 1);
  const rightOverflow = rightLinks.slice(1);

  const moreItems: MoreItem[] = [
    ...leftOverflow.map(l => ({ type: "link" as const, ...l })),
    ...rightOverflow.map(l => ({ type: "link" as const, ...l })),
    { type: "action", label: "Sign out", icon: LogOut, onClick: signOut },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sand-100 border-t border-sand-300 z-20 safe-area-pb flex items-stretch">
        <div className="flex-1 flex justify-around items-center py-2.5">
          {leftVisible.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 text-[10px] font-sans font-medium transition-colors ${
                  isActive ? "text-terra-500" : "text-ink-400"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-col items-center justify-start px-3 -mt-5">
          <button
            onClick={() => navigate("/search")}
            className={`w-14 h-14 rounded-full shadow-lg ring-4 ring-sand-100 flex items-center justify-center transition-colors ${
              isOnSearch ? "bg-terra-600" : "bg-terra-500"
            }`}
          >
            <Search size={22} strokeWidth={1.75} className="text-white" />
          </button>
        </div>

        <div className="flex-1 flex justify-around items-center py-2.5">
          {rightVisible.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 text-[10px] font-sans font-medium transition-colors ${
                  isActive ? "text-terra-500" : "text-ink-400"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-1 px-3 text-[10px] font-sans font-medium text-ink-400 transition-colors"
          >
            <MoreHorizontal size={20} strokeWidth={1.75} />
            More
          </button>
        </div>
      </nav>

      {moreOpen && (
        <>
          <div
            className="fixed inset-0 bg-ink-900/40 z-30"
            onClick={() => setMoreOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-sand-100 rounded-t-2xl z-40">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <span className="font-sans text-xs font-medium text-ink-400 uppercase tracking-wider">More</span>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 text-ink-400 hover:text-ink-700 transition-colors"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <div className="border-t border-sand-200">
              {moreItems.map((item, i) =>
                item.type === "link" ? (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-5 py-4 border-b border-sand-200 last:border-0 transition-colors ${
                        isActive ? "text-terra-500" : "text-ink-700"
                      }`
                    }
                  >
                    <item.icon size={20} strokeWidth={1.75} />
                    <span className="flex-1 font-sans text-sm font-medium">{item.label}</span>
                    <ChevronRight size={16} strokeWidth={1.75} className="text-ink-300" />
                  </NavLink>
                ) : (
                  <button
                    key={i}
                    onClick={() => { item.onClick(); setMoreOpen(false); }}
                    className="w-full flex items-center gap-4 px-5 py-4 border-b border-sand-200 last:border-0 text-ink-700 transition-colors"
                  >
                    <item.icon size={20} strokeWidth={1.75} />
                    <span className="flex-1 font-sans text-sm font-medium text-left">{item.label}</span>
                    <ChevronRight size={16} strokeWidth={1.75} className="text-ink-300" />
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
