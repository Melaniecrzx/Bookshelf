interface CoverPlaceholderProps {
  title: string;
}

export function CoverPlaceholder({ title }: CoverPlaceholderProps) {
  const initials = title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className="w-full h-full flex items-center justify-center bg-terra-100">
      <span className="font-serif text-2xl font-bold text-terra-500 select-none">{initials}</span>
    </div>
  );
}
