// src/components/IconPicker.tsx
import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { ICONS, iconToDisplay } from '../data/icons';
import { Card } from '../ui/Card';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  value?: string;
  unlockedIconIds: string[];
  onPick: (iconId: string) => void;
};

export function IconPicker({ value, unlockedIconIds, onPick }: Props) {
  const { t } = useI18n();
  const unlocked = useMemo(
    () => new Set<string>(unlockedIconIds ?? []),
    [unlockedIconIds]
  );

  const visibleIcons = useMemo(
    () => ICONS.filter((ic) => unlocked.has(ic.id)),
    [unlocked]
  );

  const { width } = useWindowDimensions();
  const numColumns = width >= 520 ? 5 : width >= 380 ? 4 : 3;
  const cellWidthPct = 100 / numColumns;

  const selectedId = typeof value === 'string' && value.trim() ? value : undefined;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>🧑‍🎨 {t('rewards.picker.title')}</Text>
        <Text style={styles.subtitle}>{t('rewards.picker.subtitle')}</Text>
      </View>

      {visibleIcons.length === 0 ? (
        <Text style={styles.empty}>
          {t('rewards.picker.empty')}
        </Text>
      ) : (
        <>
          <View style={styles.grid}>
            {visibleIcons.map((ic) => {
              const selected = ic.id === selectedId;

              return (
                <View key={ic.id} style={[styles.cellWrap, { width: `${cellWidthPct}%` }]}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onPick(ic.id)}
                    style={[
                      styles.cell,
                      selected ? styles.cellSelected : styles.cellUnselected,
                    ]}
                  >
                    <Text style={styles.emoji}>{iconToDisplay(ic.id)}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Text style={styles.selectedLabel}>
            {t('rewards.picker.selected')}{' '}
            <Text style={styles.selectedEmoji}>
              {selectedId ? iconToDisplay(selectedId) : '—'}
            </Text>
          </Text>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },
  header: { gap: 2 },
  title: { fontWeight: '900', fontSize: 18 },
  subtitle: { fontSize: 13, opacity: 0.75, marginTop: 2 },
  empty: { marginTop: 12, fontSize: 14, opacity: 0.75 },

  grid: {
    paddingTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cellWrap: {
    paddingRight: 10,
    paddingBottom: 10,
  },

  cell: {
    width: '100%',
    height: 70,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  cellSelected: {
    borderWidth: 2,
    borderColor: '#111',
    backgroundColor: '#f3f3f3',
  },
  cellUnselected: { borderColor: '#ddd', backgroundColor: '#fff' },

  emoji: { fontSize: 28 },
  selectedLabel: { marginTop: 12, fontSize: 12, opacity: 0.75 },
  selectedEmoji: { fontWeight: '900' },
});
