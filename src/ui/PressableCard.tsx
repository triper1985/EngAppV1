// src/ui/PressableCard.tsx
import type { ReactNode } from 'react';
import { useMemo, useRef, useCallback } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { playFx, type FxEvent } from '../audio';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  fx?: FxEvent; // optional override
};

/**
 * V12 Option B — microinteraction without new deps.
 * Subtle scale + opacity on press + tap FX.
 */
export function PressableCard({
  children,
  onPress,
  disabled,
  style,
  fx = 'tap',
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const containerStyle = useMemo(
    () => [styles.card, disabled ? styles.disabled : null, style],
    [disabled, style]
  );

  const handlePress = useCallback(() => {
    if (disabled) return;
    playFx(fx);
    onPress?.();
  }, [disabled, fx, onPress]);

  function pressIn() {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.985,
      useNativeDriver: true,
      speed: 28,
      bounciness: 6,
    }).start();
  }

  function pressOut() {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 28,
      bounciness: 6,
    }).start();
  }

  return (
    <Pressable
      onPress={disabled ? undefined : handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={({ pressed }) => [{ opacity: pressed && !disabled ? 0.98 : 1 }]}
    >
      <Animated.View style={[{ transform: [{ scale }] }]}>
        <View style={containerStyle}>{children}</View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    backgroundColor: '#fff',
    // shadow best-effort
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  disabled: { opacity: 0.75 },
});
