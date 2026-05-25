interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className = '' }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={`h-1.5 w-full rounded-full bg-sand-300 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-terra-500 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
