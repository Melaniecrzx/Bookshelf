export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth();

const IS_LEAP =
  CURRENT_YEAR % 4 === 0 &&
  (CURRENT_YEAR % 100 !== 0 || CURRENT_YEAR % 400 === 0);
export const DAYS_IN_YEAR = IS_LEAP ? 366 : 365;

export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function dayOfYear(date: Date): number {
  return Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
}
