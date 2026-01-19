// src/screens/parent/ParentProgressGroupsScreen.tsx (Native stub)
import { ScrollView, Text } from 'react-native';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

export function ParentProgressGroupsScreen({ onBack }: { onBack: () => void }) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Progress" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>This view is available on web.</Text>
    </ScrollView>
  );
}
