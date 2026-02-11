// src/screens/parent/ParentHomeScreen.tsx
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';
import type { Locale } from '../../i18n/types';
import { syncAllSafe } from '../../data/sync/syncAllSafe';
import { logout } from '../../screens/auth/authApi';
import { syncPushNewChildren } from '../../data/sync/syncPushNewChildren';
import { syncPushDeletedChildren } from '../../data/sync/syncPushDeletedChildren';

type Props = {
  users: ChildProfile[];
  parentLocale: Locale;
  parentEmail?: string;
  onChangeParentLocale: (loc: Locale) => void;
  onExit: () => void;
  onOpenProgress: () => void;
  onOpenChildSettings: () => void;
  onOpenUsers: () => void;
  onOpenParentPin: () => void;
  parentId: string;
  onOpenAudioSettings: () => void;
};

export function ParentHomeScreen({
  users,
  parentLocale,
  parentEmail,
  onChangeParentLocale,
  onExit,
  onOpenProgress,
  onOpenChildSettings,
  onOpenUsers,
  onOpenParentPin,
  parentId,
  onOpenAudioSettings,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

async function onLogout() {
  try {
    console.log('[SYNC] before parent logout (button)');
    await syncAllSafe('manual');
    // 🔥 דוחף ילדים שנוצרו מאז ה־PIN האחרון
    await syncPushNewChildren({ parentId });
    await syncPushDeletedChildren({ parentId });
    console.log('[SYNC] done before parent logout');
    await logout(); // supabase.signOut
    // ❌ לא קוראים פה setScreen
    // ❌ לא מנסים "לעזור"
  } catch (e) {
    console.error('[AUTH][LOGOUT] failed', e);
  }
}

function emailPrefix(email?: string) {
  if (!email) return null;
  return email.split('@')[0];
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        title={t('parent.home.title')}
        onBack={onExit}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      
      {parentEmail ? (
        <Text style={{ opacity: 0.7, marginTop: 4 }}>
          הורה מחובר: {emailPrefix(parentEmail)}
        </Text>
      ) : null}

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

  <View style={styles.actionGap}>
    <Button fullWidth onClick={onOpenParentPin}>
      {t('parent.home.pinTitle')}
    </Button>
  </View>

  <View style={styles.actionGap}>
    <Button
      fullWidth
      variant="secondary"
      onClick={onLogout}
    >
      Logout (Parent)
    </Button>
  </View>
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
