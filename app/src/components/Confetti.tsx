import { useEffect, useMemo, useState } from 'react';

type Props = {
  durationMs?: number; // how long to show
  pieces?: number; // how many confetti pieces
};

type Piece = {
  leftPct: number;
  size: number;
  delayMs: number;
  fallMs: number;
  rotateDeg: number;
  opacity: number;
};

export function Confetti({ durationMs = 1800, pieces = 24 }: Props) {
  const [on, setOn] = useState(true);

  const items = useMemo<Piece[]>(() => {
    return Array.from({ length: pieces }).map(() => ({
      leftPct: Math.random() * 100,
      size: 6 + Math.random() * 10,
      delayMs: Math.random() * 200,
      fallMs: 900 + Math.random() * 900,
      rotateDeg: Math.floor(Math.random() * 720),
      opacity: 0.75 + Math.random() * 0.25,
    }));
  }, [pieces]);

  useEffect(() => {
    const t = window.setTimeout(() => setOn(false), durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs]);

  if (!on) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 9999,
      }}
    >
      {/* Keyframes injected once per render */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-30px) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
      `}</style>

      {items.map((p, idx) => (
        <span
          key={idx}
          style={{
            position: 'absolute',
            top: -20,
            left: `${p.leftPct}%`,
            width: p.size,
            height: p.size * 0.6,
            borderRadius: 2,
            opacity: p.opacity,

            // random-ish colors without hardcoding palettes:
            background: `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`,

            animationName: 'confettiFall',
            animationDuration: `${p.fallMs}ms`,
            animationDelay: `${p.delayMs}ms`,
            animationTimingFunction: 'linear',
            animationIterationCount: 1,
            animationFillMode: 'forwards',

            transform: `rotate(${p.rotateDeg}deg)`,
          }}
        />
      ))}
    </div>
  );
}
