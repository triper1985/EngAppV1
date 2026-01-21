// src/screens/learn/ItemVisual.tsx
import type { ContentItem } from '../../content/types';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

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
 * ✅ Fix (V1LearnTest): Keep layout stable across visuals.
 * Always return a fixed-size container; never let emoji/text change the card height.
 */
export function ItemVisual({ item, size = 68, style }: Props) {
  const v = item.visual;

  // One stable box size for all kinds.
  const dim = size + 22;

  // Keep inner text visually centered and not affecting outer layout.
  const textSize = Math.round(size * 0.95);

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

  if (v.kind === 'image') {
    // Until we have real assets, show a neutral placeholder.
    return (
      <View
        accessibilityLabel={item.en}
        style={[
          styles.boxBase,
          styles.imageBox,
          {
            width: dim,
            height: dim,
            borderRadius: 18,
          },
          style as StyleProp<ViewStyle>,
        ]}
      >
        <Text
          style={[
            styles.centerText,
            { fontSize: Math.round(size * 0.55), lineHeight: Math.round(size * 0.6) },
          ]}
        >
          🖼️
        </Text>
      </View>
    );
  }

  // v.kind === 'text'
  return (
    <View
      accessibilityLabel={item.en}
      style={[
        styles.boxBase,
        {
          width: dim,
          height: dim,
          borderRadius: 18,
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <Text
        style={[
          styles.centerText,
          styles.textBold,
          {
            fontSize: textSize,
            // Keep a stable and conservative lineHeight to avoid jumping across emoji glyphs.
            lineHeight: Math.round(textSize * 1.05),
          },
        ]}
        // Prevent multi-line growth
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {v.he}
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },

  colorBox: {
    borderWidth: 3,
    borderColor: '#111',
  },

  imageBox: {
    borderWidth: 2,
    borderColor: '#111',
    backgroundColor: '#fff',
  },

  centerText: {
    textAlign: 'center',
    textAlignVertical: 'center' as any,
  },

  textBold: { fontWeight: '900' },
});
