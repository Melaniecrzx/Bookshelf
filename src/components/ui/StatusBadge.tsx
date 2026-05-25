import type { ReadingStatus } from '../../types/book';

const config: Record<ReadingStatus, { label: string; color: string; bg: string }> = {
  reading: { label: 'Reading', color: '#E8825A', bg: '#FEF4EF' },
  read: { label: 'Read', color: '#6B9B6E', bg: '#EBF5EC' },
  'to-read': { label: 'To Read', color: '#8A8B90', bg: '#F0F0F2' },
};

interface StatusBadgeProps {
  status: ReadingStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { label, color, bg } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full font-sans font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
      style={{ color, backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
