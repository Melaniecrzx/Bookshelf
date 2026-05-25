import { useEffect, useState } from 'react';
import { StarRating } from './ui/StarRating';

interface RatingModalProps {
  bookTitle: string;
  onDismiss: () => void;
  onSave: (rating: number | null) => void;
}

export function RatingModal({ bookTitle, onDismiss, onSave }: RatingModalProps) {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />

      <div
        className="relative z-10 bg-sand-50 w-full max-w-xs rounded-2xl border border-sand-300 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-4 px-6 pt-7 pb-6">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-xs font-sans text-ink-400">You just finished</p>
            <h2 className="font-serif text-base font-bold text-ink-900 text-center leading-snug">
              {bookTitle}
            </h2>
          </div>

          <StarRating value={rating} onChange={setRating} size={28} />
        </div>

        <div className="flex items-center gap-2 px-6 pb-6 border-t border-sand-200 pt-4">
          <button
            onClick={onDismiss}
            className="flex-1 py-2 text-xs font-sans font-medium text-ink-500 border border-sand-300 rounded-lg hover:border-sand-400 hover:text-ink-700 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => onSave(rating)}
            className="flex-1 py-2 text-xs font-sans font-medium text-white bg-terra-500 rounded-lg hover:bg-terra-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
