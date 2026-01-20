import { useMemo } from 'react';
import { View, Text } from 'react-native';
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

  // ✅ runtime guard (extra safety)
  if (!child) {
    return (
      <View style={{ marginTop: 14 }}>
        <Text style={{ opacity: 0.75 }}>
          {t('parent.progress.noChildSelected')}
        </Text>
      </View>
    );
  }

  const prog = useMemo(() => getBeginnerProgress(child), [child]);

  const groups = useMemo(() => {
    return BEGINNER_GROUPS.map((g) => {
      const units = getUnitsByGroup(g.id);
      let completed = 0;

      for (const u of units) {
        if (getUnitStatus(u, prog).status === 'completed') completed++;
      }

      return { g, total: units.length, completed };
    });
  }, [prog]);

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
              <View
                style={{
                  flexDirection: isRtl ? 'row-reverse' : 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 28, width: 40, textAlign: 'center' }}>
                  {g.emoji}
                </Text>

                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontWeight: '900',
                      fontSize: 16,
                      textAlign: isRtl ? 'right' : 'left',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {title}
                  </Text>

                  {desc ? (
                    <Text
                      style={{
                        fontSize: 12,
                        opacity: 0.7,
                        marginTop: 2,
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {desc}
                    </Text>
                  ) : null}
                </View>

                <Text
                  style={
                    isRtl
                      ? { fontSize: 13, opacity: 0.85, marginEnd: 10, textAlign: 'left' }
                      : { fontSize: 13, opacity: 0.85, marginStart: 10, textAlign: 'right' }
                  }
                >
                  {t('parent.progress.completed', {
                    done: String(completed),
                    total: String(total),
                  })}
                </Text>
              </View>

              <View style={{ marginTop: 10 }}>
                <Button onClick={() => onSelectGroup(g.id)}>
                  {t('parent.common.open')}
                </Button>
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}
