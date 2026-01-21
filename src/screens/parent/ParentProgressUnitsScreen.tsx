// src/screens/parent/ParentProgressUnitsScreen.tsx
import { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ChildProfile } from '../../types';

import {
  getUnitsByGroup,
  getUnitStatus,
  type UnitDef,
  type UnitGroupId,
  QUIZ_PASS_SCORE,
} from '../../tracks/beginnerTrack';

import {
  getQuizAttemptsToday,
  isQuizLockedToday,
  parentResetQuizAttemptsToday,
  parentUnlockQuizToday,
  getBeginnerProgress,
} from '../../tracks/beginnerProgress';

import { ChildrenStore } from '../../storage/childrenStore';
import { ParentReport } from '../../parentReport';
import { useI18n } from '../../i18n/I18nContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

type Props = {
  child: ChildProfile; // required
  groupId: UnitGroupId;
  onBackToGroups: () => void;
  onToast?: (msg: string) => void;
  onRefreshUsers: () => void;
};

export function ParentProgressUnitsScreen({
  child,
  groupId,
  onBackToGroups,
  onToast,
  onRefreshUsers,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const textAlign = isRtl ? 'right' : 'left';

  const [busy, setBusy] = useState(false);

  // runtime guard (extra safety)
  if (!child) {
    return (
      <View style={{ marginTop: 14 }}>
        <Text style={[styles.dim, { textAlign }]}>{t('parent.progress.noChildSelected')}</Text>
      </View>
    );
  }

  const units = useMemo(() => getUnitsByGroup(groupId), [groupId]);

  function toast(msg: string) {
    onToast?.(msg);
  }

  function freshChild(): ChildProfile {
    return ChildrenStore.getById(child.id) ?? child;
  }

  function unitTitle(u: UnitDef) {
    if (!u.titleKey) return u.title;
    const translated = t(u.titleKey);
    return translated === u.titleKey ? u.title : translated;
  }

  function statusLabel(c: ChildProfile, u: UnitDef) {
    const prog = getBeginnerProgress(c);
    const s = getUnitStatus(u, prog);

    if (s.status === 'locked') return t('parent.progress.units.status.locked');

    if (s.status === 'learn') {
      return t('parent.progress.units.status.learn', {
        seen: String(s.seenCount),
        total: String(s.totalCount),
      });
    }

    if (s.status === 'quiz') {
      return t('parent.progress.units.status.quizReady', {
        seen: String(s.seenCount),
        total: String(s.totalCount),
      });
    }

    return t('parent.progress.units.status.completed', {
      best: String(s.bestQuizScore ?? 0),
    });
  }

  function resetAll() {
    setBusy(true);
    try {
      ParentReport.resetAllForChild(child.id);
      toast(t('parent.progress.units.toast.resetAllDone'));
      onRefreshUsers();
    } finally {
      setBusy(false);
    }
  }

  function unlockQuizToday(u: UnitDef) {
    setBusy(true);
    try {
      const c = freshChild();
      parentUnlockQuizToday(c, u.id);
      toast(t('parent.progress.units.toast.unlockedQuizToday'));
      onRefreshUsers();
    } finally {
      setBusy(false);
    }
  }

  function resetAttemptsToday(u: UnitDef) {
    setBusy(true);
    try {
      const c = freshChild();
      parentResetQuizAttemptsToday(c, u.id);
      toast(t('parent.progress.units.toast.resetAttemptsToday'));
      onRefreshUsers();
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ marginTop: 14 }}>
      {/* Top actions row */}
      <View style={[styles.topRow, isRtl && styles.rowRtl]}>
        <View style={styles.btnWrap}>
          <Button onClick={onBackToGroups} disabled={busy}>
            {t('parent.progress.units.backToGroups')}
          </Button>
        </View>

        <View style={styles.btnWrap}>
          <Button variant="secondary" onClick={resetAll} disabled={busy}>
            {t('parent.progress.units.resetAll')}
          </Button>
        </View>
      </View>

      <Text style={[styles.policyLine, { textAlign }]}>
        {t('parent.progress.units.passInfo', { pass: String(QUIZ_PASS_SCORE) })}
      </Text>

      {units.map((u) => {
        const c = child; // snapshot
        const prog = getBeginnerProgress(c);
        const st = getUnitStatus(u, prog).status;

        const attempts = getQuizAttemptsToday(c, u.id);
        const lockedToday = isQuizLockedToday(c, u.id);

        const showActions = st === 'quiz' || st === 'completed' || lockedToday;

        return (
          <View key={u.id} style={{ marginBottom: 10 }}>
            <Card>
              <View>
                <Text
                  style={[styles.unitTitle, { textAlign }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {unitTitle(u)}
                </Text>

                <Text style={[styles.unitMeta, { textAlign }]}>
                  {statusLabel(c, u)}
                  {showActions ? (
                    <>
                      {' '}•{' '}
                      {t('parent.progress.units.attemptsToday', { n: String(attempts) })}
                      {lockedToday ? ` • ${t('parent.progress.units.lockedToday')}` : ''}
                    </>
                  ) : null}
                </Text>

                {/* Action row */}
                <View style={[styles.actionsRow, isRtl && styles.rowRtl]}>
                  {showActions ? (
                    <>
                      <View style={styles.btnWrap}>
                        <Button
                          variant="secondary"
                          onClick={() => unlockQuizToday(u)}
                          disabled={busy}
                        >
                          {t('parent.progress.units.unlockQuizToday')}
                        </Button>
                      </View>

                      <View style={styles.btnWrap}>
                        <Button
                          variant="secondary"
                          onClick={() => resetAttemptsToday(u)}
                          disabled={busy}
                        >
                          {t('parent.progress.units.resetAttemptsToday')}
                        </Button>
                      </View>
                    </>
                  ) : (
                    <Text style={[styles.noActions, { textAlign }]}>
                      {t('parent.progress.units.noActions')}
                    </Text>
                  )}
                </View>
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dim: { opacity: 0.75 },

  rowRtl: { flexDirection: 'row-reverse' },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },

  // wrapper that creates consistent spacing even with row-reverse + wrap
  btnWrap: {
    marginHorizontal: 6,
    marginBottom: 8,
  },

  policyLine: {
    fontSize: 13,
    opacity: 0.75,
    marginBottom: 10,
  },

  unitTitle: { fontWeight: '900' },

  unitMeta: {
    fontSize: 13,
    opacity: 0.82,
    marginTop: 4,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  noActions: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 6,
  },
});
