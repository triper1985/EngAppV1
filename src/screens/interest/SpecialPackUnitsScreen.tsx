// src/screens/interest/SpecialPackUnitsScreen.tsx
import type { ChildProfile } from '../../types';
import type { ContentPackId, ContentGroupId } from '../../content/types';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { useI18n } from '../../i18n/I18nContext';
import { getGroupTitle, getPackTitle } from '../../content/localize';

import { getPackById } from '../../content/registry';
import { isPackUnlockedForChildA } from '../../content';

type Mode = 'learn' | 'quiz';

type Props = {
  child: ChildProfile; // future: progress/locking
  packId: ContentPackId;
  onBack: () => void;

  // V4: navigate to group details (Unit = Group)
  onOpenGroup: (groupId: ContentGroupId, mode: Mode) => void;
};

export function SpecialPackUnitsScreen({ child, packId, onBack, onOpenGroup }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const pack = getPackById(packId);
  const unlock = pack ? isPackUnlockedForChildA(child, pack) : null;
  const isLocked = unlock ? !unlock.unlocked : false;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        title={pack ? getPackTitle(pack, t) : t('specialPackUnits.packFallback')}
        onBack={onBack}
        backLabel={t('learn.common.back')}
        dir={dir}
      />

      <View style={styles.stack}>
        {!pack ? (
          <Card>
            <Text style={[styles.muted, isRtl && styles.rtl]}>{t('specialPackUnits.packNotFound')}</Text>
          </Card>
        ) : isLocked ? (
          <Card>
            <Text style={[styles.h2, isRtl && styles.rtl]}>{isRtl ? 'נעול עדיין' : 'Still locked'}</Text>
            <Text style={[styles.muted, styles.mt8, isRtl && styles.rtl]}>
              {isRtl
                ? `החבילה תיפתח משכבה ${unlock!.requiredLayer}. המשיכו ללמוד ביחידות הבסיס כדי לפתוח אותה.`
                : `This pack unlocks from layer ${unlock!.requiredLayer}. Keep learning core units to unlock it.`}
            </Text>
          </Card>
        ) : pack.groups.length === 0 ? (
          <Card>
            <Text style={[styles.muted, isRtl && styles.rtl]}>{t('specialPackUnits.noGroups')}</Text>
          </Card>
        ) : (
          pack.groups.map((g) => (
            <Card key={g.id}>
              <View style={[styles.row, isRtl && styles.rowRtl]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.h2, isRtl && styles.rtl]} numberOfLines={1}>
                    {getGroupTitle(g, t)}
                  </Text>
                  <Text style={[styles.meta, isRtl && styles.rtl]}>
                    {t('specialPackUnits.wordCount', { count: g.itemIds.length })}
                  </Text>
                </View>

                <View style={[styles.actions, isRtl && styles.rowRtl]}>
                  <Button variant="primary" onClick={() => onOpenGroup(g.id, 'learn')}>
                    {t('specialPackUnits.learn')}
                  </Button>
                  <Button onClick={() => onOpenGroup(g.id, 'quiz')}>{t('specialPackUnits.quiz')}</Button>
                </View>
              </View>
            </Card>
          ))
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

  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rowRtl: { flexDirection: 'row-reverse' as const },

  h2: { fontWeight: '900', fontSize: 16 },
  muted: { fontSize: 13, opacity: 0.8, lineHeight: 20 },
  meta: { marginTop: 6, fontSize: 13, opacity: 0.75 },

  actions: { gap: 10, alignItems: 'center', flexWrap: 'wrap' as const },
  rtl: { textAlign: 'right' as const },

  mt8: { marginTop: 8 },
});

export default SpecialPackUnitsScreen;
