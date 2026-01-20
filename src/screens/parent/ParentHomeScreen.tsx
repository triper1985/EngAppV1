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
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
      <TopBar
        title={t('parent.home.title')}
        onBack={onExit}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      {/* Centered header block */}
      <View style={{ marginTop: 14, alignItems: 'center' }}>
        <Text style={{ fontWeight: '800' }}>
          {t('parent.home.usersTitle')}: {users.length}
        </Text>

        <View style={{ marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontWeight: '700' }}>
            {t('parent.home.languageTitle')}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={{ marginEnd: 10 }}>
              <Button
                variant={parentLocale === 'en' ? 'primary' : 'secondary'}
                onClick={() => onChangeParentLocale('en')}
              >
                {t('parent.home.language.en')}
              </Button>
            </View>

            <Button
              variant={parentLocale === 'he' ? 'primary' : 'secondary'}
              onClick={() => onChangeParentLocale('he')}
            >
              {t('parent.home.language.he')}
            </Button>
          </View>
        </View>
      </View>

      {/* Main actions */}
      <View style={{ marginTop: 16 }}>
        <View style={{ marginBottom: 10 }}>
          <Button variant="primary" fullWidth onClick={onOpenProgress}>
            {t('parent.home.progressTitle')}
          </Button>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Button fullWidth onClick={onOpenChildSettings}>
            {t('parent.home.childSettingsTitle')}
          </Button>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Button fullWidth onClick={onOpenUsers}>
            {t('parent.home.usersTitle')}
          </Button>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Button fullWidth onClick={onOpenAudioSettings}>
            {t('parent.home.audioTitle')}
          </Button>
        </View>

        <Button fullWidth onClick={onOpenParentPin}>
          {t('parent.home.pinTitle')}
        </Button>
      </View>
    </ScrollView>
  );
}
