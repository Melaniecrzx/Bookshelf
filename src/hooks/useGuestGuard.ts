import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export function useGuestGuard() {
  const { session } = useAuth();
  const { showToast } = useToast();

  return function guard(message: string): boolean {
    if (!session) {
      showToast(message);
      return false;
    }
    return true;
  };
}
