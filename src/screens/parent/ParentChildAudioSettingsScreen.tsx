// src/screens/parent/ParentChildAudioSettingsScreen.tsx (Native)
import { ScrollView, Text } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
};

export function ParentChildAudioSettingsScreen({ child, onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Child Audio" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>
        Per-child audio overrides are currently editable on web. Native port will come later.
      </Text>
      <Text style={{ opacity: 0.6 }}>Child: {child.name}</Text>
    </ScrollView>
  );
}
