import type { GoogleBookResult } from "../hooks/useHardcoverSearch";
import type { Book } from "../types/book";

export function toBook(result: GoogleBookResult): Book {
  return {
    id: result.googleId,
    title: result.title,
    author: result.authors[0] ?? "Unknown author",
    isbn: result.isbn13 ?? result.isbn10,
    cover_url: result.coverUrl,
    pages: result.pageCount,
    published_year: result.publishedDate
      ? parseInt(result.publishedDate.slice(0, 4))
      : null,
    genres: result.genres,
    description: result.description,
    status: "to-read",
  };
}
