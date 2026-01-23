// src/screens/learn/ItemVisual.tsx
import type { ContentItem } from '../../content/types';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { getItemVisualImage } from '../../visuals/itemVisualRegistry';

type Props = {
  item: ContentItem;
  /** Visual scale. Default tuned for quiz tiles. */
  size?: number;

  /**
   * Back-compat: previously CSSProperties (web).
   * In RN we accept either ViewStyle or TextStyle depending on kind.
   */
  style?: StyleProp<ViewStyle | TextStyle>;
};

/**
 * Renders the "no-reading" visual for a content item.
 * ✅ Keep layout stable across visuals.
 * Always return a fixed-size container; never let emoji/text change the card height.
 */
export function ItemVisual({ item, size = 68, style }: Props) {
  const v = item.visual;

  // One stable box size for all kinds.
  const dim = size + 22;

  // Keep inner text visually centered and not affecting outer layout.
  const textSize = Math.round(size * 0.95);

  // ✅ NEW: item-level image override (by item.id)
  const itemImg = getItemVisualImage(item.id);

  if (v.kind === 'color') {
    return (
      <View
        accessibilityLabel={item.en}
        style={[
          styles.boxBase,
          styles.colorBox,
          {
            width: dim,
            height: dim,
            borderRadius: 18,
            backgroundColor: v.hex,
          },
          style as StyleProp<ViewStyle>,
        ]}
      />
    );
  }

  // ✅ If registry has an image, render it (preferred)
  if (itemImg) {
    return (
      <View
        accessibilityLabel={item.en}
        style={[
          styles.boxBase,
          styles.imageBox,
          { width: dim, height: dim, borderRadius: 18 },
          style as StyleProp<ViewStyle>,
        ]}
      >
        <Image
          source={itemImg}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Optional: if content ever uses v.kind === 'image' (assetId), keep fallback placeholder for now
  if (v.kind === 'image') {
    return (
      <View
        accessibilityLabel={item.en}
        style={[
          styles.boxBase,
          styles.imageBox,
          { width: dim, height: dim, borderRadius: 18 },
          style as StyleProp<ViewStyle>,
        ]}
      >
        <Text
          style={[
            styles.centerText,
            {
              fontSize: Math.round(size * 0.55),
              lineHeight: Math.round(size * 0.6),
            },
          ]}
        >
          🖼️
        </Text>
      </View>
    );
  }

  // v.kind === 'text'
  const textVal = v.he;
  const isNumeric = /^\d+$/.test(textVal.trim());
  const digits = textVal.trim().length;

  // For multi-digit numbers, shrink more aggressively to avoid clipping (11→1 issue).
  const numericFontSize =
    digits <= 1
      ? textSize
      : digits === 2
        ? Math.round(textSize * 0.85)
        : digits === 3
          ? Math.round(textSize * 0.72)
          : Math.round(textSize * 0.62);

  return (
    <View
      accessibilityLabel={item.en}
      style={[
        styles.boxBase,
        { width: dim, height: dim, borderRadius: 18 },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <Text
        style={[
          styles.centerText,
          styles.textBold,
          {
            fontSize: isNumeric ? numericFontSize : textSize,
            lineHeight: Math.round((isNumeric ? numericFontSize : textSize) * 1.05),
            paddingHorizontal: isNumeric ? 2 : 6,
          },
        ]}
        numberOfLines={isNumeric ? 1 : 2}
        adjustsFontSizeToFit
        minimumFontScale={isNumeric ? 0.45 : 0.7}
      >
        {textVal}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  boxBase: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // shadow (best-effort)
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#111',
  },

  colorBox: {},

  imageBox: {
    backgroundColor: '#fff',
  },

  centerText: {
    textAlign: 'center',
    textAlignVertical: 'center' as any,
  },

  textBold: { fontWeight: '900' },
});
