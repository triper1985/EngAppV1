import { View, Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

export function DevOverlay({ onPress }: Props) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>DEV</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
});
