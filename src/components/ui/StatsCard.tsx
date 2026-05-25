interface StatsCardProps {
  value: number | string;
  label: string;
  accent?: boolean;
}

export function StatsCard({ value, label, accent = false }: StatsCardProps) {
  return (
    <div className="bg-sand-100 border border-sand-300 rounded-xl p-5 flex flex-col gap-1">
      <span
        className={`font-serif text-4xl font-bold leading-none ${
          accent ? 'text-terra-500' : 'text-ink-900'
        }`}
      >
        {value}
      </span>
      <span className="text-sm text-ink-400 font-sans">{label}</span>
    </div>
  );
}
