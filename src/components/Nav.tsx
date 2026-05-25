import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Library, BarChart2, Target, Settings, Compass } from "lucide-react";
import { NavDesktop } from "./nav/NavDesktop";
import { NavMobile } from "./nav/NavMobile";

interface NavProps {
  counts: { reading: number; read: number; toRead: number };
}

const leftLinks = [
  { to: "/library", label: "Library", icon: Library, end: false },
  { to: "/discover", label: "Discover", icon: Compass, end: false },
  { to: "/goals", label: "Goals", icon: Target, end: false },
];

const rightLinks = [
  { to: "/stats", label: "Stats", icon: BarChart2, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

const allLinks = [...leftLinks, ...rightLinks];

export function Nav({ counts }: NavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const qParam =
    location.pathname === "/search" ? (searchParams.get("q") ?? "") : "";
  const [query, setQuery] = useState(qParam);

  useEffect(() => {
    setQuery(
      location.pathname === "/search" ? (searchParams.get("q") ?? "") : "",
    );
  }, [location.pathname, qParam]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <>
      <NavDesktop
        links={allLinks}
        counts={counts}
        query={query}
        onQueryChange={setQuery}
        onKeyDown={handleKeyDown}
      />
      <NavMobile
        leftLinks={leftLinks}
        rightLinks={rightLinks}
        counts={counts}
        isOnSearch={location.pathname === "/search"}
      />
    </>
  );
}
