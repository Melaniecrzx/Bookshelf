import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";

export interface GoogleBookResult {
  googleId: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  isbn13: string | null;
  isbn10: string | null;
  pageCount: number | null;
  publishedDate: string;
  genres: string[];
  description: string | null;
  publisher: string | null;
  series: string | null;
  seriesId: number | null;
  seriesSlug: string | null;
  seriesPosition: number | null;
}

// ── Types internes Hardcover ──────────────────────────────────────────────────

interface HardcoverFeaturedSeries {
  position?: number | null;
  series?: { id?: number; name?: string; slug?: string };
}

interface HardcoverDocument {
  id: number;
  title: string;
  author_names: string[];
  image?: { url: string } | null;
  isbns?: string[];
  pages?: number | null;
  release_year?: number | null;
  genres?: string[];
  description?: string | null;
  featured_series?: HardcoverFeaturedSeries | null;
}

interface HardcoverResults {
  hits: Array<{ document: HardcoverDocument }>;
  found: number;
}

// ── Mapping ───────────────────────────────────────────────────────────────────

function mapDocument(doc: HardcoverDocument): GoogleBookResult {
  return {
    googleId: String(doc.id),
    title: doc.title,
    authors: doc.author_names,
    coverUrl: doc.image?.url ?? null,
    isbn13: doc.isbns?.[0] ?? null,
    isbn10: null,
    pageCount: doc.pages ?? null,
    publishedDate: doc.release_year?.toString() ?? "",
    genres: doc.genres ?? [],
    description: doc.description ?? null,
    publisher: null,
    series: doc.featured_series?.series?.name ?? null,
    seriesId: doc.featured_series?.series?.id ?? null,
    seriesSlug: doc.featured_series?.series?.slug ?? null,
    seriesPosition: doc.featured_series?.position ?? null,
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
