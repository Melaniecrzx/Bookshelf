const STAR_POINTS =
  "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26";

export function AvgStarsDisplay({ avg }: { avg: number }) {
  const size = 14;
  const gap = 3;
  const step = size + gap;
  const totalW = 5 * step - gap;
  const scale = size / 24;
  const fillW = (avg / 5) * totalW;

  return (
    <svg width={totalW} height={size}>
      <defs>
        <clipPath id="avg-rating-clip">
          <rect x={0} y={0} width={fillW} height={size} />
        </clipPath>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${i * step}, 0) scale(${scale})`}>
          <polygon
            points={STAR_POINTS}
            fill="none"
            stroke="#DDD0BE"
            strokeWidth={1.5 / scale}
            strokeLinejoin="round"
          />
        </g>
      ))}
      <g clipPath="url(#avg-rating-clip)">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${i * step}, 0) scale(${scale})`}>
            <polygon
              points={STAR_POINTS}
              fill="#FBBF24"
              stroke="#FBBF24"
              strokeWidth={1.5 / scale}
              strokeLinejoin="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
