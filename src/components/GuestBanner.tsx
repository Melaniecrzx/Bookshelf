import { useNavigate } from "react-router-dom";

export function GuestBanner() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 md:top-auto md:bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-3 px-4 py-2 md:px-8 md:py-3.5 bg-ink-900 border-l-4 border-terra-500">
      <p className="font-sans text-[11px] md:text-sm text-sand-200 leading-snug">
        You're browsing as a guest — your data won't be saved.
      </p>
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        <button
          onClick={() => navigate("/signup")}
          className="px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-lg bg-terra-500 hover:bg-terra-600 font-sans text-[10px] md:text-xs font-semibold text-white transition-colors"
        >
          Create account
        </button>
        <button
          onClick={() => navigate("/signin")}
          className="px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-lg border border-terra-500 font-sans text-[10px] md:text-xs font-semibold text-terra-500 hover:bg-terra-500/10 transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
