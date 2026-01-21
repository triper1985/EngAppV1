// src/screens/learn/UnitLearnScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';
import type { UnitId } from '../../tracks/beginnerTrack';
import type { ContentItem } from '../../content/types';

import {
  BEGINNER_UNITS,
  resolveUnitItems,
  type UnitDef,
} from '../../tracks/beginnerTrack';

import { getBeginnerProgress } from '../../tracks/beginnerProgress';
import { getItemsForPackIds, ensureRequiredSelected } from '../../packs/packsCatalog';

// ✅ audio layer
import {
  playFx,
  speakContentItem,
  stopTTS,
  getEffectiveAudioSettings,
} from '../../audio';

import { ChildrenStore } from '../../storage/childrenStore';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/useToast';

import { useI18n } from '../../i18n/I18nContext';

import { ItemVisual } from './ItemVisual';

type Props = {
  child: ChildProfile;
  unitId: UnitId;
  onBack: () => void; // back to Units
  onChildUpdated: (updated: ChildProfile) => void;
  onStartQuiz?: (unitId: UnitId) => void; // ✅ V10 behavior (go to quiz)
};

function getItemSpeakText(it: ContentItem, _isRtl: boolean): string {
  // V1LearnTest decision: TTS is always English.
  const txt = it.en ?? it.he;
  return (txt ?? '').trim() || (it.en ?? it.he ?? it.id ?? '').trim() || ' ';
}

