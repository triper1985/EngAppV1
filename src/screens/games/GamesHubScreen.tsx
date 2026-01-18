// src/screens/games/GamesHubScreen.tsx (Native)
import { ScrollView, Text } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = { child: ChildProfile; onBack: () => void };

export function GamesHubScreen({ child, onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Games" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>
        Games hub UI is currently available on web. Native port will come later.
      </Text>
      <Text style={{ opacity: 0.6 }}>Active child: {child.name}</Text>
    </ScrollView>
  );
}
