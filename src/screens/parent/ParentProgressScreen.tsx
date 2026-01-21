// src/screens/parent/ParentProgressScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import type { ChildProfile } from '../../types';

import type { UnitGroupId } from '../../tracks/beginnerTrack';
import { ChildrenStore } from '../../storage/childrenStore';

import { ParentProgressGroupsScreen } from './ParentProgressGroupsScreen';
import { ParentProgressUnitsScreen } from './ParentProgressUnitsScreen';

import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { getLevelARecommendation } from '../../content';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  users: ChildProfile[];
  selectedChildId: string | null;
  onSelectChild: (id: string) => void;
  onBack: () => void;
};

type ScreenView = 'groups' | 'units';

export function ParentProgressScreen({
  users,
  selectedChildId,
  onSelectChild,
  onBack,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const scrollRef = useRef<ScrollView | null>(null);

  const [view, setView] = useState<ScreenView>('groups');
  const [activeGroupId, setActiveGroupId] = useState<UnitGroupId | null>(null);

  const selected = useMemo(() => {
    return users.find((u) => u.id === selectedChildId) ?? users[0] ?? null;
  }, [users, selectedChildId]);

  const selectedFresh = useMemo(() => {
    if (!selected) return null;
    return ChildrenStore.getById(selected.id) ?? selected;
  }, [selected]);

  // jump to top when changing sub-view / selected group / selected child
  useEffect(() => {
    const tt = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 0);
    return () => clearTimeout(tt);
  }, [view, activeGroupId, selectedFresh?.id]);

  function refreshUsers() {
    void ChildrenStore.list();
  }

  function toast(msg: string) {
    console.log('[ParentProgress]', msg);
  }

  const recommendation = useMemo(() => {
    if (!selectedFresh) return null;
    if (selectedFresh.levelId && selectedFresh.levelId !== 'beginner') return null;
    return getLevelARecommendation(selectedFresh);
  }, [selectedFresh]);

  const recommendationText = useMemo(() => {
    if (!recommendation) return null;

    if (recommendation.currentLayer >= 4) return t('parent.progress.reco.complete');

    if (recommendation.suggestedNextLayer !== null) {
      return t('parent.progress.reco.readyForNext', {
        layer: String(recommendation.suggestedNextLayer),
      });
    }

    return t('parent.progress.reco.practiceLayer', {
      layer: String(recommendation.currentLayer),
    });
  }, [recommendation, t]);

  const focusPacksText = useMemo(() => {
    if (!recommendation?.focusPackIds?.length) return null;

    const names = recommendation.focusPackIds.map((id) => {
      const key = `content.pack.${id}.title`;
      const translated = t(key);
      return translated === key ? id : translated;
    });

    return t('parent.progress.focusPacks', { packs: names.join(', ') });
  }, [recommendation, t]);

  const textAlign = isRtl ? 'right' : 'left';

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
      <TopBar
        title={t('parent.progress.title')}
        onBack={onBack}
        backLabel={t('parent.common.back')}
        dir={dir}
      />

      <View style={{ marginTop: 14 }}>
        <Card>
          <Text style={[styles.sectionTitle, { textAlign }]}>
            {t('parent.progress.childLabel')}
          </Text>

          {users.length === 0 ? (
            <Text style={[styles.dimText, { textAlign }]}>
              {t('parent.progress.noChildSelected')}
            </Text>
          ) : (
            <View style={[styles.userRow, isRtl && styles.userRowRtl]}>
              {users.map((u) => {
                const active = selectedFresh?.id === u.id;

                return (
                  <View key={u.id} style={styles.userChipWrap}>
                    <Button
                      variant={active ? 'primary' : 'secondary'}
                      onClick={() => {
                        onSelectChild(u.id);
                        setView('groups');
                        setActiveGroupId(null);
                      }}
                    >
                      {u.name}
                    </Button>
                  </View>
                );
              })}
            </View>
          )}

          {view === 'units' ? (
            <View style={{ marginTop: 6 }}>
              <Button
                onClick={() => {
                  setView('groups');
                  setActiveGroupId(null);
                }}
              >
                {t('parent.progress.backToGroups')}
              </Button>
            </View>
          ) : null}
        </Card>
      </View>

      {recommendation ? (
        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={[styles.sectionTitle, { textAlign }]}>
              {t('parent.progress.recommendationTitle')}
            </Text>

            <Text style={[styles.paragraph, { textAlign }]}>
              {recommendationText}
            </Text>

            <View style={{ marginTop: 10 }}>
              <Text style={[styles.strongLine, { textAlign }]}>
                {t('parent.progress.currentLayer', {
                  layer: String(recommendation.currentLayer),
                })}
              </Text>

              {recommendation.suggestedNextLayer !== null ? (
                <Text style={[styles.strongLine, { textAlign, marginTop: 4 }]}>
                  {t('parent.progress.suggestedNextLayer', {
                    layer: String(recommendation.suggestedNextLayer),
                  })}
                </Text>
              ) : null}

              {focusPacksText ? (
                <Text style={[styles.paragraph, { textAlign, marginTop: 10 }]}>
                  {focusPacksText}
                </Text>
              ) : null}
            </View>
          </Card>
        </View>
      ) : null}

      {!selectedFresh ? (
        <View style={{ marginTop: 14 }}>
          <Text style={[styles.dimText, { textAlign }]}>
            {t('parent.progress.noChildSelected')}
          </Text>
        </View>
      ) : view === 'groups' ? (
        <ParentProgressGroupsScreen
          child={selectedFresh}
          onSelectGroup={(groupId) => {
            setActiveGroupId(groupId as UnitGroupId);
            setView('units');
          }}
        />
      ) : activeGroupId ? (
        <ParentProgressUnitsScreen
          child={selectedFresh}
          groupId={activeGroupId}
          onBackToGroups={() => {
            setView('groups');
            setActiveGroupId(null);
          }}
          onToast={toast}
          onRefreshUsers={refreshUsers}
        />
      ) : (
        <View style={{ marginTop: 14 }}>
          <Text style={[styles.dimText, { textAlign }]}>
            {t('parent.progress.noGroupSelected')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },

  sectionTitle: {
    fontWeight: '800',
    marginBottom: 10,
  },

  dimText: { opacity: 0.75 },

  paragraph: {
    opacity: 0.85,
    lineHeight: 20,
  },

  strongLine: { fontWeight: '700' },

  userRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  userRowRtl: {
    flexDirection: 'row-reverse',
  },

  // use marginHorizontal so it works both in LTR/RTL row-reverse without thinking
  userChipWrap: {
    marginHorizontal: 6,
    marginBottom: 10,
  },
});
