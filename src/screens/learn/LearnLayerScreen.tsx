// src/screens/learn/LearnLayerScreen.tsx
import type { ChildProfile } from '../../types';
import type { UnitGroupDef, UnitGroupId } from '../../tracks/beginnerTrack';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../i18n/I18nContext';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { PressableCard } from '../../ui/PressableCard';
import { Button } from '../../ui/Button';

import { ContentVisual } from '../../ui/ContentVisual';
import { getVisual } from '../../visuals/contentVisualRegistry';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        title={`${layerHeader} — ${layerTitle}`}
        onBack={onBack}
        dir={dir}
        backLabel={t('learn.common.backOk')}
      />

      <Text style={[styles.layerDesc, isRtl && styles.rtl]}>{layerDesc}</Text>

      {!vm.hasAnyGroups ? (
        <Card style={{ marginTop: 14 }}>
          <View style={styles.cardStack}>
            <Text style={[styles.title, isRtl && styles.rtl]}>
              {t('learn.groups.noUnitsYet')}
            </Text>
            <Text style={[styles.desc, isRtl && styles.rtl]}>
              {t('learn.layer.empty.noContent')}
            </Text>

            <View style={styles.actionsEnd}>
              <Button onClick={onBack}>{t('learn.common.backOk')}</Button>
            </View>
          </View>
        </Card>
      ) : (
        <View style={styles.stack}>
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

            const v = getVisual('pack', gvm.groupId);

            return (
              <PressableCard
                key={gvm.groupId}
                disabled={gvm.isLocked}
                onPress={() => {
                  if (!gvm.isLocked) onEnterGroup(gvm.groupId);
                }}
              >
                <View style={styles.cardRow}>
                  <ContentVisual
                    size={56}
                    image={v?.image}
                    emoji={v?.emoji ?? g.emoji}
                    label={title}
                  />

                  <View style={styles.cardStack}>
                    <Text style={[styles.title, isRtl && styles.rtl]}>
                      {statusLabel} {title}
                    </Text>

                  <Text style={[styles.meta, isRtl && styles.metaRtl]}>
                    {t('learn.groups.progressLabel')} {gvm.progressPct}% •{' '}
                    {gvm.completed}/{gvm.total}
                    {lockedSuffix}
                  </Text>

                  {desc && (
                    <Text style={[styles.desc, isRtl && styles.rtl]}>{desc}</Text>
                  )}

                    <View style={styles.actionsEnd}>
                      <Button
                        disabled={gvm.isLocked}
                        onClick={() => {
                          if (!gvm.isLocked) onEnterGroup(gvm.groupId);
                        }}
                      >
                        {gvm.isLocked
                          ? t('learn.groups.buttonLocked')
                          : t('learn.groups.buttonEnter')}
                      </Button>
                    </View>
                  </View>
                </View>
              </PressableCard>
            );
          })}
        </View>
      )}
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

  layerDesc: { marginTop: 10, opacity: 0.9 },

  stack: { marginTop: 14, gap: 12 },
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cardStack: { flex: 1, gap: 10 },

  title: { fontWeight: '900', fontSize: 16 },
  meta: { fontSize: 13, opacity: 0.85 },
  desc: { opacity: 0.9 },

  actionsEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },

  rtl: { textAlign: 'right' as const },
  metaRtl: { textAlign: 'right' as const, writingDirection: 'rtl' as const },
});
