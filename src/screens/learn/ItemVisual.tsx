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
 * This intentionally avoids showing the English word on screen for beginner.
 */
export function ItemVisual({ item, size = 68, style }: Props) {
  const v = item.visual;

  if (v.kind === 'color') {
    const dim = size + 22;

    return (
      <View
        accessibilityLabel={item.en}
        style={[
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
    const dim = size + 22;
    const fontSize = Math.round(size * 0.55);

    // Until we have real assets, show a neutral placeholder.
    return (
      <View
        accessibilityLabel={item.en}
        style={[
          styles.imageBox,
          {
            width: dim,
            height: dim,
            borderRadius: 18,
          },
          style as StyleProp<ViewStyle>,
        ]}
      >
        <Text style={[{ fontSize }, styles.imagePlaceholder]}>🖼️</Text>
      </View>
    );
  }

  // v.kind === 'text'
  return (
    <Text
      accessibilityLabel={item.en}
      style={[
        styles.text,
        { fontSize: size, lineHeight: Math.round(size * 1.05) },
        style as StyleProp<TextStyle>,
      ]}
    >
      {v.he}
    </Text>
  );
}

const styles = StyleSheet.create({
  colorBox: {
    borderWidth: 3,
    borderColor: '#111',
    // shadow (best-effort)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  imageBox: {
    borderWidth: 2,
    borderColor: '#111',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // shadow (best-effort)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  imagePlaceholder: { fontWeight: '900' },
  text: { fontWeight: '900' },
});
