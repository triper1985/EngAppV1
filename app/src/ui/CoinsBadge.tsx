// src/ui/CoinsBadge.tsx (Native)
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  coins: number;
  title?: string; // ignored on native
  style?: ViewStyle;
};

export function CoinsBadge({ coins, style }: Props) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>🪙 {coins}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 74,
    alignItems: 'center',
  },
  text: {
    fontWeight: '900',
  },
});
