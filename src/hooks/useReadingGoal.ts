import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import { useAuth } from "@/contexts/AuthContext";

export function useReadingGoal() {
  const { session } = useAuth();
  const { data: goal } = useQuery<number>({
    queryKey: ["target_books"],
    enabled: !!session?.user.id,
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .from("goals")
        .select("target_books")
        .eq("user_id", session?.user.id)
        .eq("year", new Date().getFullYear())
        .maybeSingle();

      console.log(
        "goals data",
        data,
        "error",
        error,
        "year",
        new Date().getFullYear(),
      );
      if (error) throw error;
      return data?.target_books ?? 24;
    },
  });
  return goal ?? 24;
}

export const useUpdateGoal = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (target_books: number) => {
      const { error } = await supabase.from("goals").upsert(
        {
          user_id: session?.user.id,
          year: new Date().getFullYear(),
          target_books: target_books,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,year" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["target_books"] });
    },
  });
};
