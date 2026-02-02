// src/screens/parent/ParentProgressPacksScreen.tsx
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
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  child: ChildProfile;
  mode: 'layer' | 'interest';
  layer?: LevelLayer;
  onBack: () => void;
  onSelectGroup: (groupId: UnitGroupDef['id']) => void;
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

function groupDesc(t: (k: string, vars?: any) => string, g: UnitGroupDef): string {
  if (g.descriptionKey) {
    const translated = t(g.descriptionKey);
    return translated === g.descriptionKey ? g.description ?? '' : translated;
  }
  return g.description ?? '';
}

export function ParentProgressPacksScreen({ child, mode, layer, onBack, onSelectGroup }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const textAlign = isRtl ? 'right' : 'left';

  const prog = useMemo(() => getBeginnerProgress(child), [child]);

  const groups = useMemo(() => {
    const all = BEGINNER_GROUPS.slice();

    if (mode === 'interest') {
      return all.filter((g) => {
        const pack = getPackById(g.id as any);
        return !!pack && !!pack.policy?.packType && pack.policy.packType !== 'core';
      });
    }

    const target = clampLayer((layer as number) ?? 0);

    return all.filter((g) => {
      const pack = getPackById(g.id as any);
      if (!pack) return false;

      const type = pack.policy?.packType;
      if (type && type !== 'core') return false;

      const req = clampLayer((pack.policy?.minLayer as number | undefined) ?? 0);
      return req === target;
    });
  }, [mode, layer]);

  const title = useMemo(() => {
    if (mode === 'interest') return t('parent.progress.packs.interestTitle');
        const l = clampLayer((layer as number) ?? 0);
    return t('parent.progress.packs.layerTitle', { layerName: layerName(t, l) });
  }, [mode, layer, t]);

  return (
    <View style={{ marginTop: 14 }}>
      <Card>
        <Text style={[styles.sectionTitle, { textAlign }]}>{title}</Text>
      </Card>

      <View style={{ marginTop: 14 }}>
        {groups.map((g) => {
          const units = getUnitsByGroup(g.id);
          let completed = 0;
          for (const u of units) {
            if (getUnitStatus(u, prog).status === 'completed') completed++;
          }

          const titleText = groupTitle(t, g);
          const descText = groupDesc(t, g);

          return (
            <View key={g.id} style={{ marginBottom: 10 }}>
              <Card>
                <View style={[styles.row, isRtl && styles.rowRtl]}>
                  <Text style={styles.emoji}>{g.emoji}</Text>

                  <View style={styles.main}>
                    <Text style={[styles.packTitle, { textAlign }]} numberOfLines={1} ellipsizeMode="tail">
                      {titleText}
                    </Text>

                    {descText ? (
                      <Text style={[styles.desc, { textAlign }]} numberOfLines={2} ellipsizeMode="tail">
                        {descText}
                      </Text>
                    ) : null}
                  </View>

                  <View style={[styles.trailing, isRtl ? styles.trailingRtl : styles.trailingLtr]}>
                    <Text style={[styles.completed, { textAlign: isRtl ? 'right' : 'left' }]}>
                      {t('parent.progress.completed', {
                        done: String(completed),
                        total: String(units.length),
                      })}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Button onClick={() => onSelectGroup(g.id)}>{t('parent.common.open')}</Button>
                </View>
              </Card>
            </View>
          );
        })}

        {groups.length === 0 ? (
          <Text style={[styles.dim, { textAlign }]}>{t('parent.progress.packs.empty')}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontWeight: '900', fontSize: 16 },

  dim: { opacity: 0.75 },

  row: { flexDirection: 'row', alignItems: 'center' },
  rowRtl: { flexDirection: 'row-reverse' },

  emoji: { fontSize: 28, width: 40, textAlign: 'center' },

  main: { flex: 1, minWidth: 0 },

  packTitle: { fontWeight: '900', fontSize: 16 },
  desc: { fontSize: 12, opacity: 0.7, marginTop: 2 },

  trailing: { minWidth: 96, justifyContent: 'center' },
  trailingLtr: { alignItems: 'flex-end', paddingLeft: 10 },
  trailingRtl: { alignItems: 'flex-start', paddingRight: 10 },

  completed: { fontSize: 13, opacity: 0.85 },
});
