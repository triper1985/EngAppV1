// src/ui/TopBar.tsx
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

type Props = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;

  /** back label (i18n) */
  backLabel?: string;

  /** Optional: affects arrow + text direction only */
  dir?: 'ltr' | 'rtl';
};

/**
 * RTL policy (locked):
 * - Back button is ALWAYS on the RIGHT side (regardless of dir).
 * - "right" slot is ALWAYS on the LEFT side.
 * - Title is centered.
 */
export function TopBar({ title, onBack, right, backLabel, dir }: Props) {
  const label = backLabel ?? 'Back';
  const isRtl = dir === 'rtl';

  // Arrow reflects reading direction (even though the button is placed on the right)
  const backText = isRtl ? `${label} →` : `← ${label}`;

  return (
    <View style={styles.row}>
      {/* LEFT SIDE: right-slot content */}
      <View style={[styles.side, styles.leftSide]}>
        {right ?? <View />}
      </View>

      {/* CENTER: title */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* RIGHT SIDE: back button (always) */}
      <View style={[styles.side, styles.rightSide]}>
        {onBack ? <Button onClick={onBack}>{backText}</Button> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  side: {
    width: 120,
    justifyContent: 'center',
  },

  leftSide: { alignItems: 'flex-start' },
  rightSide: { alignItems: 'flex-end' },

  title: {
    flex: 1,
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
  },
});
