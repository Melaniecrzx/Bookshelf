import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

function GuestToast({ message }: { message: string }) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-[72px] md:top-[116px] right-4 md:right-8 z-50 flex items-center gap-4 pl-4 pr-3 py-3 bg-ink-900 border-l-4 border-terra-500 rounded-lg shadow-xl max-w-sm animate-[fadeSlideIn_0.2s_ease-out]">
      <p className="font-sans text-sm text-sand-50 leading-snug flex-1">{message}</p>
      <button
        onClick={() => navigate("/signup")}
        className="shrink-0 px-3 py-1.5 rounded-md bg-terra-500 hover:bg-terra-600 font-sans text-xs font-semibold text-white transition-colors"
      >
        Sign up
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = setTimeout(() => setMessage(null), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <GuestToast message={message} />}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
