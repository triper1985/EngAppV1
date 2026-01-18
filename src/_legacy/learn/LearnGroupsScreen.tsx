// src/screens/learn/LearnGroupsScreen.tsx
import type { ChildProfile } from '../../types';

import {
  BEGINNER_GROUPS,
  getUnitsByGroup,
  getUnitStatus,
  type UnitGroupDef,
  type UnitGroupId,
} from '../../tracks/beginnerTrack';

import { getBeginnerProgress } from '../../tracks/beginnerProgress';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { useI18n } from '../../i18n/I18nContext';
import { getPackById } from '../../content/registry';
import { getUnlockedLayerSnapshotA } from '../../content/policy/levelA/unlock';

type Props = {
  child: ChildProfile;
  layer: number; // ✅ show only groups that belong to this layer
  onBack: () => void;
  onEnterGroup: (groupId: UnitGroupId) => void;
};

function groupTitle(
  g: UnitGroupDef,
  t: (key: string, vars?: Record<string, string>) => string
): string {
  return g.titleKey ? t(g.titleKey) : g.title;
}

function groupDesc(
  g: UnitGroupDef,
  t: (key: string, vars?: Record<string, string>) => string
): string | undefined {
  const d = g.descriptionKey ? t(g.descriptionKey) : g.description;
  return d || undefined;
}

function groupSummary(child: ChildProfile, g: UnitGroupDef) {
  const prog = getBeginnerProgress(child);
  const units = getUnitsByGroup(g.id);

  if (units.length === 0) {
    return {
      total: 0,
      completed: 0,
      anyOpen: false,
      lockedReasonKey: 'learn.groups.locked.noUnits',
    } as const;
  }

  let completed = 0;
  let anyOpen = false;

  for (const u of units) {
    const s = getUnitStatus(u, prog).status;
    if (s === 'completed') completed++;
    if (s !== 'locked') anyOpen = true;
  }

  const lockedReasonKey =
    !anyOpen && units[0] ? 'learn.groups.locked.prereq' : undefined;

  return {
    total: units.length,
    completed,
    anyOpen,
    lockedReasonKey,
  } as const;
}

function requiredLayerForGroup(g: UnitGroupDef): number {
  const pack = getPackById(g.id as any);
  return (pack?.policy?.minLayer as number | undefined) ?? 0;
}

export function LearnGroupsScreen({
  child,
  layer,
  onBack,
  onEnterGroup,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const { unlockedLayer } = getUnlockedLayerSnapshotA(child, 'A');

  // ✅ Filter only groups for this layer (V8 UX: layer screen shows its groups only)
  const groups = BEGINNER_GROUPS.filter(
    (g) => requiredLayerForGroup(g) === layer
  );

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 820,
        margin: '0 auto',
        direction: dir,
        textAlign: isRtl ? 'right' : 'left',
      }}
    >
      <TopBar title={t('learn.groups.title')} onBack={onBack} />

      <div style={{ marginTop: 10, opacity: 0.8 }}>
        {t('learn.groups.subtitle')}
      </div>

      {/* Optional: show which layer we are in */}
      <Card style={{ marginTop: 14, padding: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 900 }}>
          {t('learn.layer.header', { n: layer })}
        </div>
        <div style={{ marginTop: 4, fontSize: 13, opacity: 0.75 }}>
          {t(`learn.layer.${layer}.desc` as any)}
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {groups.length === 0 ? (
          <Card style={{ padding: 14, opacity: 0.8 }}>
            {t('learn.layer.empty.noContent')}
          </Card>
        ) : (
          groups.map((g) => {
            const requiredLayer = requiredLayerForGroup(g);
            const sum = groupSummary(child, g);

            const lockedByLayer = (unlockedLayer as number) < requiredLayer;

            // Unit-level hint: group may be open, but some units might unlock later.
            const units = getUnitsByGroup(g.id);
            let partialUnlockAt: number | null = null;
            if (!lockedByLayer && units.length > 0) {
              let maxRequired = requiredLayer;
              for (const u of units) {
                const uReq = Math.max(
                  requiredLayer,
                  (u.policy?.minLayer as unknown as number) ?? 0
                );
                if (uReq > maxRequired) maxRequired = uReq;
              }
              if ((unlockedLayer as number) < maxRequired) {
                partialUnlockAt = maxRequired;
              }
            }

            const lockedByPrereq = !sum.anyOpen;
            const locked = lockedByPrereq || lockedByLayer;

            const title = groupTitle(g, t);
            const desc = groupDesc(g, t);

            return (
              <Card
                key={g.id}
                style={{
                  opacity: locked ? 0.6 : 1,
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
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div style={{ fontSize: 34 }}>{g.emoji}</div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 900 }}>
                        {title}
                      </div>

                      {desc && (
                        <div
                          style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}
                        >
                          {desc}
                        </div>
                      )}

                      <div
                        style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}
                      >
                        {sum.total > 0 ? (
                          <>
                            {t('learn.groups.progressLabel')}{' '}
                            <b>{sum.completed}</b>/{sum.total}{' '}
                            {t('learn.groups.unitsLabel')}
                            {lockedByLayer
                              ? ` • 🔒 ${t('learn.groups.locked.layer', {
                                  layer: String(requiredLayer),
                                })}`
                              : partialUnlockAt != null
                              ? ` • ⏳ ${t('learn.groups.partial.layer', {
                                  layer: String(partialUnlockAt),
                                })}`
                              : lockedByPrereq && sum.lockedReasonKey
                              ? ` • 🔒 ${t(sum.lockedReasonKey)}`
                              : ''}
                          </>
                        ) : (
                          <span style={{ opacity: 0.7 }}>
                            {t('learn.groups.noUnitsYet')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    disabled={locked}
                    onClick={() => {
                      if (locked) return;
                      onEnterGroup(g.id);
                    }}
                  >
                    {locked
                      ? t('learn.groups.buttonLocked')
                      : t('learn.groups.buttonEnter')}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.65 }}>
        {t('learn.common.childLabel')} <b>{child.name}</b>
      </div>
    </div>
  );
}
