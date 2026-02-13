// src/screens/learn/UnitLearnScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';
import type { UnitId } from '../../tracks/beginnerTrack';
import type { ContentItem } from '../../content/types';
import { upsertProgress } from '../../storage/progress';
import { trackEvent } from '../../storage/events';
import {
  BEGINNER_UNITS,
  resolveUnitItems,
  type UnitDef,
} from '../../tracks/beginnerTrack';

import { getBeginnerProgress } from '../../tracks/beginnerProgress';
import { getItemsForPackIds, ensureRequiredSelected } from '../../packs/packsCatalog';
import { listBuiltInPacks, isBeginnerBridgePack } from '../../content/registry';

// ✅ audio layer
import { playFx, playFxAndWait, stopAllFx, speakContentItem, speakHebrewItemLike, stopTTS, getEffectiveAudioSettings, speakLetterWordEN, speakLetterWordHE } from '../../audio';

import { ChildrenStore } from '../../storage/childrenStore';
import { coinsRewardForUnitLearn } from '../../rewards/coins';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/useToast';

import { useI18n } from '../../i18n/I18nContext';

import { ItemVisual } from './ItemVisual';
import { getItemVisualImage } from '../../visuals/itemVisualRegistry';

function getHebrewLabel(it: any): string {
  return (it?.heNiqqud ?? it?.he ?? '').toString();
}


function getSpeakTextHebrew(it: ContentItem): string {
  const anyIt = it as any;
  const linkHe = anyIt?.link?.he;
  if (typeof linkHe === 'string' && linkHe.trim()) return linkHe.trim();
  return (it.he ?? it.en ?? it.id ?? '').trim() || ' ';
}

function getLinkSpec(it: ContentItem): { en: string; he?: string; iconId: string } | null {
  const anyIt = it as any;
  const link = anyIt?.link;
  if (!link) return null;
  const en = typeof link.en === 'string' ? link.en.trim() : '';
  const iconId = typeof link.iconId === 'string' ? link.iconId.trim() : '';
  if (!en || !iconId) return null;
  const he = typeof link.he === 'string' ? link.he.trim() : undefined;
  return { en, he, iconId };
}

type Props = {
  child: ChildProfile;
  unitId: UnitId;
  onBack: () => void; // back to Units
  onChildUpdated: (updated: ChildProfile) => void;
  onStartQuiz?: (unitId: UnitId) => void; // ✅ V10 behavior (go to quiz)
  onStartPractice?: (unitId: UnitId) => void;
};

function getItemSpeakText(it: ContentItem, _isRtl: boolean): string {
  // V1LearnTest decision: TTS is always English.
  const txt = it.en ?? it.he;
  return (txt ?? '').trim() || (it.en ?? it.he ?? it.id ?? '').trim() || ' ';
}

// -------------------------
// Layer 3 — Letter → Word speech helpers
// -------------------------
const LETTER_NAME_HE: Record<string, string> = {
  A: 'איי',
  B: 'בי',
  C: 'סי',
  D: 'די',
  E: 'אי',
  F: 'אף',
  G: "ג׳י",
  H: "אייץ׳",
  I: 'איי',
  J: "ג׳יי",
  K: 'קיי',
  L: 'אל',
  M: 'אם',
  N: 'אן',
  O: 'או',
  P: 'פי',
  Q: 'קיו',
  R: 'אר',
  S: 'אס',
  T: 'טי',
  U: 'יו',
  V: 'וי',
  W: 'דאבל-יו',
  X: 'אקס',
  Y: 'וואי',
  Z: 'זי',
};

function buildLetterWordPhraseEN(letter: string, wordEn: string): string {
  const L = (letter ?? '').trim();
  const W = (wordEn ?? '').trim();
  if (!L) return W;
  if (!W) return L;
  return `${L} as in ${W}.`;
}

function buildLetterWordPhraseHE(letter: string, wordEn: string): string {
  const L = (letter ?? '').trim().toUpperCase();
  const WEN = (wordEn ?? '').trim();
  const letterNameHe = LETTER_NAME_HE[L] ?? L;
  // Product decision (Hebrew): "איי כמו אפל" (EN word as a Hebrew-friendly loanword)
  return WEN ? `${letterNameHe} כמו ${WEN}.` : letterNameHe;
}


function speakHebrewItem(it: any, effectiveAudio?: any) {
  if (!it) return;
  stopTTS();
  speakHebrewItemLike(it as any, effectiveAudio ? { settings: effectiveAudio } : undefined);
}


