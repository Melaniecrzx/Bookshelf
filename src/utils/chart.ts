export const CHART_TOOLTIP_STYLE = {
  background: "#F8F2EA",
  border: "1px solid #E2D5C2",
  borderRadius: "8px",
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  color: "#2C2C2C",
} as const;

export function bookCountFormatter(value: unknown): [string, string] {
  const n = Number(value);
  return [`${n} book${n !== 1 ? "s" : ""}`, ""];
}
