import { useMemo } from "react";
import { useBooks } from "./useBooks";
import { useRatingData } from "./useRatingData";
import { CURRENT_YEAR, CURRENT_MONTH, MONTH_NAMES } from "../utils/date";

export function useStatsData() {
  const { books, counts } = useBooks();
  const ratingData = useRatingData(books);
  console.log(books);

  const booksThisYear = useMemo(
    () =>
      books.filter(
        (b) =>
          b.status === "read" &&
          b.date_finished &&
          new Date(b.date_finished).getFullYear() === CURRENT_YEAR,
      ),
    [books],
  );

  const pagesThisYear = useMemo(
    () => booksThisYear.reduce((sum, b) => sum + (b.pages ?? 0), 0),
    [booksThisYear],
  );

  const { topAuthors, authorCount } = useMemo(() => {
    const map: Record<string, { count: number; cover?: string }> = {};
    books.forEach((b) => {
      if (!map[b.author])
        map[b.author] = { count: 0, cover: b.cover_url ?? undefined };
      map[b.author].count++;
      if (!map[b.author].cover && b.cover_url)
        map[b.author].cover = b.cover_url;
    });
    const sorted = Object.entries(map)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
    return { topAuthors: sorted, authorCount: Object.keys(map).length };
  }, [books]);

  const monthlyData = useMemo(() => {
    const counts = new Array(12).fill(0);
    booksThisYear.forEach((b) => {
      if (b.date_finished) counts[new Date(b.date_finished).getMonth()]++;
    });
    return MONTH_NAMES.map((name, i) => ({
      name,
      count: counts[i],
      isCurrent: i === CURRENT_MONTH,
    }));
  }, [booksThisYear]);

  const { bookLengthData, shortest, longest } = useMemo(() => {
    const categories = [
      { label: "Under 200", color: "#F0C89A", test: (p: number) => p < 200 },
      {
        label: "200 – 399",
        color: "#E4A76A",
        test: (p: number) => p >= 200 && p < 400,
      },
      {
        label: "400 – 599",
        color: "#C97C42",
        test: (p: number) => p >= 400 && p < 600,
      },
      { label: "600+", color: "#E8825A", test: (p: number) => p >= 600 },
    ];
    const withPages = books.filter((b) => b.pages != null);
    const raw = categories.map((c) => ({
      label: c.label,
      color: c.color,
      count: withPages.filter((b) => c.test(b.pages!)).length,
    }));
    const max = Math.max(...raw.map((c) => c.count), 1);
    const data = raw.map((c) => ({ ...c, pct: (c.count / max) * 100 }));

    const sorted = [...withPages].sort((a, b) => a.pageCount! - b.pages!);
    return {
      bookLengthData: data,
      shortest: sorted[0] ?? null,
      longest: sorted[sorted.length - 1] ?? null,
    };
  }, [books]);

  const genreData = useMemo(() => {
    const tally: Record<string, number> = {};
    books.forEach((b) =>
      b.genres.forEach((g) => {
        tally[g] = (tally[g] ?? 0) + 1;
      }),
    );
    return Object.entries(tally)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [books]);

  return {
    books,
    counts,
    pagesThisYear,
    topAuthors,
    authorCount,
    monthlyData,
    bookLengthData,
    shortest,
    longest,
    genreData,
    ...ratingData,
  };
}
