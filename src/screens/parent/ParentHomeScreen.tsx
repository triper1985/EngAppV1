// src/screens/parent/ParentHomeScreen.tsx (Native)
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
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title={t('parent.home.title') ?? 'Parent'} onBack={onExit} backLabel={t('parent.common.back') ?? 'Back'} dir={dir} />

      <View style={{ gap: 6 }}>
        <Text style={{ fontWeight: '800' }}>{t('parent.home.childrenCount') ?? 'Children'}: {users.length}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant={parentLocale === 'en' ? 'primary' : 'secondary'} onClick={() => onChangeParentLocale('en')}>EN</Button>
        <Button variant={parentLocale === 'he' ? 'primary' : 'secondary'} onClick={() => onChangeParentLocale('he')}>HE</Button>
      </View>

      <Button variant="primary" fullWidth onClick={onOpenProgress}>
        {t('parent.home.progress') ?? 'Progress'}
      </Button>
      <Button fullWidth onClick={onOpenChildSettings}>
        {t('parent.home.childSettings') ?? 'Child settings'}
      </Button>
      <Button fullWidth onClick={onOpenUsers}>
        {t('parent.home.manageChildren') ?? 'Manage children'}
      </Button>
      <Button fullWidth onClick={onOpenAudioSettings}>
        {t('parent.home.audio') ?? 'Audio settings'}
      </Button>
      <Button fullWidth onClick={onOpenParentPin}>
        {t('parent.home.pin') ?? 'Parent PIN'}
      </Button>

      <Text style={{ opacity: 0.6, fontSize: 12 }}>
        Note: The full parent UI is still available on web. This native screen is a minimal navigation shell.
      </Text>
    </ScrollView>
  );
}
