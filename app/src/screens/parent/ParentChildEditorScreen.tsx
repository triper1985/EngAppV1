// src/screens/parent/ParentChildEditorScreen.tsx (Native)
import { ScrollView, Text } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
  onUsersChanged: (next: ChildProfile[]) => void;
  onOpenChildAudio: () => void;
  onBack: () => void;
};

export function ParentChildEditorScreen({ onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Child settings" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>
        Child editor UI is currently available on web. Native port will come later.
      </Text>
    </ScrollView>
  );
}
