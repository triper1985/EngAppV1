// src/screens/learn/LearnHomeScreen.tsx
import type { ChildProfile } from '../../types';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const isRtl = dir === 'rtl';

  const vm = getLearnHomeVM_A({ child, maxLayer: 4 });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        title={t('learn.groups.title')}
        onBack={onBack}
        dir={dir}
        backLabel={t('learn.common.backOk')}
      />

      <Text style={[styles.subtitle, isRtl && styles.rtl]}>
        {t('learn.groups.subtitle')}
      </Text>

      <View style={styles.stack}>
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
              <View style={styles.cardStack}>
                <Text style={[styles.title, isRtl && styles.rtl]}>
                  {statusLabel} {header} — {t(layerTitleKey)}
                </Text>

                <Text style={[styles.meta, isRtl && styles.metaRtl]}>
                  {t('learn.groups.progressLabel')} {layer.progressPct}%
                </Text>

                <Text style={[styles.desc, isRtl && styles.rtl]}>
                  {t(layerDescKey)}
                </Text>

                {layer.isCurrent && (
                  <Text style={[styles.currentNote, isRtl && styles.metaRtl]}>
                    {t('learn.groups.currentLayer', {
                      layer: String(layerId),
                    })}
                  </Text>
                )}

                <View style={[styles.actions, isRtl && styles.rowRtl]}>
                  <Text style={[styles.lockedText, isRtl && styles.metaRtl]}>
                    {layer.isLocked
                      ? t('learn.groups.locked.layer', {
                          layer: String(layerId),
                        })
                      : ' '}
                  </Text>

                  <Button
                    disabled={layer.isLocked}
                    onClick={() => {
                      if (!layer.isLocked) onEnterLayer(layerId);
                    }}
                  >
                    {layer.isLocked
                      ? t('learn.groups.buttonLocked')
                      : t('learn.groups.buttonEnter')}
                  </Button>
                </View>
              </View>
            </Card>
          );
        })}
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

  subtitle: { marginTop: 10, opacity: 0.9 },

  stack: { marginTop: 14, gap: 12 },
  cardStack: { gap: 10 },

  title: { fontWeight: '900', fontSize: 16 },
  meta: { fontSize: 13, opacity: 0.85 },
  desc: { opacity: 0.9 },
  currentNote: { fontSize: 13, opacity: 0.85 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  lockedText: { fontSize: 13, opacity: 0.85 },

  rowRtl: { flexDirection: 'row-reverse' as const },

  rtl: { textAlign: 'right' as const },
  metaRtl: { textAlign: 'right' as const, writingDirection: 'rtl' as const },
});
