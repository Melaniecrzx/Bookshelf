import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import { useAuth } from "@/contexts/AuthContext";

export function useReadingProgress(bookId: string) {
  const { session } = useAuth();
  const { data: pages_read } = useQuery<number>({
    queryKey: ["pages_read", bookId],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("pages_read")
        .eq("user_id", session?.user.id)
        .eq("book_id", bookId)
        .maybeSingle();

      if (error) throw error;
      return data?.pages_read ?? 0;
    },
  });
  return pages_read;
}

export const useUpdateReadingProgress = (bookId: string) => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pagesRead: number) => {
      const { error } = await supabase.from("reading_progress").upsert(
        {
          user_id: session?.user.id,
          book_id: bookId,
          pages_read: pagesRead,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages_read", bookId] });
    },
  });
};
