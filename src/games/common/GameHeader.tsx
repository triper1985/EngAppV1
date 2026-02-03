// src/games/common/GameHeader.tsx
import { StyleSheet, Text, View } from 'react-native';

import { TopBar } from '../../ui/TopBar';

type Props = {
  title: string;
  onBack: () => void;
  dir?: 'ltr' | 'rtl';
  progressLabel?: string;
};

export function GameHeader({ title, onBack, dir, progressLabel }: Props) {
  const isRtl = dir === 'rtl';
  return (
    <View style={styles.wrap}>
      <TopBar title={title} onBack={onBack} dir={dir} />
      {progressLabel ? (
        <Text style={[styles.progress, isRtl && styles.rtl]}>{progressLabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  progress: { fontSize: 12, opacity: 0.75 },
  rtl: { textAlign: 'right' as const },
});
