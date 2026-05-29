import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/supabase-client"
import { useBooks } from "./useBooks"

export function useRecommendations() {
  const { books } = useBooks()
  
  const booksRead = books.filter(b => b.status === "read" && b.rating)

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "book-recommendations",
        { body: { books: booksRead } }
      )
      if (error) throw error
      return data as { title: string; author: string; reason: string }[]
    }
  })
}