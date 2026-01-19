// app/src/screens/parent/ParentChildAudioSettingsScreen.tsx (Native)
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
  const { t, dir } = useI18n();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar
        title={t('parent.childAudio.title', { name: child.name })}
        onBack={onBack}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      <Text
        style={{
          opacity: 0.75,
          textAlign: dir === 'rtl' ? 'right' : 'left',
        }}
      >
        {t('parent.childAudio.nativeShellNote')}
      </Text>

      <Text
        style={{
          opacity: 0.6,
          textAlign: dir === 'rtl' ? 'right' : 'left',
        }}
      >
        {t('parent.progress.childLabel')} {child.name}
      </Text>
    </ScrollView>
  );
}
