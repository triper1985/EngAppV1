// src/screens/interest/SpecialPackUnitScreen.tsx
import type { ChildProfile } from '../../types';
import type { ContentPackId, ContentGroupId } from '../../content/types';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';

import { getPackById } from '../../content/registry';
import { isPackUnlockedForChildA } from '../../content';
import { useI18n } from '../../i18n/I18nContext';
import { getGroupTitle, getPackTitle } from '../../content/localize';

type Mode = 'learn' | 'quiz';

type Props = {
  child: ChildProfile; // future: progress/locking
  packId: ContentPackId;
  groupId: ContentGroupId;
  mode: Mode;

  onBack: () => void;
};

export function SpecialPackUnitScreen({ child, packId, groupId, mode, onBack }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const pack = getPackById(packId);
  const unlock = pack ? isPackUnlockedForChildA(child, pack) : null;
  const isLocked = unlock ? !unlock.unlocked : false;
  const group = pack?.groups.find((g) => g.id === groupId);

  const itemCount = group?.itemIds.length ?? 0;

  const title = `${pack ? getPackTitle(pack, t) : t('specialPackUnits.packFallback')} • ${
    group ? getGroupTitle(group, t) : t('specialPackUnits.title')
  }`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar title={title} onBack={onBack} dir={dir} />

      <View style={styles.stack}>
        {isLocked ? (
          <Card>
            <Text style={[styles.h2, isRtl && styles.rtl]}>{isRtl ? 'נעול עדיין' : 'Still locked'}</Text>
            <Text style={[styles.muted, styles.mt8, isRtl && styles.rtl]}>
              {isRtl
                ? `החבילה תיפתח משכבה ${unlock!.requiredLayer}. המשיכו ללמוד ביחידות הבסיס כדי לפתוח אותה.`
                : `This pack unlocks from layer ${unlock!.requiredLayer}. Keep learning core units to unlock it.`}
            </Text>
          </Card>
        ) : (
          <>
            <Card>
              <Text style={[styles.title, isRtl && styles.rtl]}>
                {mode === 'learn' ? t('specialPackUnit.titleLearn') : t('specialPackUnit.titleQuiz')}
              </Text>
              <Text style={[styles.muted, styles.mt6, isRtl && styles.rtl]}>
                {t('specialPackUnit.wordsInGroup', { count: itemCount })}
              </Text>
            </Card>

            <Card>
              <Text style={[styles.muted, isRtl && styles.rtl]}>{t('specialPackUnit.v4NavOnly')}</Text>
              <Text style={[styles.muted, styles.mt6, isRtl && styles.rtl]}>{t('specialPackUnit.futureReal')}</Text>

              <View style={styles.soonBox}>
                <Text style={[styles.soonText, isRtl && styles.rtl]}>
                  {t('specialPackUnit.soonHere', {
                    mode: mode === 'learn' ? t('specialPackUnits.learn') : t('specialPackUnits.quiz'),
                  })}
                </Text>
              </View>
            </Card>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 26,
    maxWidth: 820,
    alignSelf: 'center',
    width: '100%',
  },
  stack: { marginTop: 14, gap: 10 },

  h2: { fontWeight: '900', fontSize: 16 },
  title: { fontWeight: '900', fontSize: 18 },

  muted: { fontSize: 13, opacity: 0.8, lineHeight: 20 },
  rtl: { textAlign: 'right' as const },

  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },

  soonBox: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  soonText: { fontSize: 13, opacity: 0.85, lineHeight: 20 },
});
