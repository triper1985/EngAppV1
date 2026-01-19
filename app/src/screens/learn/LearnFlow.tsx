// src/screens/learn/LearnFlow.tsx (Native)
import { ScrollView, Text } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
};

export function LearnFlow({ child, onBack }: Props) {
  const { dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title="Learn" onBack={onBack} dir={dir} />
      <Text style={{ opacity: 0.75 }}>
        The learning flow is currently implemented for web. We'll port it to native next.
      </Text>
      <Text style={{ opacity: 0.6 }}>Active child: {child.name}</Text>
    </ScrollView>
  );
}
