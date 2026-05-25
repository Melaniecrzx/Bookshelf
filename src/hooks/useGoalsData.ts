import { useMemo } from "react";
import { useBooks } from "./useBooks";
import { useReadingGoal, useUpdateGoal } from "./useReadingGoal";
import {
  CURRENT_YEAR,
  DAYS_IN_YEAR,
  MONTH_NAMES,
  dayOfYear,
} from "../utils/date";

export function useGoalsData() {
  const { books } = useBooks();
  const goal = useReadingGoal();
  console.log("useGoalsData goal", goal);
  const { mutate } = useUpdateGoal();
  const setGoal = (n: number) => mutate(n);

  const now = new Date();
  const currentMonth = now.getMonth();
  const elapsed = dayOfYear(now);

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

  const read = booksThisYear.length;
  const currentPacePerYear = elapsed > 0 ? (read / elapsed) * DAYS_IN_YEAR : 0;
  const onTrack = currentPacePerYear >= goal;
  const booksRemaining = Math.max(0, goal - read);
  const daysRemaining = DAYS_IN_YEAR - elapsed;
  const weeksRemaining = daysRemaining / 7;
  const currentPerWeek =
    elapsed > 0 ? ((read / elapsed) * 7).toFixed(1) : "0.0";
  const neededPerWeek =
    weeksRemaining > 0 ? (booksRemaining / weeksRemaining).toFixed(1) : "0.0";

  const monthlyData = useMemo(() => {
    const counts = new Array(12).fill(0);
    booksThisYear.forEach((b) => {
      if (b.date_finished) counts[new Date(b.date_finished).getMonth()]++;
    });
    return MONTH_NAMES.map((name, i) => ({
      name,
      count: counts[i],
      isCurrent: i === currentMonth,
    }));
  }, [booksThisYear, currentMonth]);

  const milestones = [25, 50, 75, 100].map((p) => ({
    pct: p,
    target: Math.ceil((goal * p) / 100),
    reached: read >= Math.ceil((goal * p) / 100),
  }));

  return {
    goal,
    setGoal,
    read,
    onTrack,
    currentPerWeek,
    neededPerWeek,
    monthlyData,
    milestones,
  };
}