export function UnitLearnScreen({
  child,
  unitId,
  onBack,
  onChildUpdated,
  onStartQuiz,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  // ✅ Effective audio settings for THIS child (global + child override)
  const effectiveAudio = useMemo(() => getEffectiveAudioSettings(child), [child]);

  const catalog = useMemo(() => {
    const packs = ensureRequiredSelected(child.selectedPackIds ?? []);
    return getItemsForPackIds(packs);
  }, [child.selectedPackIds]);

  const unit: UnitDef | undefined = useMemo(
    () => BEGINNER_UNITS.find((u) => u.id === unitId),
    [unitId]
  );

  const unitItems = useMemo(() => {
    if (!unit) return [];
    return resolveUnitItems(unit, catalog);
  }, [unit, catalog]);

  const [index, setIndex] = useState(0);
  const [heardThisItem, setHeardThisItem] = useState(false);
  const lastSpeakAtRef = useRef(0);

  // ✅ play end-of-learn FX once when DONE screen is reached
  const doneFxPlayedRef = useRef(false);

  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  const { toast, showToast, clearToast } = useToast(1600);

  /**
   * ✅ FIX (V5.5 / V10 stable):
   * start index only on enter (unitId change), not on every progress update.
   */
  useEffect(() => {
    const total = unitItems.length;
    if (total === 0) {
      setIndex(0);
      setHeardThisItem(false);
      doneFxPlayedRef.current = false;
      clearToast();
      return;
    }

    const latest = ChildrenStore.getById(child.id) ?? child;
    const latestProg = getBeginnerProgress(latest);
    const seenCount = latestProg.units?.[unitId]?.seenItemIds?.length ?? 0;

    let startIndex = 0;
    if (seenCount > 0 && seenCount < total) startIndex = seenCount;
    else startIndex = 0;

    setIndex(startIndex);
    setHeardThisItem(false);
    doneFxPlayedRef.current = false; // ✅ reset for this entry
    clearToast();
  }, [unitId, unitItems.length, child.id, clearToast]);

  // ✅ Auto speak current item (delay increased to avoid tap overlap feel)
  useEffect(() => {
    if (!unitItems.length) return;
    if (index >= unitItems.length) return;

    const current = unitItems[Math.min(index, unitItems.length - 1)];
    if (!current) return;

    const tt = setTimeout(() => {
      stopTTS();

      const text = getItemSpeakText(current, isRtl);
      speakContentItem({ text }, { settings: effectiveAudio });

      setHeardThisItem(true);
    }, 280); // ✅ was 120

    return () => clearTimeout(tt);
  }, [index, unitItems, isRtl, effectiveAudio]);

  function persistChild(updated: ChildProfile) {
    ChildrenStore.upsert(updated);
    onChildUpdated(updated);
  }

  function markSeen(itemId: string) {
    const latest = ChildrenStore.getById(child.id) ?? child;

    const bp = latest.beginnerProgress ?? ({ units: {} } as any);
    const units = bp.units ?? ({} as any);

    const up = units[unitId] ?? {
      unitId,
      seenItemIds: [],
      masteredItemIds: [],
    };

    const set = new Set<string>(up.seenItemIds ?? []);
    if (!set.has(itemId)) set.add(itemId);

    const nextChild: ChildProfile = {
      ...latest,
      beginnerProgress: {
        ...bp,
        units: {
          ...units,
          [unitId]: {
            ...up,
            unitId,
            seenItemIds: Array.from(set.values()),
            masteredItemIds: up.masteredItemIds ?? [],
          },
        },
      },
    };

    persistChild(nextChild);
  }

  async function confirmExitLearn(): Promise<boolean> {
    const total = unitItems.length;

    const latest = ChildrenStore.getById(child.id) ?? child;
    const latestProg = getBeginnerProgress(latest);
    const seenCount = latestProg.units?.[unitId]?.seenItemIds?.length ?? 0;

    const isReview = total > 0 && seenCount >= total; // ✅ finished learn => review mode
    if (isReview) return true; // ✅ no popup in review

    const notDone = index < total;
    const hasProgress = seenCount > 0 || index > 0;

    if (notDone && hasProgress) {
      return new Promise((resolve) => {
        Alert.alert(
          t('learn.learn.confirmExitTitle') || t('learn.common.confirm'),
          t('learn.learn.confirmExit'),
          [
            { text: t('learn.common.cancel'), style: 'cancel', onPress: () => resolve(false) },
            { text: t('learn.common.ok'), style: 'default', onPress: () => resolve(true) },
          ]
        );
      });
    }

    return true;
  }

  const total = unitItems.length;

  // ---- screens ----

  if (!unit) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={t('learn.learn.titleFallback')}
          onBack={onBack}
        />

        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={[styles.title18, isRtl && styles.rtl]}>
              {t('learn.common.unitNotFound')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  const unitTitle = unit.titleKey ? t(unit.titleKey) : unit.title;

  if (unitItems.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar backLabel={t('learn.common.back')} dir={dir} title={unitTitle} onBack={onBack} />

        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={[styles.title18, isRtl && styles.rtl]}>
              {t('learn.learn.noItemsTitle')}
            </Text>
            <Text style={[styles.subtitle, isRtl && styles.rtl]}>
              {t('learn.learn.noItemsSubtitle')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (index >= total) {
    if (!doneFxPlayedRef.current) {
      doneFxPlayedRef.current = true;
      playFx('learn_complete');
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar backLabel={t('learn.common.back')} dir={dir} title={unitTitle} onBack={onBack} />

        <View style={{ marginTop: 14 }}>
          <Card>
            <View style={styles.center}>
              <Text style={[styles.doneTitle, isRtl && styles.rtl]}>
                {t('learn.learn.doneTitle')}
              </Text>

              <Text style={[styles.doneSubtitle, isRtl && styles.rtl]}>
                {t('learn.learn.doneSubtitle', { title: unitTitle })}
              </Text>

              <View style={styles.doneButtons}>
                <Button
                  fullWidth
                  onClick={() => {
                    playFx('tap');
                    stopTTS();
                    setIndex(0);
                    setHeardThisItem(false);
                    clearToast();
                    doneFxPlayedRef.current = false;
                  }}
                >
                  {t('learn.learn.buttonReview')}
                </Button>

                {onStartQuiz && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      playFx('tap');
                      stopTTS();
                      onStartQuiz(unitId);
                    }}
                  >
                    {t('learn.learn.buttonGoQuiz')}
                  </Button>
                )}

                <Button
                  fullWidth
                  onClick={() => {
                    playFx('tap');
                    stopTTS();
                    onBack();
                  }}
                >
                  {t('learn.learn.buttonBackToUnits')}
                </Button>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  }

  const current = unitItems[Math.min(index, total - 1)];
  if (!current) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar backLabel={t('learn.common.back')} dir={dir} title={unitTitle} onBack={onBack} />
        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={[styles.title18, isRtl && styles.rtl]}>
              {t('learn.learn.titleFallback')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  const isLast = index >= total - 1;
  const progressText = `${Math.min(index + 1, total)} / ${total}`;

  const displayText = isRtl ? current.he ?? current.en : current.en ?? current.he;
  const visualText = current.visual.kind === 'text' ? current.visual.he : null;

  const isNumericVisual = !!visualText && /^[0-9]+$/.test(visualText.trim());

  const hideTextLine =
    isNumericVisual ||
    (!!visualText && !!displayText && visualText.trim() === displayText.trim());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        backLabel={t('learn.common.back')}
        dir={dir}
        title={unitTitle}
        onBack={async () => {
          if (await confirmExitLearn()) onBack();
        }}
        right={<Text style={styles.progressText}>{progressText}</Text>}
      />

      <View style={{ marginTop: 14 }}>
        <Card>
          <View style={styles.cardContent}>
            <View style={styles.visualWrap}>
              <ItemVisual item={current as ContentItem} size={160} />
            </View>

            {!hideTextLine && (
              <Text style={[styles.wordLine, isRtl && styles.rtl]}>{displayText}</Text>
            )}

            <Text style={[styles.toastLine, isRtl && styles.rtl]}>{toast ? toast : ''}</Text>

            <View style={styles.actions}>
              <Button
                onClick={() => {
                  const now = Date.now();
                  if (now - lastSpeakAtRef.current < 300) return;
                  lastSpeakAtRef.current = now;

                  stopTTS();
                  const text = getItemSpeakText(current, isRtl);
                  speakContentItem({ text }, { settings: effectiveAudio });

                  setHeardThisItem(true);
                  showToast(t('learn.learn.toastHeard'));
                }}
                style={styles.bigBtn}
              >
                {t('learn.learn.buttonHear')}
              </Button>

              <Button
                variant="primary"
                disabled={!heardThisItem}
                onClick={() => {
                  playFx('tap');
                  stopTTS();

                  markSeen(current.id);

                  if (isLast) {
                    setIndex(total);
                    return;
                  }

                  setIndex((i) => i + 1);
                  setHeardThisItem(false);
                  showToast(t('learn.learn.toastNext'));
                }}
                style={styles.bigBtn}
              >
                {t('learn.learn.buttonNext')}
              </Button>
            </View>

            <Text style={[styles.tip, isRtl && styles.rtl]}>{t('learn.learn.tip')}</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 26,
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },

  rtl: { textAlign: 'right' as const },

  title18: { fontWeight: '900', fontSize: 18 },
  subtitle: { marginTop: 6, opacity: 0.75 },

  progressText: { fontSize: 13, opacity: 0.75, alignSelf: 'center' },

  center: { alignItems: 'center' },

  doneTitle: { fontWeight: '900', fontSize: 30, textAlign: 'center' },
  doneSubtitle: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.85,
    textAlign: 'center',
  },
  doneButtons: { marginTop: 16, gap: 10, alignSelf: 'stretch' },

  cardContent: { gap: 12 },
  visualWrap: { alignItems: 'center' },

  wordLine: { fontSize: 28, fontWeight: '900', textAlign: 'center' },
  toastLine: { marginTop: 4, opacity: 0.75, textAlign: 'center', minHeight: 20 },

  actions: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  bigBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  tip: { marginTop: 12, fontSize: 12, opacity: 0.7, textAlign: 'center' },
});
