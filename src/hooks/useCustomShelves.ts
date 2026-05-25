import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import { useAuth } from "@/contexts/AuthContext";
import { useBooks, useShelves } from "./useBooks";
import type { Book } from "../types/book";

export interface UserBookShelf {
  book_id: string;
  shelf_id: string;
}

// All custom-shelf memberships for the current user
export function useUserBookShelves() {
  const { session } = useAuth();
  return useQuery<UserBookShelf[]>({
    queryKey: ["user_book_shelves"],
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_book_shelves")
        .select("book_id, shelf_id")
        .eq("user_id", session!.user.id);
      if (error) throw error;
      return (data ?? []) as UserBookShelf[];
    },
  });
}

// Add or remove a book from a custom shelf
export function useToggleBookInShelf() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookId,
      shelfId,
      add,
    }: {
      bookId: string;
      shelfId: string;
      add: boolean;
    }) => {
      if (add) {
        const { error } = await supabase
          .from("user_book_shelves")
          .insert({ user_id: session!.user.id, book_id: bookId, shelf_id: shelfId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_book_shelves")
          .delete()
          .eq("user_id", session!.user.id)
          .eq("book_id", bookId)
          .eq("shelf_id", shelfId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_book_shelves"] });
    },
  });
}

// Create a new custom shelf
export function useCreateCustomShelf() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from("shelves")
        .insert({ user_id: session!.user.id, name, type: "custom" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelves"] });
    },
  });
}

// Rename a shelf
export function useRenameShelf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from("shelves")
        .update({ name })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelves"] });
    },
  });
}

// Delete a shelf (also drops its user_book_shelves entries via cascade)
export function useDeleteShelf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shelves").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelves"] });
      queryClient.invalidateQueries({ queryKey: ["user_book_shelves"] });
    },
  });
}

// Convenience hook: custom shelves list + create mutation
export function useCustomShelves() {
  const { data: allShelves = [], isLoading } = useShelves();
  const shelves = allShelves.filter((s) => s.type === "custom");
  const { mutate: createShelf, isPending: isCreating } = useCreateCustomShelf();
  return { shelves, isLoading, createShelf, isCreating };
}

// Books for any shelf, handling default vs custom transparently
export function useShelfBooks(shelfId: string | undefined): Book[] {
  const { books } = useBooks();
  const { data: shelves = [] } = useShelves();
  const { data: userBookShelves = [] } = useUserBookShelves();

  if (!shelfId) return [];

  const shelf = shelves.find((s) => s.id === shelfId);
  if (!shelf) return [];

  if (shelf.type === "default") {
    return books.filter((b) => b.shelf_id === shelfId);
  }

  const bookIds = new Set(
    userBookShelves
      .filter((ubs) => ubs.shelf_id === shelfId)
      .map((ubs) => ubs.book_id),
  );
  return books.filter((b) => bookIds.has(b.id));
}
