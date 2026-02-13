// src/screens/learn/ItemVisual.tsx
import type { ContentItem } from '../../content/types';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { getItemVisualImage } from '../../visuals/itemVisualRegistry';

type Props = {
  item: ContentItem;
  size?: number;
  style?: StyleProp<ViewStyle | TextStyle>;
};

export function ItemVisual({ item, size = 68, style }: Props) {
  const v = item.visual;

  const itemImg = getItemVisualImage(item.id);

  // ===============================
  // COLOR
  // ===============================
  if (v.kind === 'color') {
    const dim = size + 22;

    return (
      <View
        accessibilityLabel={item.en}
        style={[
          styles.boxBase,
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

  // ===============================
  // IMAGE (registry override)
  // ===============================
  if (itemImg) {
    const dim = size + 22;

    return (
      <View
        accessibilityLabel={item.en}
        style={[
          styles.boxBase,
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

  // ===============================
  // IMAGE (fallback)
  // ===============================
  if (v.kind === 'image') {
    const dim = size + 22;

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

 // ===============================
// TEXT
// ===============================
const textVal = v.he ?? '';
const trimmed = textVal.trim();
const isNumeric = /^\d+$/.test(trimmed);
if (item.id.includes('100') || item.id.includes('hundred')) {
  console.log('HUNDREDS DEBUG', {
    id: item.id,
    textVal,
    visual: v,
  });
}

// גודל קופסה קבוע — לא להגדיל לפי ספרות
const dim = size + 22;

// גודל פונט קבוע למספרים (מתאים עד 4 ספרות)
const baseFontSize = Math.round(size * 0.95);
const digits = trimmed.length;

const numericFontSize =
  digits <= 2
    ? Math.round(size * 0.85)
    : digits === 3
      ? Math.round(size * 0.78)
      : Math.round(size * 0.68); // 4 ספרות

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
          fontSize: isNumeric ? numericFontSize : baseFontSize,
        },
      ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        ellipsizeMode="clip"

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
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#111',
  },

centerText: {
  textAlign: 'center',
  textAlignVertical: 'center' as any,
  includeFontPadding: false,
},

  textBold: {
    fontWeight: '900',
  },
});
