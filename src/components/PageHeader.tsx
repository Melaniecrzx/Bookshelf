interface PageHeaderProps {
  title: string;
  count?: number;
  subtitle?: string;
}

export function PageHeader({ title, count, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3">
        <h1 className="font-serif text-3xl font-bold text-ink-900">{title}</h1>
        {count !== undefined && (
          <span className="font-sans text-sm text-ink-400 font-medium">{count}</span>
        )}
      </div>
      {subtitle && <p className="text-sm text-ink-400 font-sans mt-1">{subtitle}</p>}
    </div>
  );
}
