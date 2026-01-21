// src/ui/ContentVisual.tsx
import { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type Props = {
  size?: number;
  radius?: number;
  image?: ImageSourcePropType;
  emoji?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
  variant?: 'tile' | 'circle';
};

/**
 * V12 Option B — One visual component everywhere.
 * - image (local require) when available
 * - emoji fallback
 * - neutral dot fallback
 */
export const ContentVisual = memo(function ContentVisual({
  size = 56,
  radius = 16,
  image,
  emoji,
  label,
  style,
  variant = 'tile',
}: Props) {
  const isCircle = variant === 'circle';
  const r = isCircle ? size / 2 : radius;

  return (
    <View
      accessibilityLabel={label}
      style={[styles.wrap, { width: size, height: size, borderRadius: r }, style]}
    >
      {image ? (
        <Image
          source={image}
          style={[styles.img, { borderRadius: r }]}
          resizeMode="cover"
        />
      ) : emoji ? (
        <Text style={[styles.emoji, { fontSize: Math.max(18, Math.floor(size * 0.52)) }]}>
          {emoji}
        </Text>
      ) : (
        <View style={styles.dot} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    // ✅ polish
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 2,
  },
  img: { width: '100%', height: '100%' },
  emoji: { lineHeight: 999 },
  fallbackDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

