import { useEffect, useState } from 'react';

const COLORS = ['#E8825A', '#EFA082', '#F5C578', '#7BC8A4', '#6EB5FF', '#D47FA6', '#A8D8B9'];

interface Particle {
  id: number;
  x: number;
  color: string;
  width: number;
  height: number;
  delay: number;
  duration: number;
  clockwise: boolean;
  shape: 'rect' | 'circle';
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: 6 + Math.random() * 7,
    height: 9 + Math.random() * 9,
    delay: Math.random() * 0.8,
    duration: 1.3 + Math.random() * 0.9,
    clockwise: Math.random() > 0.5,
    shape: Math.random() > 0.4 ? 'rect' : 'circle',
  }));
}

export function Confetti({ onDone }: { onDone?: () => void }) {
  const [particles] = useState(() => makeParticles(90));
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(false);
      onDone?.();
    }, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[500] pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.shape === 'circle' ? p.width : p.width,
            height: p.shape === 'circle' ? p.width : p.height,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationName: p.clockwise ? 'confetti-fall-cw' : 'confetti-fall-ccw',
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
