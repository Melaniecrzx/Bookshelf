import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number | null;
  onChange?: (rating: number | null) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readOnly = false, size = 14 }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? value ?? 0;

  if (readOnly) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            strokeWidth={1.5}
            className={star <= display ? 'fill-terra-500 text-terra-500' : 'fill-transparent text-sand-300'}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star === value ? null : star)}
          onMouseEnter={() => setHovered(star)}
          className="cursor-pointer"
        >
          <Star
            size={size}
            strokeWidth={1.5}
            className={`transition-colors duration-100 ${
              star <= display ? 'fill-terra-500 text-terra-500' : 'fill-transparent text-ink-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
