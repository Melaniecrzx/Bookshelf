import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";

export interface SeriesBook {
  position: number;
  title: string;
  coverUrl: string | null;
}

interface RawBookSeries {
  position: number | null;
  book: {
    title: string;
    image?: { url: string } | null;
  };
}

interface SeriesResponse {
  name: string;
  book_series: RawBookSeries[];
}

async function fetchSeriesBooks(seriesId: number): Promise<SeriesBook[]> {
  const { data, error } = await supabase.functions.invoke("hardcover-series", {
    body: { seriesId },
  });
  if (error) throw error;

  const result = data as SeriesResponse;
  if (!result?.book_series) return [];

  // Déduplique par position (plusieurs éditions/langues partagent la même) ;
  // garde la première occurrence, trie par position croissante.
  const seen = new Set<number>();
  const books: SeriesBook[] = [];

  for (const item of result.book_series) {
    const pos = item.position;
    if (pos == null || seen.has(pos)) continue;
    seen.add(pos);
    books.push({
      position: pos,
      title: item.book.title,
      coverUrl: item.book.image?.url ?? null,
    });
  }

  return books.sort((a, b) => a.position - b.position);
}

export function useSeriesBooks(seriesId: number | null) {
  return useQuery({
    queryKey: ["series-books", seriesId],
    queryFn: () => fetchSeriesBooks(seriesId!),
    enabled: seriesId != null,
    staleTime: 1000 * 60 * 30,
  });
}