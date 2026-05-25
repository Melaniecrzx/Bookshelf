import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import type { Book } from "../types/book";

export function useDiscoverBooks() {
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["discover_books"],
    queryFn: async () => {
      const { data, error } = await supabase.from("discover_books").select("*");
      if (error) throw error;
      return data;
    },
  });
  return { books, isLoading };
}
