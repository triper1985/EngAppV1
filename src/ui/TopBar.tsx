// src/ui/TopBar.tsx
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

type Props = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;

  /** ✅ V5: allow i18n (default keeps backwards compatibility) */
  backLabel?: string;

  /** Optional: swap layout for RTL */
  dir?: 'ltr' | 'rtl';
};

export function TopBar({ title, onBack, right, backLabel, dir }: Props) {
  const label = backLabel ?? 'Back';
  const isRtl = dir === 'rtl';

  return (
    <View style={[styles.row, isRtl ? styles.rowRtl : null]}>
      <View style={[styles.side, { alignItems: isRtl ? 'flex-end' : 'flex-start' }]}>
        {onBack ? (
          <Button onClick={onBack}>
            {isRtl ? `${label} →` : `← ${label}`}
          </Button>
        ) : null}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={[styles.side, { alignItems: isRtl ? 'flex-start' : 'flex-end' }]}>
        {right ?? <View />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  rowRtl: { flexDirection: 'row-reverse' },

  side: { width: 120, justifyContent: 'center' },

  title: { flex: 1, fontWeight: '900', fontSize: 18, textAlign: 'center' },
});
