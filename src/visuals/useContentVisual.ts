// src/visuals/useContentVisual.ts
import { useMemo } from 'react';
import { getVisual, type VisualKind } from './contentVisualRegistry';

export function useContentVisual(kind: VisualKind, id: string, fallbackEmoji?: string) {
  return useMemo(() => {
    const v = getVisual(kind, id);
    if (!v) return { image: undefined, emoji: fallbackEmoji };
    return { image: v.image, emoji: v.emoji ?? fallbackEmoji };
  }, [kind, id, fallbackEmoji]);
}