function speakCurrentEN(it: any, isRtl: boolean, effectiveAudio: any) {
  const link = it?.link;
  if (link?.en) {
    stopTTS();
    speakLetterWordEN(it?.en ?? '', link.en, { settings: effectiveAudio });
    return;
  }
  const text = getItemSpeakText(it as ContentItem, isRtl);
  stopTTS();
  speakContentItem({ text }, { settings: effectiveAudio });
}

function speakCurrentHE(it: any, effectiveAudio: any) {
  const link = it?.link;
  if (link?.en) {
    stopTTS();
    speakLetterWordHE(it?.en ?? '', link.en, { settings: effectiveAudio });
    return;
  }

  stopTTS();
  speakHebrewItemLike(it as any, { settings: effectiveAudio });
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
  // 1️⃣ Core Beginner packs – תמיד כלולים במסלול
  const beginnerPackIds = listBuiltInPacks()
    .filter(isBeginnerBridgePack)
    .map((p) => p.id);

  // 2️⃣ Interest packs שנבחרו ע"י ההורה
  const selected = child.selectedPackIds ?? [];

  // 3️⃣ איחוד ללא כפילויות
  const allPackIds = Array.from(
    new Set([...beginnerPackIds, ...selected])
  );

  return getItemsForPackIds(allPackIds);
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
  const [advancing, setAdvancing] = useState(false);
  const lastSpeakAtRef = useRef(0);
  const lastAutoSpeakKey = useRef<string>('');
  const completedRef = useRef(false);
  const startedAtRef = useRef<number>(Date.now());



  // ✅ play end-of-learn FX once when DONE screen is reached
  const doneFxPlayedRef = useRef(false);
  const learnCoinsAwardedRef = useRef(false);

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



useEffect(() => {
  startedAtRef.current = Date.now();

  trackEvent('unit_learn_started', {
    childId: child.id,
    payload: {
      unitId,
      startedAt: startedAtRef.current,
    },
  });
}, [unitId]);


useEffect(() => {
  return () => {
    if (completedRef.current) return;

    const durationSec = Math.floor(
      (Date.now() - startedAtRef.current) / 1000
    );

    trackEvent('unit_learn_partial', {
      childId: child.id,
      payload: {
        unitId,
        duration_sec: durationSec,
      },
    });

  upsertProgress({
    id: `unit_${unitId}`,
    child_id: child.id,
    lesson_id: unitId,
    status: 'partial',
    attempts: 1,
    duration_sec: durationSec,
      });
    };
  }, []);

useEffect(() => {
  if (index < unitItems.length) return;
  if (completedRef.current) return;

  completedRef.current = true;

  const durationSec = getDurationSec();

  trackEvent('unit_learn_completed', {
    childId: child.id,
    payload: {
      unitId,
      duration_sec: durationSec,
    },
  });

  upsertProgress({
    id: `unit_${unitId}`,
    child_id: child.id,
    lesson_id: unitId,
    status: 'completed',
    attempts: 1,
    duration_sec: durationSec,
  });
}, [index, unitItems.length, unitId, child.id]);


  // ✅ Auto speak current item (delay increased to avoid FX overlap)
  useEffect(() => {
    if (!unitItems.length) return;
    if (index >= unitItems.length) return;

    const current = unitItems[Math.min(index, unitItems.length - 1)];
    if (!current) return;

    // ✅ prevent re-speaking the same item when unrelated props update
    const key = `${unitId}:${index}:${current.id}`;
    if (lastAutoSpeakKey.current === key) return;
    lastAutoSpeakKey.current = key;

    const tt = setTimeout(() => {
      speakCurrentEN(current as any, isRtl, effectiveAudio);

      setHeardThisItem(true);
    }, 420);

    return () => clearTimeout(tt);
  }, [index, unitItems, isRtl, effectiveAudio]);

  function persistChild(updated: ChildProfile) {
    ChildrenStore.upsert(updated);
    queueMicrotask(() => {
      onChildUpdated(updated);
    });

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

function getDurationSec() {
  return Math.max(
    1,
    Math.round((Date.now() - startedAtRef.current) / 1000)
  );
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
    console.log('DEBUG UNIT', {
  unitId,
  unitItemIds: unit.itemIds,
  selectedPackIds: child.selectedPackIds,
  catalogCount: catalog.length,
});
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

  // ✅ DONE screen (end-of-flow): NO TAP on any buttons
  if (index >= total) {
    
    if (!doneFxPlayedRef.current) {
      doneFxPlayedRef.current = true;
      // ✅ end-of-unit success
      playFx('complete');
    }

    // ✅ coins: award once per completion (no farming on 'Review' inside the same visit)
    if (!learnCoinsAwardedRef.current) {
      learnCoinsAwardedRef.current = true;

      const latest = ChildrenStore.getById(child.id) ?? child;
      const bonus = coinsRewardForUnitLearn(latest);

      if (bonus > 0) {
        ChildrenStore.addCoins(child.id, bonus);
        const updated = ChildrenStore.getById(child.id) ?? latest;
        queueMicrotask(() => {
          onChildUpdated(updated);
        });


        // toast is optional; keep it subtle
        showToast(t('learn.learn.toastCoins', { bonus: String(bonus) }));
      }
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
                    stopAllFx();
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
                    onClick={async () => {
                      stopAllFx();
                      stopTTS();
                    
                      onStartQuiz(unitId);
                    }}
                  >
                    {t('learn.learn.buttonGoQuiz')}
                  </Button>
                )}

                <Button
                  fullWidth
                  onClick={async () => {
                    stopAllFx();
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

  const displayText = isRtl ? ((current as any).heNiqqud ?? current.he ?? current.en) : (current.en ?? current.he);
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
          if (await confirmExitLearn()) {
           onBack();
           }
        }}
        right={<Text style={styles.progressText}>{progressText}</Text>}
      />

      <View style={{ marginTop: 14 }}>
        <Card>
          <View style={styles.cardContent}>
            <View style={styles.visualWrap}>
              {(() => {
                const link = getLinkSpec(current as ContentItem);
                if (!link) {
                  return <ItemVisual item={current as ContentItem} size={160} />;
                }

                const img = getItemVisualImage(link.iconId);

                return (
                  <View style={styles.linkRow}>
                    <View style={styles.linkCell}>
                      <ItemVisual item={current as ContentItem} size={110} />
                    </View>

                    <Text style={styles.linkArrow}>➜</Text>

                    <View style={styles.linkCell}>
                      {img ? (
                        <View style={styles.linkIconBox}>
                          <Image source={img} style={{ width: 96, height: 96 }} resizeMode="contain" />
                        </View>
                      ) : (
                        <ItemVisual
                          item={
                            {
                              id: link.iconId,
                              en: link.en,
                              he: link.he,
                              visual: { kind: 'image', assetId: link.iconId } as any,
                            } as any
                          }
                          size={110}
                        />
                      )}
                      <Text style={[styles.linkWord, isRtl && styles.rtl]}>{link.en}</Text>
                    </View>
                  </View>
                );
              })()}
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

                  speakCurrentEN(current as any, isRtl, effectiveAudio);

                  setHeardThisItem(true);
                  showToast(t('learn.learn.toastHeard'));
                }}
                style={styles.bigBtn}
              >
                {t('learn.learn.buttonHear')}
              </Button>

              <Button
                onClick={() => {
                  const now = Date.now();
                  if (now - lastSpeakAtRef.current < 300) return;
                  lastSpeakAtRef.current = now;

                  stopTTS();
                  const anyCur = current as any;
                  const isLetterWord = Array.isArray(anyCur?.tags) && anyCur.tags.includes('letterWord');
                  const linkEn = anyCur?.link?.en;
                  if (isLetterWord && typeof linkEn === 'string' && linkEn.trim()) {
                    speakLetterWordHE(anyCur?.en ?? '', linkEn, { settings: effectiveAudio });
                  } else {
                    speakHebrewItemLike(current as any, { settings: effectiveAudio });
                  }

                  // counts as "heard" for gating Next
                  setHeardThisItem(true);
                }}
                style={styles.bigBtn}
              >
                {t('learn.learn.buttonHearHe')}
              </Button>

              <Button
                variant="primary"
                disabled={!heardThisItem || advancing}
                onClick={async () => {
                  if (advancing) return;
                  setAdvancing(true);
                  stopTTS();

                  markSeen(current.id);

                  // ✅ last card -> go to DONE screen with NO TAP
                  if (isLast) {
                    setIndex(total);
                    setAdvancing(false);
                    return;
                  }

                  // ✅ normal next card -> wait for tap to finish, THEN advance
                  try {
                    await playFxAndWait('tap');
                    setIndex((i) => i + 1);
                    setHeardThisItem(false);
                    showToast(t('learn.learn.toastNext'));
                  } finally {
                    // allow clicks again even if FX fails
                    setAdvancing(false);
                  }
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

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  linkCell: { alignItems: 'center', justifyContent: 'center' },
  linkArrow: { fontSize: 26, fontWeight: '900' },
  linkIconBox: {
    width: 132,
    height: 132,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#111',
  },
  linkWord: { marginTop: 8, fontSize: 18, fontWeight: '800', textAlign: 'center' },

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