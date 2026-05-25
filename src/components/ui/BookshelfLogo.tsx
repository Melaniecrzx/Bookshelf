interface Props { size?: number }

export function BookshelfLogo({ size = 32 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      {/* Shelf */}
      <line x1="4" y1="25" x2="28" y2="25" stroke="#E8825A" strokeWidth="1.75" strokeLinecap="round" />
      {/* Book 1 — medium */}
      <rect x="6" y="12" width="5" height="13" rx="0.5" stroke="#E8825A" strokeWidth="1.75" strokeLinejoin="round" />
      {/* Book 2 — short, wider */}
      <rect x="13" y="17" width="6" height="8" rx="0.5" stroke="#E8825A" strokeWidth="1.75" strokeLinejoin="round" />
      {/* Book 3 — tall */}
      <rect x="21" y="9" width="5" height="16" rx="0.5" stroke="#E8825A" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}
