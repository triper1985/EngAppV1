// src/screens/child/HomeScreen.tsx
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ChildProfile } from '../../types';
import { iconToDisplay } from '../../data/icons';
import { ChildrenStore } from '../../storage/childrenStore';

import { Button } from '../../ui/Button';

type Props = {
  users: ChildProfile[];

  /**
   * בעבר היה חובה, אבל בפועל בהרצה ראינו שזה לא תמיד נשלח → גרם לקריסה.
   * נשאר כ־optional כדי לאפשר למסך לעבוד גם בלי ניהול state מלמעלה.
   */
  onUsersChanged?: (users: ChildProfile[]) => void;

  onSelectChild: (child: ChildProfile) => void;
  onEnterParent: () => void;
};

export function HomeScreen({ users, onUsersChanged, onSelectChild, onEnterParent }: Props) {
  // ✅ local state so Refresh works even if parent didn't pass onUsersChanged
  const [localUsers, setLocalUsers] = useState<ChildProfile[]>(users ?? []);

  useEffect(() => {
    setLocalUsers(users ?? []);
  }, [users]);

  const hasUsers = (localUsers?.length ?? 0) > 0;

  function refresh() {
    const next = ChildrenStore.list();
    setLocalUsers(next);
    onUsersChanged?.(next);
  }

  const sortedUsers = useMemo(() => {
    const arr = [...(localUsers ?? [])];
    arr.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    return arr;
  }, [localUsers]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>English App</Text>

        <Button variant="primary" onClick={onEnterParent} style={styles.parentBtn}>
          Parent 🔒
        </Button>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.h2}>Choose a child</Text>

        {!hasUsers ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No children yet. Add one in Parent mode.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {sortedUsers.map((u) => (
              <Pressable
                key={u.id}
                onPress={() => onSelectChild(u)}
                style={({ pressed }) => [styles.childRow, pressed ? styles.pressed : null]}
                accessibilityRole="button"
              >
                <View style={styles.left}>
                  <Text style={styles.icon}>{iconToDisplay(u.iconId)}</Text>
                  <Text style={styles.name} numberOfLines={1}>
                    {u.name}
                  </Text>
                </View>

                <Text style={styles.enter}>Enter →</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Dev helper – keep for now */}
      <View style={{ marginTop: 14 }}>
        <Button
          onClick={() => {
            ChildrenStore.ensureDefaultsIfEmpty();
            refresh();
          }}
          style={styles.refreshBtn}
        >
          Refresh
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 28,
    maxWidth: 820,
    alignSelf: 'center',
    width: '100%',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  title: { fontSize: 26, fontWeight: '900' },
  parentBtn: { borderRadius: 999 },

  h2: { fontSize: 18, fontWeight: '800', marginBottom: 10 },

  emptyBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  emptyText: { opacity: 0.8 },

  list: { gap: 10 },

  childRow: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: { opacity: 0.85 },

  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  icon: { fontSize: 26 },
  name: { fontSize: 18, fontWeight: '900', flexShrink: 1 },

  enter: { fontSize: 14, opacity: 0.7, marginLeft: 10 },

  refreshBtn: { alignSelf: 'flex-start' },
});
