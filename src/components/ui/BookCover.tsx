import { useState } from 'react';
import { CoverPlaceholder } from './CoverPlaceholder';

interface BookCoverProps {
  coverUrl?: string | null;
  isbn?: string | null;
  title: string;
  className?: string;
}

type Stage = 'primary' | 'openlibrary' | 'placeholder';

function initialStage(coverUrl?: string | null, isbn?: string | null): Stage {
  if (coverUrl) return 'primary';
  if (isbn) return 'openlibrary';
  return 'placeholder';
}

export function BookCover({
  coverUrl,
  isbn,
  title,
  className = 'w-full h-full object-cover',
}: BookCoverProps) {
  const openLibraryUrl = isbn
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
    : null;

  const [stage, setStage] = useState<Stage>(() => initialStage(coverUrl, isbn));

  function handleError() {
    if (stage === 'primary') {
      setStage(openLibraryUrl ? 'openlibrary' : 'placeholder');
    } else {
      setStage('placeholder');
    }
  }

  if (stage === 'placeholder') return <CoverPlaceholder title={title} />;

  const src = stage === 'primary' ? coverUrl! : openLibraryUrl!;

  return (
    <img
      src={src}
      alt={title}
      className={className}
      onError={handleError}
    />
  );
}
