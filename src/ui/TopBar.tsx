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
    <View style={[styles.row, isRtl ? styles.rowRtl : null]}>
      <View style={styles.side}>
        {onBack ? (
          <Button onClick={onBack}>
            {isRtl ? `${label} →` : `← ${label}`}
          </Button>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={[styles.side, styles.rightSide]}>{right ?? null}</View>
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
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  side: {
    width: 120,
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
  },
});
