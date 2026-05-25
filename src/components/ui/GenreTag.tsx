interface GenreTagProps {
  genre: string;
  active?: boolean;
  onClick?: () => void;
}

export function GenreTag({ genre, active = false, onClick }: GenreTagProps) {
  const base = 'inline-flex items-center rounded-full text-[11px] font-sans font-medium px-2 py-0.5 transition-colors';
  const style = active
    ? 'bg-terra-200 text-terra-600'
    : 'bg-sand-200 text-ink-500 hover:bg-terra-100 hover:text-terra-600';

  return (
    <span className={`${base} ${style} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {genre}
    </span>
  );
}
