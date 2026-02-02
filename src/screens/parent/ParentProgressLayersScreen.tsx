// src/screens/parent/ParentProgressLayersScreen.tsx
import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ChildProfile } from '../../types';

import type { LevelLayer } from '../../content/types';
import { getPackById } from '../../content/registry';

import {
  BEGINNER_GROUPS,
  getUnitsByGroup,
  getUnitStatus,
  type UnitGroupDef,
} from '../../tracks/beginnerTrack';
import { getBeginnerProgress } from '../../tracks/beginnerProgress';

import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ContentVisual } from '../../ui/ContentVisual';
import { useI18n } from '../../i18n/I18nContext';
import { getVisual } from '../../visuals/contentVisualRegistry';

type Props = {
  child: ChildProfile;
  currentLayer: LevelLayer | null;
  onOpenLayer: (layer: LevelLayer) => void;
  onOpenInterest: () => void;
};

function layerName(t: (k: string, vars?: any) => string, layer: LevelLayer): string {
  const key = `beginner.layer.${layer}.title`;
  const translated = t(key);
  if (translated !== key) return translated;
  return t('parent.progress.layers.layerTitle', { layer: String(layer) });
}

function clampLayer(n: number): LevelLayer {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  return 4;
}

function groupTitle(t: (k: string, vars?: any) => string, g: UnitGroupDef): string {
  if (!g.titleKey) return g.title;
  const translated = t(g.titleKey);
  return translated === g.titleKey ? g.title : translated;
}

function pct(total: number, done: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

export function ParentProgressLayersScreen({
  child,
  currentLayer,
  onOpenLayer,
  onOpenInterest,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const textAlign = isRtl ? 'right' : 'left';

  const prog = useMemo(() => getBeginnerProgress(child), [child]);

  const coreGroups = useMemo(() => {
    return BEGINNER_GROUPS.filter((g) => {
      const pack = getPackById(g.id as any);
      if (!pack) return false;
      const type = pack.policy?.packType;
      return !type || type === 'core';
    });
  }, []);

  const interestGroupsCount = useMemo(() => {
    return BEGINNER_GROUPS.filter((g) => {
      const pack = getPackById(g.id as any);
      if (!pack) return false;
      return pack.policy?.packType && pack.policy.packType !== 'core';
    }).length;
  }, []);

  const layerCards = useMemo(() => {
    const out: {
      layer: LevelLayer;
      groups: UnitGroupDef[];
      totalUnits: number;
      completedUnits: number;
    }[] = [];

    for (let l = 0; l <= 4; l++) {
      const layer = clampLayer(l);
      const groups = coreGroups.filter((g) => {
        const pack = getPackById(g.id as any);
        const req = clampLayer((pack?.policy?.minLayer as number | undefined) ?? 0);
        return req === layer;
      });

      let totalUnits = 0;
      let completedUnits = 0;

      for (const g of groups) {
        const units = getUnitsByGroup(g.id);
        totalUnits += units.length;
        for (const u of units) {
          if (getUnitStatus(u, prog).status === 'completed') completedUnits += 1;
        }
      }

      out.push({ layer, groups, totalUnits, completedUnits });
    }

    return out;
  }, [coreGroups, prog]);

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[styles.sectionTitle, { textAlign }]}>{t('parent.progress.layers.title')}</Text>

      {layerCards.map((c) => {
        const p = pct(c.totalUnits, c.completedUnits);
        const subtitle =
          c.groups.length === 0
            ? t('parent.progress.layers.emptyLayer')
            : t('parent.progress.layers.summary', {
                groups: String(c.groups.length),
                done: String(c.completedUnits),
                total: String(c.totalUnits),
                pct: String(p),
              });

        const locked = currentLayer !== null ? c.layer > clampLayer(currentLayer) : false;
        const isCurrent = currentLayer !== null ? c.layer === clampLayer(currentLayer) : false;
        const isCompleted = p >= 100 && c.totalUnits > 0;
        const isInProgress = p > 0 && p < 100;

        const vis = getVisual('layer', `layer${c.layer}`);

        return (
          <View key={c.layer} style={{ marginBottom: 10 }}>
            <Card style={[locked ? styles.cardLocked : null, isCurrent ? styles.cardCurrent : null]}>
              <View style={[styles.row, isRtl && styles.rowRtl]}>
                <ContentVisual
                  size={56}
                  radius={18}
                  image={vis?.image}
                  emoji={vis?.emoji}
                  label={layerName(t, c.layer)}
                />

                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={[styles.titleRow, isRtl && styles.titleRowRtl]}>
                    <Text style={[styles.layerTitle, { textAlign }]}>
                      {layerName(t, c.layer)}
                    </Text>

                    {locked ? (
                      <Text style={[styles.badge, styles.badgeLocked]}>{'🔒'}</Text>
                    ) : isCompleted ? (
                      <Text style={[styles.badge, styles.badgeDone]}>{'✅'}</Text>
                    ) : isInProgress ? (
                      <Text style={[styles.badge, styles.badgeProgress]}>{'⏳'}</Text>
                    ) : null}
                  </View>

                  <Text style={[styles.layerSub, { textAlign }]}>{subtitle}</Text>

                  {isInProgress ? (
                    <View style={styles.progressOuter}>
                      <View style={[styles.progressInner, { width: `${p}%` }]} />
                    </View>
                  ) : null}

                  {c.groups.length > 0 ? (
                    <Text style={[styles.layerPacks, { textAlign }]} numberOfLines={2} ellipsizeMode="tail">
                      {c.groups
                        .slice(0, 4)
                        .map((g) => groupTitle(t, g))
                        .join(', ')}
                      {c.groups.length > 4 ? '…' : ''}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Button disabled={locked} onClick={() => onOpenLayer(c.layer)}>
                  {t('parent.common.open')}
                </Button>
              </View>
            </Card>
          </View>
        );
      })}

      <View style={{ marginTop: 14 }}>
        <Card>
          <Text style={[styles.interestTitle, { textAlign }]}>{t('parent.progress.layers.interestTitle')}</Text>
          <Text style={[styles.layerSub, { textAlign }]}>
            {t('parent.progress.layers.interestSubtitle', { count: String(interestGroupsCount) })}
          </Text>
          <View style={{ marginTop: 10 }}>
            <Button onClick={onOpenInterest}>{t('parent.progress.layers.openInterest')}</Button>
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontWeight: '900', fontSize: 16, marginBottom: 10 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowRtl: { flexDirection: 'row-reverse' },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleRowRtl: { flexDirection: 'row-reverse' },

  layerTitle: { fontWeight: '900', fontSize: 15 },
  layerSub: { fontSize: 12, opacity: 0.75, marginTop: 4 },
  layerPacks: { fontSize: 12, opacity: 0.75, marginTop: 6 },

  interestTitle: { fontWeight: '900', fontSize: 15 },

  badge: { fontSize: 14, opacity: 0.95 },
  badgeLocked: { opacity: 0.6 },
  badgeDone: {},
  badgeProgress: { opacity: 0.85 },

  cardLocked: { opacity: 0.55 },
  cardCurrent: { borderWidth: 2, borderColor: 'rgba(0,0,0,0.18)' },

  progressOuter: {
    marginTop: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
});
