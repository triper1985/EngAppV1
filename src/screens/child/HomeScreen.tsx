// HomeScreen.tsx  (Native)
import { ScrollView, Text, Pressable, View } from 'react-native';

type UserLike = { id: string; name: string };

type Props = {
  users: UserLike[];
  onUserChanged: (userId: string) => void;
  onSelectChild: (userId: string) => void;
  onEnterParent: () => void;
};

export function HomeScreen({
  users,
  onUserChanged,
  onSelectChild,
  onEnterParent,
}: Props) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>English App</Text>

      <Pressable
        onPress={onEnterParent}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16 }}>Parent</Text>
      </Pressable>

      <View style={{ height: 1, backgroundColor: '#ddd' }} />

      <Text style={{ fontSize: 18, fontWeight: '600' }}>Choose child</Text>

      {users.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>No children yet</Text>
      ) : (
        <View style={{ gap: 10 }}>
          {users.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => {
                onUserChanged(u.id);
                onSelectChild(u.id);
              }}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
              }}
            >
              <Text style={{ fontSize: 16 }}>{u.name}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
