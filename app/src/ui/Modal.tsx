// src/ui/Modal.tsx (Native)
import type { ReactNode } from 'react';
import { Modal as RNModal, View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  widthPx?: number; // ignored on native
};

export function Modal({ open, title, children, onClose }: Props) {
  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
  },
  title: {
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 12,
  },
});
