// src/screens/parent/ParentProgressScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import type { ChildProfile } from '../../types';

import type { LevelLayer } from '../../content/types';
import type { UnitGroupDef, UnitGroupId } from '../../tracks/beginnerTrack';
import { BEGINNER_GROUPS } from '../../tracks/beginnerTrack';
import { ChildrenStore } from '../../storage/childrenStore';

import { ParentProgressLayersScreen } from './ParentProgressLayersScreen';
import { ParentProgressPacksScreen } from './ParentProgressPacksScreen';
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

type ScreenView = 'layers' | 'packs' | 'units';

function safeT(
  t: (k: string, vars?: any) => string,
  key: string,
  fallback: string,
  vars?: any
) {
  const v = t(key, vars);
  return v === key ? fallback : v;
}

function clampLayer(n: number): LevelLayer {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  return 4;
}

function layerName(t: (k: string, vars?: any) => string, layer: LevelLayer): string {
  const key = `beginner.layer.${layer}.title`;
  const translated = t(key);
  if (translated !== key) return translated;
  // fallback: legacy "Layer {n}"
  return safeT(t, 'parent.progress.layers.layerTitle', `Layer ${layer}`, { layer: String(layer) });
}

function groupTitle(t: (k: string, vars?: any) => string, g: UnitGroupDef): string {
  if (!g.titleKey) return g.title;
  const translated = t(g.titleKey);
  return translated === g.titleKey ? g.title : translated;
}

export function ParentProgressScreen({
  users,
  selectedChildId,
  onSelectChild,
  onBack,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const scrollRef = useRef<ScrollView | null>(null);

  const [view, setView] = useState<ScreenView>('layers');

  const [packsMode, setPacksMode] = useState<'layer' | 'interest'>('layer');
  const [activeLayer, setActiveLayer] = useState<LevelLayer>(0);
  const [activeGroupId, setActiveGroupId] = useState<UnitGroupId | null>(null);

  const selected = useMemo(() => {
    return users.find((u) => u.id === selectedChildId) ?? users[0] ?? null;
  }, [users, selectedChildId]);

  const selectedFresh = useMemo(() => {
    if (!selected) return null;
    return ChildrenStore.getById(selected.id) ?? selected;
  }, [selected]);

  // jump to top when changing sub-view / selection
  useEffect(() => {
    const tt = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 0);
    return () => clearTimeout(tt);
  }, [view, packsMode, activeLayer, activeGroupId, selectedFresh?.id]);

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

  const textAlign = isRtl ? 'right' : 'left';
  const currentLayer = recommendation?.currentLayer ?? null;

  const currentLayerName = useMemo(() => {
    if (currentLayer === null) return null;
    return layerName(t, clampLayer(currentLayer as number));
  }, [currentLayer, t]);

  const backToLayersLabel = safeT(
    t,
    'parent.progress.backToLayers',
    isRtl ? 'חזרה לשכבות' : 'Back to layers'
  );

  const viewingLine = useMemo(() => {
    if (view === 'layers') return t('parent.progress.viewing.layers');
    if (view === 'packs') {
      if (packsMode === 'interest') return t('parent.progress.viewing.interest');
      return t('parent.progress.viewing.layer', { layerName: layerName(t, activeLayer) });
    }
    // units
    const g = activeGroupId ? BEGINNER_GROUPS.find((x) => x.id === activeGroupId) : null;
    const gName = g ? groupTitle(t, g) : null;

    if (packsMode === 'interest') {
      return gName
        ? t('parent.progress.viewing.unitsInterest', { groupName: gName })
        : t('parent.progress.viewing.interest');
    }

    const lName = layerName(t, activeLayer);

    if (gName && lName && gName.trim() === lName.trim()) {
      return t('parent.progress.viewing.group', { groupName: gName });
    }

    return gName
      ? t('parent.progress.viewing.units', { layerName: lName, groupName: gName })
      : t('parent.progress.viewing.layer', { layerName: lName });
  }, [view, packsMode, activeLayer, activeGroupId, t]);

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
                        setView('layers');
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

          {/* Overall progress */}
          {currentLayerName ? (
            <View style={{ marginTop: 6 }}>
              <Text style={[styles.strongLine, { textAlign }]}>
                {t('parent.progress.overallProgress', { layerName: currentLayerName })}
              </Text>
            </View>
          ) : null}

          {/* Viewing context */}
          <View style={{ marginTop: 4 }}>
            <Text style={[styles.dimText, { textAlign }]}>{viewingLine}</Text>
          </View>

          {/* Local navigation controls */}
          {view === 'units' ? (
            <View style={{ marginTop: 8 }}>
              <Button
                onClick={() => {
                  setView('packs');
                  setActiveGroupId(null);
                }}
              >
                {safeT(t, 'parent.progress.backToPacks', isRtl ? 'חזרה לחבילות' : 'Back to packs')}
              </Button>
            </View>
          ) : view === 'packs' ? (
            <View style={{ marginTop: 8 }}>
              <Button
                onClick={() => {
                  setView('layers');
                  setActiveGroupId(null);
                }}
              >
                {backToLayersLabel}
              </Button>
            </View>
          ) : null}
        </Card>
      </View>

      {!selectedFresh ? (
        <View style={{ marginTop: 14 }}>
          <Text style={[styles.dimText, { textAlign }]}>
            {t('parent.progress.noChildSelected')}
          </Text>
        </View>
      ) : view === 'layers' ? (
        <ParentProgressLayersScreen
          child={selectedFresh}
          currentLayer={currentLayer}
          onOpenLayer={(layer) => {
            setPacksMode('layer');
            setActiveLayer(layer);
            setActiveGroupId(null);
            setView('packs');
          }}
          onOpenInterest={() => {
            setPacksMode('interest');
            setActiveGroupId(null);
            setView('packs');
          }}
        />
      ) : view === 'packs' ? (
        <ParentProgressPacksScreen
          child={selectedFresh}
          mode={packsMode}
          layer={packsMode === 'layer' ? activeLayer : undefined}
          onBack={() => {
            setView('layers');
            setActiveGroupId(null);
          }}
          onSelectGroup={(groupId) => {
            setActiveGroupId(groupId as UnitGroupId);
            setView('units');
          }}
        />
      ) : activeGroupId ? (
        <ParentProgressUnitsScreen
          child={selectedFresh}
          groupId={activeGroupId}
          layer={packsMode === 'layer' ? activeLayer : null}
          onBackToPacks={() => {
            setView('packs');
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

  strongLine: { fontWeight: '800' },

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
