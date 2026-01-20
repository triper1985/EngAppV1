// src/components/Confetti.tsx
// Native-first confetti overlay for Expo / React Native.
// - On native: uses Animated pieces falling down.
// - On web: falls back to a simple DOM/CSS implementation (guarded).

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

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
  hue: number;
};

function makePieces(pieces: number): Piece[] {
  return Array.from({ length: pieces }).map(() => ({
    leftPct: Math.random() * 100,
    size: 6 + Math.random() * 10,
    delayMs: Math.random() * 200,
    fallMs: 900 + Math.random() * 900,
    rotateDeg: Math.floor(Math.random() * 720),
    opacity: 0.75 + Math.random() * 0.25,
    hue: Math.floor(Math.random() * 360),
  }));
}

function hueToRgb(h: number) {
  // Simple HSL->RGB with fixed S/L to match old look.
  const s = 0.9;
  const l = 0.6;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hh = (h % 360) / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r1 = 0,
    g1 = 0,
    b1 = 0;

  if (0 <= hh && hh < 1) {
    r1 = c;
    g1 = x;
  } else if (1 <= hh && hh < 2) {
    r1 = x;
    g1 = c;
  } else if (2 <= hh && hh < 3) {
    g1 = c;
    b1 = x;
  } else if (3 <= hh && hh < 4) {
    g1 = x;
    b1 = c;
  } else if (4 <= hh && hh < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  const m = l - c / 2;
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return `rgb(${r},${g},${b})`;
}

export function Confetti({ durationMs = 1800, pieces = 24 }: Props) {
  // --- Web fallback (keeps old behavior, guarded) ---
  if (Platform.OS === 'web') {
    return <ConfettiWeb durationMs={durationMs} pieces={pieces} />;
  }

  const { width, height } = useWindowDimensions();
  const [on, setOn] = useState(true);

  const items = useMemo(() => makePieces(pieces), [pieces]);
  const anims = useRef(items.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const t = setTimeout(() => setOn(false), durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  useEffect(() => {
    anims.forEach((a) => a.setValue(0));
    const runs = items.map((p, i) =>
      Animated.timing(anims[i], {
        toValue: 1,
        duration: p.fallMs,
        delay: p.delayMs,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    Animated.parallel(runs, { stopTogether: false }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  if (!on) return null;

  const fromY = -30;
  const toY = Math.max(height, 800) + 60;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {items.map((p, idx) => {
        const translateY = anims[idx].interpolate({
          inputRange: [0, 1],
          outputRange: [fromY, toY],
        });
        const rotate = anims[idx].interpolate({
          inputRange: [0, 1],
          outputRange: [`${p.rotateDeg}deg`, `${p.rotateDeg + 360}deg`],
        });

        return (
          <Animated.View
            key={idx}
            style={[
              styles.piece,
              {
                left: (p.leftPct / 100) * width,
                width: p.size,
                height: p.size * 0.6,
                opacity: p.opacity,
                backgroundColor: hueToRgb(p.hue),
                transform: [{ translateY }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: -20,
    borderRadius: 2,
  },
});

// --- Web-only fallback component (DOM/CSS) ---
function ConfettiWeb({ durationMs = 1800, pieces = 24 }: Props) {
  const [on, setOn] = useState(true);
  const items = useMemo(() => makePieces(pieces), [pieces]);

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
            background: `hsl(${p.hue}, 90%, 60%)`,
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
