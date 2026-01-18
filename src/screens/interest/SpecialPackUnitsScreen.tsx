// src/screens/interest/SpecialPackUnitsScreen.tsx (Native)
import { ScrollView, Text } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  child: ChildProfile;
  packId: string | null;
  onBack: () => void;
  onOpenGroup: (groupId: string, mode: 'learn' | 'quiz') => void;
};

export function SpecialPackUnitsScreen({ onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Pack" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>
        This screen is currently available on web. Native port will come later.
      </Text>
    </ScrollView>
  );
}
