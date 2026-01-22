// src/ui/Modal.tsx
import type { ReactNode } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  widthPx?: number;

  /** Optional: align header for RTL screens */
  dir?: 'ltr' | 'rtl';
};

export function Modal({ open, title, children, onClose, widthPx = 420, dir }: Props) {
  if (!open) return null;

  const isRtl = dir === 'rtl';

  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.card, { maxWidth: widthPx }]}
          onPress={(e) => e.stopPropagation()}
        >
          {title ? (
            <Text style={[styles.title, isRtl && styles.rtlTitle]}>{title}</Text>
          ) : null}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    // shadow (best-effort cross-platform)
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  title: { fontWeight: '900', fontSize: 18, marginBottom: 12, textAlign: 'left' },
  rtlTitle: { textAlign: 'right' as const, writingDirection: 'rtl' as const },
});
