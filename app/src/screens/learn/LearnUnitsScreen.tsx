// src/screens/learn/LearnUnitsScreen.tsx
import { useMemo } from 'react';
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

  const { unlockedLayer } = getUnlockedLayerSnapshotA(child, 'A');

  const pack = getPackById(groupId as any);
  const packRequiredLayer = (pack?.policy?.minLayer ?? 0) as number;
  const packLockedByLayer = (unlockedLayer as number) < packRequiredLayer;

  function requiredLayerForUnit(u: UnitDef): number {
    const unitReq = (u as any).policy?.minLayer as number | undefined;
    if (typeof unitReq === 'number')
      return Math.max(packRequiredLayer, unitReq);
    return packRequiredLayer;
  }

  const prog = useMemo(() => getBeginnerProgress(child), [child]);
  const units = useMemo(() => getUnitsByGroup(groupId), [groupId]);

  const { toast, showToast } = useToast(1800);

  function unitTitle(u: UnitDef) {
    return u.titleKey ? t(u.titleKey) : u.title;
  }

  function unitMeta(u: UnitDef) {
    const s = getUnitStatus(u, prog);
    const lockedToday = isQuizLockedToday(child, u.id);
    return { ...s, lockedToday };
  }

  function learnButtonLabel(u: UnitDef) {
    const unitRequiredLayer = requiredLayerForUnit(u);
    const lockedByLayer = (unlockedLayer as number) < unitRequiredLayer;
    if (lockedByLayer) return t('learn.units.learn.lockedByLayer');
    const up = prog.units?.[u.id];
    const seenCount = up?.seenItemIds?.length ?? 0;
    const total = u.itemIds.length;

    if (seenCount === 0) return t('learn.units.learn.start');
    if (seenCount > 0 && seenCount < total)
      return t('learn.units.learn.continue');
    return t('learn.units.learn.review');
  }

  function quizButtonLabel(u: UnitDef) {
    const unitRequiredLayer = requiredLayerForUnit(u);
    const lockedByLayer = (unlockedLayer as number) < unitRequiredLayer;
    if (lockedByLayer)
      return t('learn.units.quiz.lockedByLayer', {
        layer: String(unitRequiredLayer),
      });
    const meta = unitMeta(u);

    if (meta.lockedToday) return t('learn.units.quiz.lockedToday');
    if (meta.status === 'locked') return t('learn.units.quiz.locked');
    if (meta.status === 'learn') return t('learn.units.quiz.finishLearnFirst');
    if (meta.status === 'quiz') return t('learn.units.quiz.start');
    return t('learn.units.quiz.retry');
  }

  function statusLine(u: UnitDef) {
    const unitRequiredLayer = requiredLayerForUnit(u);
    const lockedByLayer = (unlockedLayer as number) < unitRequiredLayer;
    if (lockedByLayer) {
      return t('learn.units.status.lockedByLayer', {
        layer: String(unitRequiredLayer),
      });
    }
    const meta = unitMeta(u);

    if (meta.status === 'locked') return t('learn.units.status.locked');
    if (meta.status === 'learn')
      return t('learn.units.status.learnProgress', {
        seen: String(meta.seenCount),
        total: String(meta.totalCount),
      });

    if (meta.status === 'quiz') {
      if (meta.lockedToday) return t('learn.units.status.quizLockedToday');
      return t('learn.units.status.readyForQuiz', {
        pass: String(QUIZ_PASS_SCORE),
      });
    }

    const best = meta.bestQuizScore ?? 0;
    return t('learn.units.status.completedBest', { best: String(best) });
  }

  function canStartQuiz(u: UnitDef) {
    const unitRequiredLayer = requiredLayerForUnit(u);
    const lockedByLayer = (unlockedLayer as number) < unitRequiredLayer;
    if (lockedByLayer) return false;
    const meta = unitMeta(u);
    if (meta.status === 'locked') return false;
    if (meta.lockedToday) return false;
    return meta.status === 'quiz' || meta.status === 'completed';
  }

  function canStartLearn(u: UnitDef) {
    const unitRequiredLayer = requiredLayerForUnit(u);
    const lockedByLayer = (unlockedLayer as number) < unitRequiredLayer;
    if (lockedByLayer) return false;
    const meta = unitMeta(u);
    return meta.status !== 'locked';
  }

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 820,
        margin: '0 auto',
        direction: dir,
        textAlign: dir === 'rtl' ? 'right' : 'left',
      }}
    >
      <TopBar title={t('learn.units.title')} onBack={onBack} />

      <div style={{ marginTop: 10, opacity: 0.8 }}>
        {t('learn.units.subtitle')}
      </div>

      {packLockedByLayer && (
        <div style={{ marginTop: 10 }}>
          <Card style={{ opacity: 0.9 }}>
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>
              <b>🔒 {t('learn.units.locked.layerTitle')}</b>
              <div style={{ marginTop: 6, opacity: 0.85 }}>
                {t('learn.units.locked.layerDesc', {
                  layer: String(packRequiredLayer),
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {toast && (
        <div style={{ fontSize: 16, marginTop: 10, minHeight: 22 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {units.map((u) => {
          const meta = unitMeta(u);
          const unitRequiredLayer = requiredLayerForUnit(u);
          const lockedByLayer = (unlockedLayer as number) < unitRequiredLayer;

          const learnDisabled = lockedByLayer || !canStartLearn(u);
          const quizDisabled = lockedByLayer || !canStartQuiz(u);

          return (
            <Card
              key={u.id}
              style={{
                opacity: lockedByLayer || meta.status === 'locked' ? 0.75 : 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>
                    {unitTitle(u)}
                  </div>

                  <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
                    {lockedByLayer
                      ? t('learn.units.status.lockedByLayer', {
                          layer: String(unitRequiredLayer),
                        })
                      : statusLine(u)}
                  </div>

                  {meta.lockedToday &&
                    (meta.status === 'quiz' || meta.status === 'completed') && (
                      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                        {t('learn.units.tipLockedToday')}
                      </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Button
                    disabled={learnDisabled}
                    onClick={() => {
                      if (learnDisabled) return;
                      onStartUnit(u.id);
                    }}
                    title={
                      lockedByLayer
                        ? t('learn.units.tooltip.lockedByLayer', {
                            layer: String(unitRequiredLayer),
                          })
                        : learnDisabled
                        ? t('learn.units.tooltip.learnLocked')
                        : undefined
                    }
                  >
                    {learnButtonLabel(u)}
                  </Button>

                  <Button
                    disabled={quizDisabled}
                    onClick={() => {
                      if (quizDisabled) {
                        if (lockedByLayer) {
                          showToast(
                            t('learn.units.toast.lockedByLayer', {
                              layer: String(unitRequiredLayer),
                            })
                          );
                          return;
                        }
                        if (meta.lockedToday) {
                          showToast(t('learn.units.toast.quizLockedToday'));
                        } else if (meta.status === 'learn') {
                          showToast(t('learn.units.toast.quizOpensAfterLearn'));
                        } else {
                          showToast(t('learn.units.toast.unitLocked'));
                        }
                        return;
                      }
                      onStartQuiz(u.id);
                    }}
                    title={
                      lockedByLayer
                        ? t('learn.units.tooltip.lockedByLayer', {
                            layer: String(unitRequiredLayer),
                          })
                        : quizDisabled && meta.lockedToday
                        ? t('learn.units.tooltip.quizDailyLimit')
                        : undefined
                    }
                  >
                    {quizButtonLabel(u)}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        {t('learn.common.childLabel')} <b>{child.name}</b>
      </div>
    </div>
  );
}
