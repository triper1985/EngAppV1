// src/screens/learn/LearnLayerScreen.tsx
import type { ChildProfile } from '../../types';

import type { UnitGroupDef, UnitGroupId } from '../../tracks/beginnerTrack';

import { useI18n } from '../../i18n/I18nContext';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { getLearnLayerVM_A } from './learnNavigationA';

type Props = {
  child: ChildProfile;
  layerId: number;
  onBack: () => void;
  onEnterGroup: (groupId: UnitGroupId) => void;
};

function groupTitle(
  g: UnitGroupDef,
  t: (key: string, vars?: Record<string, string>) => string
) {
  return g.titleKey ? t(g.titleKey) : g.title;
}

function groupDesc(
  g: UnitGroupDef,
  t: (key: string, vars?: Record<string, string>) => string
) {
  const d = g.descriptionKey ? t(g.descriptionKey) : g.description;
  return d || undefined;
}

export function LearnLayerScreen({
  child,
  layerId,
  onBack,
  onEnterGroup,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const layerHeader = t('learn.layer.header', { n: String(layerId) });
  const layerTitle = t(`learn.layer.${layerId}.title` as any);
  const layerDesc = t(`learn.layer.${layerId}.desc` as any);

  const vm = getLearnLayerVM_A({ child, layerId });

  if (!vm.hasAnyGroups) {
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
        <TopBar
          title={`${layerHeader} — ${layerTitle}`}
          onBack={onBack}
          dir={dir}
          backLabel={t('learn.common.backOk')}
        />

        <div style={{ marginTop: 10, opacity: 0.9 }}>{layerDesc}</div>

        <div style={{ marginTop: 14 }}>
          <Card>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>
                {t('learn.groups.noUnitsYet')}
              </div>

              <div style={{ opacity: 0.9 }}>
                {t('learn.layer.empty.noContent')}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onBack}>{t('learn.common.backOk')}</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
      <TopBar
        title={`${layerHeader} — ${layerTitle}`}
        onBack={onBack}
        dir={dir}
        backLabel={t('learn.common.backOk')}
      />

      <div style={{ marginTop: 10, opacity: 0.9 }}>{layerDesc}</div>

      <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
        {vm.groups.map((gvm) => {
          const g = gvm.group;

          const statusLabel = gvm.isLocked
            ? '🔒'
            : gvm.isDone
            ? '✅'
            : gvm.isCurrentLayer
            ? '⭐'
            : '•';

          const lockedSuffix = gvm.lockedSuffixKey
            ? ` • ${t(gvm.lockedSuffixKey, gvm.lockedSuffixVars)}`
            : '';

          const title = groupTitle(g, t);
          const desc = groupDesc(g, t);

          return (
            <Card key={gvm.groupId}>
              <div style={{ display: 'grid', gap: 10 }}>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    justifyContent: isRtl ? 'flex-end' : 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>{statusLabel}</span>
                  {g.emoji ? (
                    <span style={{ fontSize: 18 }}>{g.emoji}</span>
                  ) : null}
                  <span>{title}</span>
                </div>

                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  {t('learn.groups.progressLabel')} {gvm.progressPct}% •{' '}
                  {gvm.completed}/{gvm.total}
                  {lockedSuffix}
                </div>

                {desc ? <div style={{ opacity: 0.9 }}>{desc}</div> : null}

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    disabled={gvm.isLocked}
                    onClick={() => {
                      if (gvm.isLocked) return;
                      onEnterGroup(gvm.groupId);
                    }}
                  >
                    {gvm.isLocked
                      ? t('learn.groups.buttonLocked')
                      : t('learn.groups.buttonEnter')}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
