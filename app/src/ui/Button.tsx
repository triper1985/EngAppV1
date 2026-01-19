// src/ui/Button.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'pill';

type Props = {
  children: React.ReactNode;
  onClick?: () => void; // שומרים onClick כדי לא לשנות את כל הקוד
  disabled?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
  style?: ViewStyle;
  title?: string; // לא בשימוש בנייטיב (אפשר להשאיר)
  type?: 'button' | 'submit'; // לא רלוונטי בנייטיב
};

export function Button({
  children,
  onClick,
  disabled,
  variant = 'secondary',
  fullWidth,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={disabled ? undefined : onClick}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth ? styles.fullWidth : null,
        variantStyles[variant].container,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      <Text style={[styles.text, variantStyles[variant].text]}>
        {typeof children === 'string' ? children : children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  text: { fontSize: 14, fontWeight: '800' },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.85 },
});

const variantStyles: Record<
  Variant,
  { container: ViewStyle; text: TextStyle }
> = {
  primary: {
    container: { backgroundColor: '#111', borderColor: '#111' },
    text: { color: '#fff' },
  },
  secondary: {
    container: { backgroundColor: '#fff', borderColor: '#ddd' },
    text: { color: '#111' },
  },
  ghost: {
    container: { backgroundColor: 'transparent', borderColor: 'transparent' },
    text: { color: '#111' },
  },
  pill: {
    container: {
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    text: { color: '#111', fontSize: 13 },
  },
};
