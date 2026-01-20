// src/screens/child/HomeScreen.tsx
import type { ChildProfile } from '../../types';
import { iconToDisplay } from '../../data/icons';
import { ChildrenStore } from '../../storage/childrenStore';

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

type Props = {
  users: ChildProfile[];
  onUsersChanged: (users: ChildProfile[]) => void;
  onSelectChild: (child: ChildProfile) => void;
  onEnterParent: () => void;
};

export function HomeScreen({ users, onUsersChanged, onSelectChild, onEnterParent }: Props) {
  function refresh() {
    onUsersChanged(ChildrenStore.list());
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.h1}>English App</Text>
        <Button variant="primary" onClick={onEnterParent}>
          Parent 🔒
        </Button>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.h2}>Choose a child</Text>

        {users.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No children yet. Add one in Parent mode.</Text>
          </Card>
        ) : (
          <View style={styles.list}>
            {users.map((u) => (
              <Button
                key={u.id}
                onClick={() => onSelectChild(u)}
                style={styles.childRowBtn}
              >
                <View style={styles.childRow}>
                  <View style={styles.childLeft}>
                    <Text style={styles.icon}>{iconToDisplay(u.iconId)}</Text>
                    <Text style={styles.childName}>{u.name}</Text>
                  </View>
                  <Text style={styles.enterHint}>Enter →</Text>
                </View>
              </Button>
            ))}
          </View>
        )}
      </View>

      {/* Dev helper – אפשר להשאיר או למחוק */}
      <View style={{ marginTop: 14 }}>
        <Button
          onClick={() => {
            ChildrenStore.ensureDefaultsIfEmpty();
            refresh();
          }}
        >
          Refresh
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 26,
    maxWidth: 820,
    alignSelf: 'center',
    width: '100%',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  h1: { fontSize: 22, fontWeight: '900' },
  h2: { fontSize: 16, fontWeight: '900', marginBottom: 10 },

  emptyCard: { padding: 12 },
  emptyText: { fontSize: 14, opacity: 0.75 },

  list: { gap: 10 },
  childRowBtn: {
    // Button already styles; we just make it look like a "card row"
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  childLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { fontSize: 28 },
  childName: { fontSize: 18, fontWeight: '800' },
  enterHint: { fontSize: 14, opacity: 0.7 },
});
