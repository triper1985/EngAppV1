// src/screens/parent/ParentAudioSettingsScreen.tsx (Native)
import { ScrollView, Text } from 'react-native';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = { onBack: () => void };

export function ParentAudioSettingsScreen({ onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Audio settings" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>
        Parent audio defaults UI is currently available on web. Native port will come later.
      </Text>
    </ScrollView>
  );
}
