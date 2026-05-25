export type ReadingStatus = "reading" | "read" | "to-read";

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  cover_url: string | null;
  pages: number | null;
  published_year: number | null;
  genres: string[];
  description: string | null;
  status: ReadingStatus;
  rating?: number | null;
  avg_rating?: number | null;
  notes?: string | null;
  shelf_id?: string | null;
  user_book_id?: string;
  date_finished?: string | null;
}
export interface BookFilters {
  search: string;
  genres: string[];
}
