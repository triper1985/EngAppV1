// src/screens/interest/SpecialPackUnitScreen.tsx
import { useMemo, useState } from 'react';
import type { ChildProfile } from '../../types';
import type { ContentPackId, ContentGroupId } from '../../content/types';
import { StyleSheet, Text, View } from 'react-native';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';

import { getPackById } from '../../content/registry';
import { isPackUnlockedForChildA } from '../../content';
import { useI18n } from '../../i18n/I18nContext';
import { getPackTitle } from '../../content/localize';

// ✅ reuse real learn/practice/quiz screens
import type { UnitId } from '../../tracks/beginnerTrack';
import { BEGINNER_UNITS } from '../../tracks/beginnerTrack';
import { UnitLearnScreen } from '../learn/UnitLearnScreen';
import { UnitQuizScreen } from '../learn/UnitQuizScreen';
import { UnitPracticeScreen } from '../learn/UnitPracticeScreen';

type Mode = 'learn' | 'quiz';

type Props = {
  child: ChildProfile;
  packId: ContentPackId;
  groupId: ContentGroupId;
  mode: Mode;
  onBack: () => void;

  // optional: allow parent App to keep activeChild in sync
  onChildUpdated?: (updated: ChildProfile) => void;
};

type InternalView = 'learn' | 'quiz' | 'practice';

export function SpecialPackUnitScreen({
  child,
  packId,
  groupId,
  mode,
  onBack,
  onChildUpdated,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const pack = getPackById(packId);
  const unlock = pack ? isPackUnlockedForChildA(child, pack) : null;
  const isLocked = unlock ? !unlock.unlocked : false;
  const group = pack?.groups.find((g) => g.id === groupId);

  // ✅ In our beginner bridge adapter, UnitId === groupId
  const unitId: UnitId = groupId as unknown as UnitId;

  const hasUnit = useMemo(() => BEGINNER_UNITS.some((u) => u.id === unitId), [unitId]);

  const [view, setView] = useState<InternalView>(mode === 'quiz' ? 'quiz' : 'learn');
  const [retryKey, setRetryKey] = useState(0);

  // fallback updater (if App didn't pass one)
  const handleChildUpdated = (updated: ChildProfile) => {
    onChildUpdated?.(updated);
    // NOTE: if onChildUpdated is not passed, Learn/Quiz still persist via ChildrenStore internally.
  };

  if (!pack) {
    return (
      <View style={styles.container}>
        <TopBar
          title={t('specialPackUnits.packFallback')}
          onBack={onBack}
          backLabel={t('learn.common.back')}
          dir={dir}
        />
        <View style={styles.stack}>
          <Card>
            <Text style={[styles.muted, isRtl && styles.rtl]}>{t('specialPackUnits.packNotFound')}</Text>
          </Card>
        </View>
      </View>
    );
  }

  // For error/locked states we keep a light wrapper with a single TopBar.
  if (isLocked || !group || !hasUnit) {
    const title = pack ? getPackTitle(pack, t) : t('specialPackUnits.packFallback');

    return (
      <View style={styles.container}>
        <TopBar title={title} onBack={onBack} backLabel={t('learn.common.back')} dir={dir} />
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
          ) : !group ? (
            <Card>
              <Text style={[styles.muted, isRtl && styles.rtl]}>{t('specialPackUnits.noGroups')}</Text>
            </Card>
          ) : (
            <Card>
              <Text style={[styles.h2, isRtl && styles.rtl]}>
                {isRtl ? 'אין יחידה זמינה עדיין' : 'Unit not available yet'}
              </Text>
              <Text style={[styles.muted, styles.mt8, isRtl && styles.rtl]}>
                {isRtl
                  ? 'החבילה קיימת, אבל לא מחוברת למסלול Beginner. ודא שב־meta.tags יש beginnerBridge.'
                  : 'This pack exists, but is not wired into the Beginner track. Ensure meta.tags includes beginnerBridge.'}
              </Text>
            </Card>
          )}
        </View>
      </View>
    );
  }

  // ✅ Router-only: use the real Learn/Quiz/Practice screens directly.
  // They already own TopBar/ScrollView, so we avoid nested headers & scrolling.
  if (view === 'learn') {
    return (
      <UnitLearnScreen
        child={child}
        unitId={unitId}
        onBack={onBack}
        onChildUpdated={handleChildUpdated}
        onStartQuiz={() => setView('quiz')}
      />
    );
  }

  if (view === 'quiz') {
    return (
      <UnitQuizScreen
        key={`${unitId}:${retryKey}`}
        child={child}
        unitId={unitId}
        onBack={onBack}
        onChildUpdated={handleChildUpdated}
        onStartPractice={() => setView('practice')}
        onRetryQuiz={() => setRetryKey((k) => k + 1)}
      />
    );
  }

  return (
    <UnitPracticeScreen
      child={child}
      unitId={unitId}
      onBack={() => setView('quiz')}
      onStartQuiz={() => setView('quiz')}
    />
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
  muted: { fontSize: 13, opacity: 0.8, lineHeight: 20 },
  rtl: { textAlign: 'right' as const },

  mt8: { marginTop: 8 },
});

export default SpecialPackUnitScreen;
