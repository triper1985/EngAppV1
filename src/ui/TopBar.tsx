// src/ui/TopBar.tsx (Native)
import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';

type Props = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  backLabel?: string;
  dir?: 'ltr' | 'rtl';
};

export function TopBar({ title, onBack, right, backLabel, dir }: Props) {
  const label = backLabel ?? 'Back';
  const isRtl = dir === 'rtl';

  return (
    <View style={styles.row}>
      {/* Left slot (fixed width to keep title centered) */}
      <View style={styles.side}>
        {onBack ? (
          <Button onClick={onBack}>
            {isRtl ? `${label} →` : `← ${label}`}
          </Button>
        ) : null}
      </View>

      {/* Center title */}
      <View style={styles.center}>
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      {/* Right slot (fixed width to keep title centered) */}
      <View style={[styles.side, styles.rightSide]}>
        {right ?? null}
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
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    minWidth: 0, // IMPORTANT: allows title to shrink/ellipsis instead of breaking mid-word
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
});
