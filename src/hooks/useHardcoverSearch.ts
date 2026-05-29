import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
// Re-export du type pour que les consommateurs n'aient pas à changer leur import
export type { GoogleBookResult } from "./useGoogleBooks";
import type { GoogleBookResult } from "./useGoogleBooks";

// ── Types internes Hardcover ──────────────────────────────────────────────────

interface HardcoverImage {
  url: string;
}

interface HardcoverDocument {
  id: number;
  title: string;
  author_names: string[];
  image?: HardcoverImage | null;
  isbns?: string[];
  pages?: number | null;
  release_date?: string;
  genres?: string[];
  description?: string | null;
}

interface HardcoverResults {
  hits: Array<{ document: HardcoverDocument }>;
  found: number;
}

// ── Mapping ───────────────────────────────────────────────────────────────────

function mapDocument(doc: HardcoverDocument): GoogleBookResult {
  const isbns = doc.isbns ?? [];
  // L'array contient un mix ISBN-10 (10 chars) et ISBN-13 (13 chars)
  const isbn13 = isbns.find((s) => s.length === 13) ?? null;
  const isbn10 = isbns.find((s) => s.length === 10) ?? null;

  return {
    googleId: String(doc.id),
    title: doc.title ?? "Unknown title",
    authors: doc.author_names ?? [],
    coverUrl: doc.image?.url ?? null,
    isbn13,
    isbn10,
    pageCount: doc.pages ?? null,
    publishedDate: doc.release_date ?? "",
    genres: doc.genres ?? [],
    description: doc.description ?? null,
    publisher: "",
  };
}

// ── Fetcher ───────────────────────────────────────────────────────────────────

async function fetchHardcover(query: string): Promise<GoogleBookResult[]> {
  const { data, error } = await supabase.functions.invoke("hardcover-search", {
    body: { query },
  });
  if (error) throw error;

  const results = data as HardcoverResults;
  if (!results?.hits) return [];

  return results.hits.map((hit) => mapDocument(hit.document));
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useHardcoverSearch(query: string) {
  return useQuery({
    queryKey: ["hardcover-search", query],
    queryFn: () => fetchHardcover(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}
