// app/src/screens/parent/ParentHomeScreen.tsx (Native)
import { ScrollView, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';
import type { Locale } from '../../i18n/types';

type Props = {
  users: ChildProfile[];
  parentLocale: Locale;
  onChangeParentLocale: (loc: Locale) => void;
  onExit: () => void;
  onOpenProgress: () => void;
  onOpenChildSettings: () => void;
  onOpenUsers: () => void;
  onOpenParentPin: () => void;
  onOpenAudioSettings: () => void;
};

export function ParentHomeScreen({
  users,
  parentLocale,
  onChangeParentLocale,
  onExit,
  onOpenProgress,
  onOpenChildSettings,
  onOpenUsers,
  onOpenParentPin,
  onOpenAudioSettings,
}: Props) {
  const { t, dir } = useI18n();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 12,
      }}
    >
      <TopBar
        title={t('parent.home.title')}
        onBack={onExit}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: '800', textAlign: dir === 'rtl' ? 'right' : 'left' }}>
          {t('parent.home.childrenCount', { n: users.length })}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button
          variant={parentLocale === 'en' ? 'primary' : 'secondary'}
          onClick={() => onChangeParentLocale('en')}
        >
          EN
        </Button>
        <Button
          variant={parentLocale === 'he' ? 'primary' : 'secondary'}
          onClick={() => onChangeParentLocale('he')}
        >
          HE
        </Button>
      </View>

      <Button variant="primary" fullWidth onClick={onOpenProgress}>
        {t('parent.home.progressTitle')}
      </Button>

      <Button fullWidth onClick={onOpenChildSettings}>
        {t('parent.home.childSettingsTitle')}
      </Button>

      <Button fullWidth onClick={onOpenUsers}>
        {t('parent.home.usersTitle')}
      </Button>

      <Button fullWidth onClick={onOpenAudioSettings}>
        {t('parent.home.audioTitle')}
      </Button>

      <Button fullWidth onClick={onOpenParentPin}>
        {t('parent.home.pinTitle')}
      </Button>

      <Text
        style={{
          opacity: 0.6,
          fontSize: 12,
          textAlign: dir === 'rtl' ? 'right' : 'left',
        }}
      >
        {t('parent.home.nativeShellNote')}
      </Text>
    </ScrollView>
  );
}
