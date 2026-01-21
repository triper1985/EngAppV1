// src/screens/parent/ParentHomeScreen.tsx
import { ScrollView, Text, View, StyleSheet } from 'react-native';
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
  const isRtl = dir === 'rtl';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        title={t('parent.home.title')}
        onBack={onExit}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      {/* Header block */}
      <View style={styles.headerBlock}>
        <Text style={[styles.headerLine, isRtl && styles.rtlText]}>
          {t('parent.home.usersTitle')}: {users.length}
        </Text>

        <View style={styles.langBlock}>
          <Text style={[styles.langTitle, isRtl && styles.rtlText]}>
            {t('parent.home.languageTitle')}
          </Text>

          <View style={[styles.langRow, isRtl && styles.rowRtl]}>
            <View style={styles.langBtnWrap}>
              <Button
                variant={parentLocale === 'en' ? 'primary' : 'secondary'}
                onClick={() => onChangeParentLocale('en')}
              >
                {t('parent.home.language.en')}
              </Button>
            </View>

            <View style={styles.langBtnWrap}>
              <Button
                variant={parentLocale === 'he' ? 'primary' : 'secondary'}
                onClick={() => onChangeParentLocale('he')}
              >
                {t('parent.home.language.he')}
              </Button>
            </View>
          </View>
        </View>
      </View>

      {/* Main actions */}
      <View style={styles.actions}>
        <View style={styles.actionGap}>
          <Button variant="primary" fullWidth onClick={onOpenProgress}>
            {t('parent.home.progressTitle')}
          </Button>
        </View>

        <View style={styles.actionGap}>
          <Button fullWidth onClick={onOpenChildSettings}>
            {t('parent.home.childSettingsTitle')}
          </Button>
        </View>

        <View style={styles.actionGap}>
          <Button fullWidth onClick={onOpenUsers}>
            {t('parent.home.usersTitle')}
          </Button>
        </View>

        <View style={styles.actionGap}>
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

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28 },

  headerBlock: { marginTop: 14, alignItems: 'center' },
  headerLine: { fontWeight: '800' },

  langBlock: { marginTop: 14, alignItems: 'center' },
  langTitle: { fontWeight: '700' },

  langRow: { flexDirection: 'row', marginTop: 10 },
  rowRtl: { flexDirection: 'row-reverse' },

  langBtnWrap: { marginHorizontal: 6 },

  actions: { marginTop: 16 },
  actionGap: { marginBottom: 10 },

  rtlText: { textAlign: 'right' as const, writingDirection: 'rtl' as const },
});
