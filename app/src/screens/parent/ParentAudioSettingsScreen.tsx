// app/src/screens/parent/ParentAudioSettingsScreen.tsx (Native)
import { ScrollView, Text } from 'react-native';
import { TopBar } from '../../ui/TopBar';
import { useI18n } from '../../i18n/I18nContext';

type Props = { onBack: () => void };

export function ParentAudioSettingsScreen({ onBack }: Props) {
  const { t, dir } = useI18n();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar
        title={t('parent.audio.title')}
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
        {t('parent.audio.nativeShellNote')}
      </Text>
    </ScrollView>
  );
}
