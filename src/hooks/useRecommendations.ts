import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/supabase-client"
import { useBooks } from "./useBooks"

export type Recommendation = { title: string; author: string; reason: string }

const STORAGE_KEY = "bookshelf-recommendations"

function loadCache(): Recommendation[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Recommendation[]) : null
  } catch {
    return null
  }
}

function saveCache(data: Recommendation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function clearCache(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function useRecommendations() {
  const { books } = useBooks()
  const booksRead = books.filter((b) => b.status === "read" && b.rating)

  const [cached, setCached] = useState<Recommendation[] | null>(loadCache)

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "book-recommendations",
        { body: { books: booksRead } },
      )
      if (error) throw error
      return data as Recommendation[]
    },
    onSuccess: (data) => {
      setCached(data)
      saveCache(data)
    },
  })

  /** Génère pour la première fois (cache vide). */
  function generate() {
    mutation.mutate()
  }

  /** Efface le cache et relance un appel IA. */
  function refresh() {
    clearCache()
    setCached(null)
    mutation.reset()
    mutation.mutate()
  }

  return {
    /** Résultats à afficher : données fraîches ou cache localStorage. */
    recommendations: mutation.data ?? cached,
    isPending: mutation.isPending,
    isError: mutation.isError,
    generate,
    refresh,
  }
}
