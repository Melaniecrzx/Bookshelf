import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { SettingsProvider } from "./contexts/SettingsContext";
import { useAuth } from "./contexts/AuthContext";
import { useBooks } from "./hooks/useBooks";
import { Nav } from "./components/Nav";
import { DashboardPage } from "./pages/DashboardPage";
import { ShelfPage } from "./pages/ShelfPage";
import { StatsPage } from "./pages/StatsPage";
import { AppearancePage } from "./pages/SettingsPage";
import { SearchPage } from "./pages/SearchPage";
import { GoalsPage } from "./pages/GoalsPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { GuestBanner } from "./components/GuestBanner";
import { ToastProvider } from "./contexts/ToastContext";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const { loading, session } = useAuth();
  const { counts } = useBooks();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/signup" || pathname === "/signin";
  const isGuest = !session && !isAuthPage;

  if (loading) return <div className="min-h-screen bg-[#FDFAF6]" />;

  return (
    <>
      {!isAuthPage && <Nav counts={counts} />}
      <main
        className={
          !isAuthPage
            ? `md:pt-[104px] pb-20 md:pb-0 min-h-screen${isGuest ? " pt-10" : ""}`
            : ""
        }
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/library" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/library" element={<DashboardPage />} />
          <Route path="/library/shelf/:shelfId" element={<ShelfPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/settings" element={<AppearancePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
      {isGuest && <GuestBanner />}
    </>
  );
}

export function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <ToastProvider>
          <div className="min-h-screen bg-sand-50">
            <Layout />
          </div>
        </ToastProvider>
      </BrowserRouter>
    </SettingsProvider>
  );
}
