// src/screens/learn/ItemVisual.tsx
import type { CSSProperties } from 'react';
import type { ContentItem } from '../../content/types';

type Props = {
  item: ContentItem;
  /** Visual scale. Default tuned for quiz tiles. */
  size?: number;
  /** Optional style override for the wrapper */
  style?: CSSProperties;
};

/**
 * Renders the "no-reading" visual for a content item.
 * This intentionally avoids showing the English word on screen for beginner.
 */
export function ItemVisual({ item, size = 68, style }: Props) {
  const v = item.visual;

  if (v.kind === 'color') {
    const box: CSSProperties = {
      width: size + 22,
      height: size + 22,
      borderRadius: 18,
      background: v.hex,
      border: '3px solid #111',
      boxShadow: '0 8px 18px rgba(0,0,0,0.10)',
      display: 'inline-block',
      ...style,
    };

    return <span aria-label={item.en} title={item.en} style={box} />;
  }

  if (v.kind === 'image') {
    const box: CSSProperties = {
      width: size + 22,
      height: size + 22,
      borderRadius: 18,
      border: '2px solid #111',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: Math.round(size * 0.55),
      boxShadow: '0 8px 18px rgba(0,0,0,0.08)',
      background: '#fff',
      ...style,
    };

    // Until we have real assets, show a neutral placeholder.
    return (
      <span aria-label={item.en} title={v.assetId} style={box}>
        🖼️
      </span>
    );
  }

  // v.kind === 'text'
  const textStyle: CSSProperties = {
    fontSize: size,
    lineHeight: 1,
    fontWeight: 900,
    ...style,
  };

  return (
    <span aria-label={item.en} title={item.en} style={textStyle}>
      {v.he}
    </span>
  );
}
