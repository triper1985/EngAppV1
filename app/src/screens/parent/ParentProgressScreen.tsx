// src/screens/parent/ParentProgressScreen.tsx (Native)
import { ScrollView, Text } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
  onBack: () => void;
};

export function ParentProgressScreen({ onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Progress" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>
        Parent progress dashboard is currently available on web. Native port will come later.
      </Text>
    </ScrollView>
  );
}
