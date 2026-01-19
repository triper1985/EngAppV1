// src/screens/learn/LearnHomeScreen.tsx
import type { ChildProfile } from '../../types';

import { useI18n } from '../../i18n/I18nContext';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { getLearnHomeVM_A } from './learnNavigationA';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onEnterLayer: (layerId: number) => void;
};

export function LearnHomeScreen({ child, onBack, onEnterLayer }: Props) {
  const { t, dir } = useI18n();

  const vm = getLearnHomeVM_A({ child, maxLayer: 4 });

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
      <TopBar
        title={t('learn.groups.title')}
        onBack={onBack}
        dir={dir}
        backLabel={t('learn.common.backOk')}
      />

      <div style={{ marginTop: 10, opacity: 0.9 }}>
        {t('learn.groups.subtitle')}
      </div>

      <div style={{ marginTop: 14, display: 'grid', gap: 12 }}>
        {vm.layers.map((layer) => {
          const layerId = layer.layerId;

          const header = t('learn.layer.header', { n: String(layerId) });
          const layerTitleKey = `learn.layer.${layerId}.title`;
          const layerDescKey = `learn.layer.${layerId}.desc`;

          const statusLabel = layer.isLocked
            ? '🔒'
            : layer.isDone
            ? '✅'
            : layer.isCurrent
            ? '⭐'
            : '•';

          return (
            <Card key={layerId}>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 900, fontSize: 16 }}>
                  {statusLabel} {header} — {t(layerTitleKey)}
                </div>

                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  {t('learn.groups.progressLabel')} {layer.progressPct}%
                </div>

                <div style={{ opacity: 0.9 }}>{t(layerDescKey)}</div>

                {layer.isCurrent ? (
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    {t('learn.groups.currentLayer', { layer: String(layerId) })}
                  </div>
                ) : null}

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    {layer.isLocked
                      ? t('learn.groups.locked.layer', {
                          layer: String(layerId),
                        })
                      : ' '}
                  </div>

                  <Button
                    disabled={layer.isLocked}
                    onClick={() => {
                      if (layer.isLocked) return;
                      onEnterLayer(layerId);
                    }}
                  >
                    {layer.isLocked
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
