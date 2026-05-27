import { useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import type { Book, ReadingStatus } from "../types/book";
import { useAuth } from "@/contexts/AuthContext";
import { sampleBooks } from "@/mocks/sample-books";

const GUEST_KEY = "bookshelf-guest-books";
const GUEST_VERSION_KEY = "bookshelf-guest-version";
const GUEST_VERSION = "v2"; // bump to reset guest localStorage with fresh mock data

export interface Shelf {
  id: string;
  name: string;
  type: "default" | "custom";
}

const GUEST_SHELVES: Shelf[] = [
  { id: "guest-shelf-want", name: "Want to Read", type: "default" },
  { id: "guest-shelf-reading", name: "Currently Reading", type: "default" },
  { id: "guest-shelf-read", name: "Read", type: "default" },
];

function statusToGuestShelfId(status: ReadingStatus): string {
  if (status === "reading") return "guest-shelf-reading";
  if (status === "read") return "guest-shelf-read";
  return "guest-shelf-want";
}

function loadGuestBooks(): Book[] {
  try {
    const version = localStorage.getItem(GUEST_VERSION_KEY);
    if (version === GUEST_VERSION) {
      const raw = localStorage.getItem(GUEST_KEY);
      if (raw) return JSON.parse(raw) as Book[];
    }
  } catch {}
  // Initialize (or re-initialize on version bump) with fresh sample data
  const initialized = sampleBooks.map((b) => ({
    ...b,
    user_book_id: b.id,
    shelf_id: statusToGuestShelfId(b.status),
  }));
  localStorage.setItem(GUEST_KEY, JSON.stringify(initialized));
  localStorage.setItem(GUEST_VERSION_KEY, GUEST_VERSION);
  return initialized;
}

function saveGuestBooks(books: Book[]): void {
  localStorage.setItem(GUEST_KEY, JSON.stringify(books));
}

export function useBooks() {
  const { session } = useAuth();
  const isGuest = !session;

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["books", session?.user.id ?? "guest"],
    enabled: isGuest || !!session?.user.id,
    queryFn: async () => {
      if (isGuest) return loadGuestBooks();

      const { data, error } = await supabase
        .from("user_books")
        .select(`*, books (*), shelves(name)`)
        .eq("user_id", session?.user.id);
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((ub: any) => ({
        ...ub.books,
        user_book_id: ub.id,
        genres: ub.books?.genres ?? [],
        rating: ub.rating,
        notes: ub.notes,
        shelf_id: ub.shelf_id,
        date_finished: ub.date_finished,
        status:
          ub.shelves?.name === "Currently Reading"
            ? "reading"
            : ub.shelves?.name === "Read"
              ? "read"
              : "to-read",
      })) as Book[];
    },
  });

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genres?.forEach((g) => set.add(g)));
    return [...set].sort();
  }, [books]);

  const counts = useMemo(
    () => ({
      reading: books.filter((b) => b.status === "reading").length,
      read: books.filter((b) => b.status === "read").length,
      toRead: books.filter((b) => b.status === "to-read").length,
    }),
    [books],
  );

  const byStatus = (status: ReadingStatus) =>
    books.filter((b) => b.status === status);

  return {
    books,
    isLoading,
    allGenres,
    counts,
    byStatus,
  };
}

export const useAddBook = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBook: Book) => {
      if (!session) {
        const books = loadGuestBooks();
        const id = crypto.randomUUID();
        const guest: Book = {
          ...newBook,
          id,
          user_book_id: id,
          status: "to-read",
          shelf_id: "guest-shelf-want",
        };
        saveGuestBooks([...books, guest]);
        return;
      }

      const { data: existingBook } = await supabase
        .from("books")
        .select("id")
        .eq("isbn", newBook.isbn)
        .maybeSingle();

      let bookId = existingBook?.id;

      if (!existingBook) {
        const { data: newBookData, error: insertError } = await supabase
          .from("books")
          .insert({
            title: newBook.title,
            author: newBook.author,
            pages: newBook.pages,
            cover_url: newBook.cover_url,
            isbn: newBook.isbn,
            genres: newBook.genres,
            published_year: newBook.published_year,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        bookId = newBookData.id;
      }

      const { data: shelf } = await supabase
        .from("shelves")
        .select("id")
        .eq("user_id", session?.user.id)
        .eq("name", "Want to Read")
        .single();

      await supabase.from("user_books").insert({
        user_id: session?.user.id,
        book_id: bookId,
        shelf_id: shelf?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useDeleteBook = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!session) {
        const books = loadGuestBooks();
        saveGuestBooks(books.filter((b) => b.id !== bookId));
        return;
      }
      await supabase
        .from("user_books")
        .delete()
        .eq("book_id", bookId)
        .eq("user_id", session.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useUpdateBook = () => {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updateBook: Book) => {
      if (!session) {
        const books = loadGuestBooks();
        saveGuestBooks(
          books.map((b) => (b.id === updateBook.id ? { ...b, ...updateBook } : b)),
        );
        return;
      }
      await supabase
        .from("user_books")
        .update({
          rating: updateBook.rating,
          notes: updateBook.notes,
          shelf_id: updateBook.shelf_id,
          date_finished: updateBook.date_finished,
        })
        .eq("id", updateBook.user_book_id)
        .eq("user_id", session.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useShelves = () => {
  const { session } = useAuth();
  return useQuery<Shelf[]>({
    queryKey: ["shelves", session?.user.id ?? "guest"],
    enabled: !session || !!session?.user.id,
    queryFn: async () => {
      if (!session) return GUEST_SHELVES;
      const { data, error } = await supabase
        .from("shelves")
        .select("*")
        .eq("user_id", session.user.id);
      if (error) throw error;
      return data as Shelf[];
    },
  });
};
