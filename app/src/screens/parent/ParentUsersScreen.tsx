// src/screens/parent/ParentUsersScreen.tsx (Native)
import { ScrollView, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  onUsersChanged: (next: ChildProfile[]) => void;
  onBack: () => void;
};

export function ParentUsersScreen({ users, onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Children" onBack={onBack} dir={dir} />
      {users.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>No children yet.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {users.map((u) => (
            <View key={u.id} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12 }}>
              <Text style={{ fontWeight: '800' }}>{u.name}</Text>
              <Text style={{ opacity: 0.6, fontSize: 12 }}>{u.id}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={{ opacity: 0.6, fontSize: 12 }}>
        Add/Edit/Delete child UI will be ported to native later.
      </Text>
      <Button fullWidth onClick={onBack}>Back</Button>
    </ScrollView>
  );
}
