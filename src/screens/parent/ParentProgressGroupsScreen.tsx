// src/screens/parent/ParentProgressGroupsScreen.tsx
import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ChildProfile } from '../../types';

import {
  BEGINNER_GROUPS,
  getUnitsByGroup,
  getUnitStatus,
  type UnitGroupDef,
} from '../../tracks/beginnerTrack';

import { getBeginnerProgress } from '../../tracks/beginnerProgress';
import { useI18n } from '../../i18n/I18nContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

type Props = {
  child: ChildProfile;
  onSelectGroup: (groupId: UnitGroupDef['id']) => void;
};

export function ParentProgressGroupsScreen({ child, onSelectGroup }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const textAlign = isRtl ? 'right' : 'left';

  // ✅ Hooks must run before any early return (lint rule)
  const prog = useMemo(() => (child ? getBeginnerProgress(child) : null), [child]);

  const groups = useMemo(() => {
    if (!prog) return [];
    return BEGINNER_GROUPS.map((g) => {
      const units = getUnitsByGroup(g.id);
      let completed = 0;

      for (const u of units) {
        if (getUnitStatus(u, prog).status === 'completed') completed++;
      }

      return { g, total: units.length, completed };
    });
  }, [prog]);

  // runtime guard (extra safety)
  if (!child) {
    return (
      <View style={{ marginTop: 14 }}>
        <Text style={[styles.dim, { textAlign }]}>{t('parent.progress.noChildSelected')}</Text>
      </View>
    );
  }

  function groupTitle(g: UnitGroupDef) {
    if (!g.titleKey) return g.title;
    const translated = t(g.titleKey);
    return translated === g.titleKey ? g.title : translated;
  }

  function groupDesc(g: UnitGroupDef) {
    if (g.descriptionKey) {
      const translated = t(g.descriptionKey);
      return translated === g.descriptionKey ? g.description ?? '' : translated;
    }
    return g.description ?? '';
  }

  return (
    <View style={{ marginTop: 14 }}>
      {groups.map(({ g, total, completed }) => {
        const title = groupTitle(g);
        const desc = groupDesc(g);

        return (
          <View key={g.id} style={{ marginBottom: 10 }}>
            <Card>
              <View style={[styles.row, isRtl && styles.rowRtl]}>
                <Text style={styles.emoji}>{g.emoji}</Text>

                <View style={styles.main}>
                  <Text
                    style={[styles.title, { textAlign }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {title}
                  </Text>

                  {desc ? (
                    <Text
                      style={[styles.desc, { textAlign }]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {desc}
                    </Text>
                  ) : null}
                </View>

                {/* Completed label: keep it as a fixed-ish column, align to edge */}
                <View style={[styles.trailing, isRtl ? styles.trailingRtl : styles.trailingLtr]}>
                  <Text style={[styles.completed, { textAlign: isRtl ? 'right' : 'left' }]}>
                    {t('parent.progress.completed', {
                      done: String(completed),
                      total: String(total),
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
    </View>
  );
}

const styles = StyleSheet.create({
  dim: { opacity: 0.75 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },

  emoji: {
    fontSize: 28,
    width: 40,
    textAlign: 'center',
  },

  main: { flex: 1, minWidth: 0 },

  title: { fontWeight: '900', fontSize: 16 },
  desc: { fontSize: 12, opacity: 0.7, marginTop: 2 },

  // keep trailing as its own column so margins don't flip weirdly in RTL
  trailing: {
    minWidth: 96,
    justifyContent: 'center',
  },
  trailingLtr: {
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  trailingRtl: {
    alignItems: 'flex-start',
    paddingRight: 10,
  },

  completed: { fontSize: 13, opacity: 0.85 },
});
