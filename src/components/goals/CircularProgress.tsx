interface CircularProgressProps {
  value: number;
  max: number;
}

export function CircularProgress({ value, max }: CircularProgressProps) {
  const pct = Math.min(value / Math.max(max, 1), 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <svg width={136} height={136} viewBox="0 0 136 136">
      <circle cx={68} cy={68} r={r} fill="none" stroke="#EFE6D8" strokeWidth={12} />
      <circle
        cx={68}
        cy={68}
        r={r}
        fill="none"
        stroke="#E8825A"
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 68 68)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={68}
        y={60}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Inria Serif', serif"
        fontSize={28}
        fontWeight={700}
        fill="var(--color-ink-900)"
      >
        {value}
      </text>
      <text
        x={68}
        y={80}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter, sans-serif"
        fontSize={11}
        fill="#A8968E"
      >
        of {max}
      </text>
    </svg>
  );
}
