// src/components/UserList.tsx
import type { ReactNode } from 'react';
import type { ChildProfile } from '../types';
import { iconToDisplay } from '../data/icons';

import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  onAdd: () => void;
  onEdit: (u: ChildProfile) => void;
  onDelete: (u: ChildProfile) => void;
};

export function UserList({ users, onAdd, onEdit, onDelete }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  return (
    <Card style={styles.card}>
      <View style={[styles.header, { justifyContent: isRtl ? 'flex-start' : 'flex-end' }]}>
        <Button variant="primary" onClick={onAdd}>
          {t('parent.users.list.add')}
        </Button>
      </View>

      {users.length === 0 ? (
        <Text style={[styles.empty, { textAlign: isRtl ? 'right' : 'left' }]}>
          {t('parent.users.list.empty')}
        </Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => u.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <UserRow user={item} onEdit={onEdit} onDelete={onDelete} isRtl={isRtl} />
          )}
        />
      )}
    </Card>
  );
}

function UserRow({
  user,
  onEdit,
  onDelete,
  isRtl,
}: {
  user: ChildProfile;
  onEdit: (u: ChildProfile) => void;
  onDelete: (u: ChildProfile) => void;
  isRtl: boolean;
}) {
  const { t } = useI18n();

  return (
    <View style={[styles.row, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
      <View style={[styles.identity, { flexDirection: isRtl ? 'row-reverse' : 'row' }]}>
        <Text style={styles.icon}>{iconToDisplay(user.iconId)}</Text>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={[styles.name, { textAlign: isRtl ? 'right' : 'left' }]}>
            {user.name} <Text style={styles.id}>({user.id})</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.actions, { justifyContent: isRtl ? 'flex-start' : 'flex-end' }]}>
        <Button onClick={() => onEdit(user)}>{t('parent.users.row.edit')}</Button>
        <DangerButton onPress={() => onDelete(user)}>{t('parent.users.row.delete')}</DangerButton>
      </View>
    </View>
  );
}

function DangerButton({ children, onPress }: { children: ReactNode; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.dangerBtn, pressed ? { opacity: 0.85 } : null]}
    >
      <Text style={styles.dangerText}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 14, padding: 12 },
  header: { flexDirection: 'row', alignItems: 'center' },
  empty: { marginTop: 12, fontSize: 14, opacity: 0.75 },
  list: { paddingTop: 12, gap: 10 },
  row: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#fff',
  },
  identity: { flex: 1, alignItems: 'center', gap: 10 },
  icon: { fontSize: 18 },
  name: { fontSize: 16, fontWeight: '800', lineHeight: 20 },
  id: { opacity: 0.5, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  dangerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#b00020',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: { fontSize: 14, fontWeight: '800', color: '#b00020' },
});
