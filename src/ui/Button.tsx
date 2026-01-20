// src/ui/Button.tsx
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'pill';

type Props = {
  children: ReactNode;

  /** Back-compat: many screens use onClick from web days */
  onClick?: () => void;

  disabled?: boolean;
  variant?: Variant;
  fullWidth?: boolean;

  /** RN style */
  style?: StyleProp<ViewStyle>;

  /** Optional accessibility hint */
  title?: string;

  /** Web-only legacy prop; ignored in RN */
  type?: 'button' | 'submit';
};

export function Button({
  children,
  onClick,
  disabled,
  variant = 'secondary',
  fullWidth,
  style,
  title,
}: Props) {
  const btnStyles: StyleProp<ViewStyle> = [
    styles.base,
    variantStyles[variant],
    fullWidth ? styles.fullWidth : null,
    disabled ? styles.disabled : null,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.textBase,
    textVariantStyles[variant],
    disabled ? styles.textDisabled : null,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={typeof title === 'string' ? title : undefined}
      onPress={disabled ? undefined : onClick}
      style={({ pressed }) => [btnStyles, pressed && !disabled ? styles.pressed : null]}
    >
      <View style={styles.content}>
        <Text style={textStyles} numberOfLines={1}>
          {children as any}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.6 },

  fullWidth: { alignSelf: 'stretch' },

  content: { alignItems: 'center', justifyContent: 'center' },

  textBase: { fontSize: 14, fontWeight: '800' as const },
  textDisabled: {}, // keep for future tweaks
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: '#111', borderColor: '#111' },
  secondary: { backgroundColor: '#fff', borderColor: '#ddd' },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  pill: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
};

const textVariantStyles: Record<Variant, TextStyle> = {
  primary: { color: '#fff' },
  secondary: { color: '#111' },
  ghost: { color: '#111' },
  pill: { color: '#111', fontSize: 13, fontWeight: '800' as const },
};
