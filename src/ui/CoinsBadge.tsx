// src/ui/CoinsBadge.tsx
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  coins: number;
  title?: string; // kept for API compatibility
};

export function CoinsBadge({ coins }: Props) {
  return (
    <View style={styles.badge}>
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
    justifyContent: 'center',
  },
  text: { fontWeight: '900', textAlign: 'center' },
});
