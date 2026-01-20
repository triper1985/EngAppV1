// src/screens/learn/LearnUnitsScreen.tsx
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';

import {
  getUnitStatus,
  getUnitsByGroup,
  type UnitDef,
  type UnitId,
  type UnitGroupId,
  QUIZ_PASS_SCORE,
} from '../../tracks/beginnerTrack';

import {
  getBeginnerProgress,
  isQuizLockedToday,
} from '../../tracks/beginnerProgress';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/useToast';

import { useI18n } from '../../i18n/I18nContext';
import { getPackById } from '../../content/registry';
import { getUnlockedLayerSnapshotA } from '../../content/policy/levelA/unlock';

type Props = {
  child: ChildProfile;
  groupId: UnitGroupId;
  onBack: () => void;
  onStartUnit: (unitId: UnitId) => void;
  onStartQuiz: (unitId: UnitId) => void;
};

export function LearnUnitsScreen({
  child,
  groupId,
  onBack,
  onStartUnit,
  onStartQuiz,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const { unlockedLayer } = getUnlockedLayerSnapshotA(child, 'A');

  const pack = getPackById(groupId as any);
  const packRequiredLayer = (pack?.policy?.minLayer ?? 0) as number;
  const packLockedByLayer = (unlockedLayer as number) < packRequiredLayer;

  const prog = useMemo(() => getBeginnerProgress(child), [child]);
  const units = useMemo(() => getUnitsByGroup(groupId), [groupId]);

  const { toast, showToast } = useToast(1800);

  function requiredLayerForUnit(u: UnitDef): number {
    const unitReq = (u as any).policy?.minLayer as number | undefined;
    return Math.max(packRequiredLayer, unitReq ?? 0);
  }

  function unitMeta(u: UnitDef) {
    const s = getUnitStatus(u, prog);
    const lockedToday = isQuizLockedToday(child, u.id);
    return { ...s, lockedToday };
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar title={t('learn.units.title')} onBack={onBack} dir={dir} />

      <Text style={[styles.subtitle, isRtl && styles.rtl]}>
        {t('learn.units.subtitle')}
      </Text>

      {packLockedByLayer && (
        <View style={{ marginTop: 10 }}>
          <Card>
            <Text style={styles.lockTitle}>
              🔒 {t('learn.units.locked.layerTitle')}
            </Text>
            <Text style={styles.lockDesc}>
              {t('learn.units.locked.layerDesc', {
                layer: String(packRequiredLayer),
              })}
            </Text>
          </Card>
        </View>
      )}

      {!!toast && (
        <Text style={styles.toast}>{toast}</Text>
      )}

      <View style={styles.stack}>
        {units.map((u) => {
          const meta = unitMeta(u);
          const unitRequiredLayer = requiredLayerForUnit(u);
          const lockedByLayer = (unlockedLayer as number) < unitRequiredLayer;

          const learnDisabled = lockedByLayer || meta.status === 'locked';
          const quizDisabled =
            lockedByLayer ||
            meta.status === 'locked' ||
            meta.lockedToday ||
            meta.status === 'learn';

          return (
            <Card key={u.id} style={{ opacity: lockedByLayer ? 0.75 : 1 }}>
              <View style={styles.unitRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.unitTitle}>
                    {u.titleKey ? t(u.titleKey) : u.title}
                  </Text>

                  <Text style={styles.unitStatus}>
                    {lockedByLayer
                      ? t('learn.units.status.lockedByLayer', {
                          layer: String(unitRequiredLayer),
                        })
                      : meta.status === 'learn'
                      ? t('learn.units.status.learnProgress', {
                          seen: String(meta.seenCount),
                          total: String(meta.totalCount),
                        })
                      : meta.status === 'quiz'
                      ? t('learn.units.status.readyForQuiz', {
                          pass: String(QUIZ_PASS_SCORE),
                        })
                      : t('learn.units.status.completedBest', {
                          best: String(meta.bestQuizScore ?? 0),
                        })}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Button
                    disabled={learnDisabled}
                    onClick={() => !learnDisabled && onStartUnit(u.id)}
                  >
                    {learnDisabled
                      ? t('learn.units.learn.lockedByLayer')
                      : t('learn.units.learn.start')}
                  </Button>

                  <Button
                    disabled={quizDisabled}
                    onClick={() => {
                      if (quizDisabled) {
                        showToast(
                          meta.lockedToday
                            ? t('learn.units.toast.quizLockedToday')
                            : t('learn.units.toast.quizOpensAfterLearn')
                        );
                        return;
                      }
                      onStartQuiz(u.id);
                    }}
                  >
                    {quizDisabled
                      ? t('learn.units.quiz.locked')
                      : t('learn.units.quiz.start')}
                  </Button>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      <Text style={styles.childLabel}>
        {t('learn.common.childLabel')} <Text style={{ fontWeight: '900' }}>{child.name}</Text>
      </Text>
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
  subtitle: { marginTop: 10, opacity: 0.8 },
  stack: { marginTop: 14, gap: 10 },

  unitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  unitTitle: { fontSize: 18, fontWeight: '900' },
  unitStatus: { marginTop: 4, fontSize: 14, opacity: 0.8 },

  actions: { gap: 10 },

  lockTitle: { fontWeight: '900', fontSize: 14 },
  lockDesc: { marginTop: 6, opacity: 0.85 },

  toast: { marginTop: 10, fontSize: 16, minHeight: 22 },

  childLabel: { marginTop: 12, fontSize: 12, opacity: 0.7 },
  rtl: { textAlign: 'right' as const },
});
