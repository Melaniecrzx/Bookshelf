import { useQuery } from '@tanstack/react-query';

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
  publisher: string;
}

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY as string;

function buildQuery(input: string): string {
  const cleaned = input.trim().replace(/-/g, '');
  if (/^\d{10}$/.test(cleaned) || /^\d{13}$/.test(cleaned)) {
    return `isbn:${cleaned}`;
  }
  return input.trim();
}

async function fetchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', buildQuery(query));
  url.searchParams.set('maxResults', '10');
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);

  const data = await res.json() as { items?: Record<string, unknown>[] };
  if (!data.items) return [];

  return data.items.map(item => {
    const info = (item.volumeInfo ?? {}) as Record<string, unknown>;
    const ids = (info.industryIdentifiers ?? []) as Array<{ type: string; identifier: string }>;
    const images = (info.imageLinks ?? {}) as Record<string, string>;

    return {
      googleId: item.id as string,
      title: (info.title as string) ?? 'Unknown title',
      authors: (info.authors as string[]) ?? [],
      coverUrl: images.thumbnail?.replace(/^http:/, 'https:') ?? null,
      isbn13: ids.find(x => x.type === 'ISBN_13')?.identifier ?? null,
      isbn10: ids.find(x => x.type === 'ISBN_10')?.identifier ?? null,
      pageCount: (info.pageCount as number) ?? null,
      publishedDate: (info.publishedDate as string) ?? '',
      genres: (info.categories as string[]) ?? [],
      description: (info.description as string) ?? null,
      publisher: (info.publisher as string) ?? '',
    };
  });
}

export function useGoogleBooks(query: string) {
  return useQuery({
    queryKey: ['google-books', query],
    queryFn: () => fetchGoogleBooks(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}
