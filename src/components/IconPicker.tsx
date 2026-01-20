// src/components/IconPicker.tsx
import { useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { ICONS, iconToDisplay } from '../data/icons';
import { Card } from '../ui/Card';

type Props = {
  value?: string;
  unlockedIconIds: string[];
  onPick: (iconId: string) => void;
};

export function IconPicker({ value, unlockedIconIds, onPick }: Props) {
  const unlocked = useMemo(() => new Set(unlockedIconIds ?? []), [unlockedIconIds]);
  const visibleIcons = useMemo(
    () => ICONS.filter((ic) => unlocked.has(ic.id)),
    [unlocked]
  );

  const { width } = useWindowDimensions();
  const numColumns = width >= 520 ? 5 : width >= 380 ? 4 : 3;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>🧑‍🎨 Choose icon</Text>
        <Text style={styles.subtitle}>Pick an unlocked icon</Text>
      </View>

      {visibleIcons.length === 0 ? (
        <Text style={styles.empty}>
          No unlocked icons yet. Go to Shop to get your first one.
        </Text>
      ) : (
        <>
          <FlatList
            data={visibleIcons}
            key={numColumns}
            numColumns={numColumns}
            keyExtractor={(ic) => ic.id}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={numColumns > 1 ? styles.rowWrap : undefined}
            renderItem={({ item: ic }) => {
              const selected = ic.id === value;
              return (
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
              );
            }}
          />

          <Text style={styles.selectedLabel}>
            Selected:{' '}
            <Text style={styles.selectedEmoji}>{iconToDisplay(value)}</Text>
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
  grid: { paddingTop: 12 },
  rowWrap: { gap: 10 },
  cell: {
    flex: 1,
    height: 70,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
