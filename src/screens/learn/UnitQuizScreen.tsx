// src/screens/learn/UnitQuizScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import type { ChildProfile } from '../../types';
import type { UnitId } from '../../tracks/beginnerTrack';
import type { ContentItem } from '../../content/types';
import { trackEvent } from '../../storage/events';

import {
  BEGINNER_UNITS,
  resolveUnitItems,
  type UnitDef,
  QUIZ_PASS_SCORE,
} from '../../tracks/beginnerTrack';

import {
  getQuizAttemptsToday,
  isQuizLockedToday,
  recordQuizFailAttempt,
  resetQuizDailyStateOnPass,
  setBestQuizScore,
  getBeginnerProgress,
} from '../../tracks/beginnerProgress';

import { getItemsForPackIds, ensureRequiredSelected } from '../../packs/packsCatalog';

// ✅ audio layer
import {
  playFx,
  speakContentItem,
  speakHebrewItemLike,
  stopTTS,
  stopAllFx,
  getEffectiveAudioSettings,
  speakLetterWordEN, speakLetterWordHE,
} from '../../audio';

import { ChildrenStore } from '../../storage/childrenStore';
import { coinsRewardForQuizPass } from '../../rewards/coins';

import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { useToast } from '../../ui/useToast';

import { Confetti } from '../../components/Confetti';

import { useI18n } from '../../i18n/I18nContext';
import { ItemVisual } from './ItemVisual';

function getSpeakTextHebrew(it: ContentItem): string {
  const anyIt = it as any;
  const linkHe = typeof anyIt?.link?.he === 'string' ? anyIt.link.he : '';
  if (linkHe && linkHe.trim()) return linkHe.trim();
  return (it.he ?? it.en ?? it.id ?? '').trim() || ' ';
}

import { shuffle, sampleDistinct } from './learnUtils';

function getHebrewLabel(it: any): string {
  return (it?.heNiqqud ?? it?.he ?? '').toString();
}


type Props = {
  child: ChildProfile;
  unitId: UnitId;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
  onStartPractice: (unitId: UnitId) => void;
  onRetryQuiz: () => void;
};

type Question = {
  correctId: string;
  optionIds: string[];
};


// -------------------------
// Layer 3 — Letter → Word speech helpers
// -------------------------
const LETTER_NAME_HE: Record<string, string> = {
  A: 'איי', B: 'בי', C: 'סי', D: 'די', E: 'אי', F: 'אף',
  G: "ג׳י", H: "אייץ׳", I: 'איי', J: "ג׳יי", K: 'קיי', L: 'אל',
  M: 'אם', N: 'אן', O: 'או', P: 'פי', Q: 'קיו', R: 'אר',
  S: 'אס', T: 'טי', U: 'יו', V: 'וי', W: 'דאבל-יו', X: 'אקס', Y: 'וואי', Z: 'זי',
};

function buildLetterWordPhraseEN(letter: string, wordEn: string): string {
  const L = (letter ?? '').trim();
  const W = (wordEn ?? '').trim();
  if (!L) return W;
  if (!W) return L;
  return `${L} as in ${W}.`;
}

function buildLetterWordPhraseHE(letter: string, _wordEn: string, wordHe: string): string {
  const L = (letter ?? '').trim().toUpperCase();
  const WHE = (wordHe ?? '').trim();
  const letterNameHe = LETTER_NAME_HE[L] ?? L;

  // Product decision: Hebrew speaks the LETTER NAME + Hebrew word
  // Example: "איי כמו תפוח"
  if (WHE) return `${letterNameHe} כמו ${WHE}.`;
  return letterNameHe;
}

function isHebrewVoiceId(voiceId?: string): boolean {
  const v = (voiceId ?? '').toLowerCase();
  return v.includes('he') || v.includes('heb') || v.includes('iw') || v.includes('israel');
}

function prefersHebrewTts(effectiveAudio: any): boolean {
  return isHebrewVoiceId(effectiveAudio?.voiceId);
}

function getSpeakTextForItem(it: ContentItem, effectiveAudio?: any): string {
  if (prefersHebrewTts(effectiveAudio)) {
    return (it as any).heNiqqud ?? it.he ?? it.en ?? it.id ?? ' ';
  }
  return it.en ?? it.he ?? it.id ?? ' ';
}

function speakPromptEN(it: any, effectiveAudio: any) {
  const link = it?.link;

  if (link?.en) {
    stopTTS();
    if (prefersHebrewTts(effectiveAudio)) {
      speakLetterWordHE(it?.en ?? '', link.en, { settings: effectiveAudio });
    } else {
      speakLetterWordEN(it?.en ?? '', link.en, { settings: effectiveAudio });
    }
    return;
  }

  stopTTS();

  if (prefersHebrewTts(effectiveAudio)) {
    speakHebrewItemLike(
      { ...(it as any), he: (it as any).heNiqqud ?? (it as any).he },
      { settings: effectiveAudio }
    );
    return;
  }

  const text = getSpeakTextForItem(it as ContentItem, effectiveAudio);
  speakContentItem({ text }, { settings: effectiveAudio });
}

function speakPromptHE(it: any, effectiveAudio: any) {
  const link = it?.link;
  if (link?.en) {
    stopTTS();
    speakLetterWordHE(it?.en ?? '', link.en, { settings: effectiveAudio });
    return;
  }

  stopTTS();
  speakHebrewItemLike(it as any, { settings: effectiveAudio });
}

export function UnitQuizScreen({
  child,
  unitId,
  onBack,
  onChildUpdated,
  onStartPractice,
  onRetryQuiz,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const { toast, showToast, clearToast } = useToast(1800);

  // ✅ Effective audio settings for THIS child (global + child override)
  const effectiveAudio = useMemo(() => getEffectiveAudioSettings(child), [child]);

  const [confettiKey, setConfettiKey] = useState(0);

  const unit: UnitDef | undefined = useMemo(
    () => BEGINNER_UNITS.find((u) => u.id === unitId),
    [unitId]
  );

  const unitTitle = useMemo(() => {
    if (!unit) return '';
    return unit.titleKey ? t(unit.titleKey) : unit.title;
  }, [unit, t]);

  const catalog = useMemo(() => {
    const packIds = ensureRequiredSelected(child.selectedPackIds ?? ['basic']);
    return getItemsForPackIds(packIds);
  }, [child.selectedPackIds]);

  const unitItems = useMemo(() => {
    if (!unit) return [];
    return resolveUnitItems(unit, catalog);
  }, [unit, catalog]);

  const byId = useMemo(() => new Map(unitItems.map((it) => [it.id, it])), [unitItems]);

  const questions: Question[] = useMemo(() => {
    if (!unit || unitItems.length === 0) return [];
    const ids = unitItems.map((it) => it.id);

    const qCount = Math.min(6, ids.length);
    const correctIds = sampleDistinct(ids, qCount);

    return correctIds.map((correctId) => {
      const optionCount = Math.min(4, Math.max(3, ids.length));
      const distractors = shuffle(ids.filter((x) => x !== correctId)).slice(0, optionCount - 1);
      return { correctId, optionIds: shuffle([correctId, ...distractors]) };
    });
  }, [unit, unitItems]);

  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const quizCompletedRef = useRef(false);
  const quizStartedAtRef = useRef<number>(Date.now());
  const wrongIdsRef = useRef<Set<string>>(new Set());
  const lastAutoSpeakKey = useRef<string>('');

  // ✅ debounce for manual "Hear" button
  const lastSpeakAtRef = useRef<number>(0);

  const [finished, setFinished] = useState<null | { score: number; passed: boolean }>(null);
  const [persisted, setPersisted] = useState(false);

  // ✅ ensure result FX plays once per run
  const resultFxPlayedRef = useRef(false);


  
useEffect(() => {
  return () => stopTTS();
}, []);

const attempts = getQuizAttemptsToday(child, unitId);
const lockedToday = isQuizLockedToday(child, unitId);

useEffect(() => {
  setQIndex(0);
  setCorrectCount(0);
  setSelected(null);
  setLocked(false);
  wrongIdsRef.current = new Set();
  setFinished(null);
  setPersisted(false);
  lastAutoSpeakKey.current = '';
  resultFxPlayedRef.current = false;
  quizCompletedRef.current = false; // ✅ reset
  clearToast();
}, [unitId, clearToast]);

// =========================
// QUIZ STARTED
// =========================
useEffect(() => {
  quizStartedAtRef.current = Date.now();

  trackEvent('unit_quiz_started', {
    childId: child.id,
    payload: {
      unitId,
    },
  });
}, [unitId]);

const q = questions[qIndex];
const correctItem = q ? byId.get(q.correctId) : undefined;

// =========================
// QUIZ PARTIAL (unmount)
// =========================
useEffect(() => {
  return () => {
    if (quizCompletedRef.current) return;

    const durationSec = Math.max(
      1,
      Math.round((Date.now() - quizStartedAtRef.current) / 1000)
    );

    trackEvent('unit_quiz_partial', {
      childId: child.id,
      payload: {
        unitId,
        duration_sec: durationSec,
      },
    });
  };
}, []);

// =========================
// AUTO SPEAK
// =========================
useEffect(() => {
  if (lockedToday) return;
  if (finished) return;
  if (!q) return;
  if (!correctItem) return;

  const key = `${unitId}:${qIndex}:${correctItem.id}`;
  if (lastAutoSpeakKey.current === key) return;
  lastAutoSpeakKey.current = key;

  const tt = setTimeout(() => {
    stopTTS();
    if (lockedToday) return;
    if (finished) return;

    speakPromptEN(correctItem as any, effectiveAudio);
  }, 120);

  return () => clearTimeout(tt);
}, [unitId, qIndex, q, correctItem, lockedToday, finished, effectiveAudio]);

function persistChild(updated: ChildProfile) {
  ChildrenStore.upsert(updated);
  onChildUpdated(updated);
}

function saveScoreAndDailyState(score: number, passed: boolean) {
  const latest = ChildrenStore.getById(child.id) ?? child;

  let next = setBestQuizScore(latest, unitId, score);

  if (passed) {
    next = resetQuizDailyStateOnPass(next, unitId);
  } else {
    next = recordQuizFailAttempt(next, unitId, Array.from(wrongIdsRef.current.values()));
  }

  persistChild(next);
}
// =========================
// QUIZ COMPLETED
// =========================
useEffect(() => {
  if (!finished) return;
  if (quizCompletedRef.current) return;

  // 🔒 mark immediately to block partial cleanup
  quizCompletedRef.current = true;

  const durationSec = Math.max(
    1,
    Math.round((Date.now() - quizStartedAtRef.current) / 1000)
  );

  trackEvent('unit_quiz_completed', {
    childId: child.id,
    payload: {
      unitId,
      duration_sec: durationSec,
      score: finished.score,
      passed: finished.passed,
    },
  });
}, [finished, unitId, child.id]);

// =========================
// EXISTING FX + PERSIST
// =========================
useEffect(() => {
  if (!finished) return;
  if (persisted) return;

  if (!resultFxPlayedRef.current) {
    resultFxPlayedRef.current = true;

    if (finished.passed) {
      playFx('complete');
    } else {
      playFx('fail');
    }
  }

    saveScoreAndDailyState(finished.score, finished.passed);

    if (finished.passed) {
      setConfettiKey((k) => k + 1);

      const latest = ChildrenStore.getById(child.id) ?? child;
      const preBest = getBeginnerProgress(latest).units[unitId]?.bestQuizScore ?? 0;
      const firstPass = preBest < QUIZ_PASS_SCORE;
      const bonus = coinsRewardForQuizPass(latest, { firstPass });

      if (bonus > 0) {
        ChildrenStore.addCoins(child.id, bonus);
        const updatedChild = ChildrenStore.getById(child.id) ?? latest;
        onChildUpdated(updatedChild);

        showToast(t('learn.quiz.toastCoins', { bonus: String(bonus) }));
      }
    }

    setPersisted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  /* -------------------------------- render -------------------------------- */

  if (!unit) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={t('learn.quiz.titleFallback')}
          onBack={onBack}
        />
        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={styles.h1}>{t('learn.common.unitNotFound')}</Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  const topTitle = `${unitTitle} — ${t('learn.quiz.titleShort')}`;

  if (lockedToday) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar backLabel={t('learn.common.back')} dir={dir} title={topTitle} onBack={onBack} />

        <View style={{ marginTop: 14 }}>
          <Card>
            <View style={styles.center}>
              <Text style={styles.lockTitle}>{t('learn.quiz.lockedTodayTitle')}</Text>

              <Text style={styles.lockSub}>
                {t('learn.quiz.lockedTodayAttempts', { attempts: String(attempts) })}
              </Text>

              <Text style={styles.lockHint}>{t('learn.quiz.lockedTodayHint')}</Text>

              <View style={styles.doneButtons}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    stopAllFx();
                    stopTTS();
                    onStartPractice(unitId);
                  }}
                >
                  {t('learn.quiz.buttonPractice')}
                </Button>

                <Button
                  fullWidth
                  onClick={() => {
                    stopAllFx();
                    stopTTS();
                    onBack();
                  }}
                >
                  {t('learn.common.back')}
                </Button>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (unitItems.length === 0 || questions.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar backLabel={t('learn.common.back')} dir={dir} title={topTitle} onBack={onBack} />

        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={styles.h1}>{t('learn.quiz.notEnoughItemsTitle')}</Text>
            <Text style={[styles.muted, isRtl && styles.rtl]}>
              {t('learn.quiz.notEnoughItemsSubtitle')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (finished) {
    const { score, passed } = finished;

    const attemptsAfterFail = passed ? attempts : Math.min(3, attempts + 1);
    const willLock = !passed && attemptsAfterFail >= 3;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {passed && confettiKey > 0 && <Confetti key={confettiKey} durationMs={900} pieces={90} />}

        <TopBar backLabel={t('learn.common.back')} dir={dir} title={topTitle} onBack={onBack} />

        <View style={{ marginTop: 14 }}>
          <Card>
            <View style={styles.center}>
              {passed ? (
                <>
                  <Text style={styles.doneTitle}>{t('learn.quiz.passedTitle')}</Text>
                  <Text style={styles.mutedCenter}>
                    {t('learn.quiz.unitLabel', { title: unitTitle })}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.doneTitle}>{t('learn.quiz.failedTitle')}</Text>
                  <Text style={styles.mutedCenter}>{t('learn.quiz.failedSubtitle')}</Text>
                </>
              )}

              <Text style={styles.scoreBig}>{score}%</Text>

              {!passed && (
                <Text style={styles.lockHint}>
                  {t('learn.quiz.attemptsToday', {
                    attempts: String(attemptsAfterFail),
                    willLock: willLock ? t('learn.quiz.willLockSuffix') : '',
                  })}
                </Text>
              )}

              <View style={styles.doneButtons}>
                {!passed && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      stopAllFx();
                      stopTTS();
                      onStartPractice(unitId);
                    }}
                  >
                    {t('learn.quiz.buttonPracticeWrong')}
                  </Button>
                )}

                {!passed && !willLock && (
                  <Button
                    fullWidth
                    onClick={() => {
                      stopAllFx();
                      stopTTS();
                      onRetryQuiz();
                    }}
                  >
                    {t('learn.quiz.buttonRetryNow')}
                  </Button>
                )}

                <Button
                  fullWidth
                  onClick={() => {
                    stopAllFx();
                    stopTTS();
                    onBack();
                  }}
                >
                  {t('learn.common.backOk')}
                </Button>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  }

  // ✅ Option A: define correctId ONCE, before map
  const correctId = q!.correctId;

  const progressPct = Math.round(((qIndex + 1) / questions.length) * 100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        backLabel={t('learn.common.back')}
        dir={dir}
        title={topTitle}
        onBack={onBack}
        right={<Text style={styles.progressText}>{qIndex + 1}/{questions.length}</Text>}
      />

      <View style={{ marginTop: 14 }}>
        <Card>
          {!!toast && (
            <View style={styles.toastBox}>
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          )}

          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${progressPct}%` }]} />
          </View>

          <View style={styles.centerBlock}>
            <Text style={styles.promptTitle}>{t('learn.quiz.hearAndChoose')}</Text>

            <View style={[styles.hearRow, { marginTop: 10 }]}>
              <Button
                variant="primary"
                onClick={() => {
                  if (!correctItem) return;

                  const now = Date.now();
                  if (now - lastSpeakAtRef.current < 300) return;
                  lastSpeakAtRef.current = now;

                  // ✅ no tap FX here — keep the word clean
                  speakPromptEN(correctItem as any, effectiveAudio);
                }}
                disabled={!correctItem}
                style={[styles.bigBtn, styles.hearBtn]}
              >
                {t('learn.quiz.buttonHear')}
              </Button>

              <Button
                onClick={() => {
                  if (!correctItem) return;

                  const now = Date.now();
                  if (now - lastSpeakAtRef.current < 300) return;
                  lastSpeakAtRef.current = now;

                  speakPromptHE(correctItem as any, effectiveAudio);
                }}
                disabled={!correctItem}
                style={[styles.bigBtn, styles.hearBtn]}
              >
                {t('learn.quiz.buttonHearHe')}
              </Button>
            </View>
          </View>

          {/* ✅ GRID 2×2 – STABLE (no gap) */}
          <View style={styles.optionsGrid}>
            {q!.optionIds.map((id) => {
              const it = byId.get(id);
              if (!it) return null;

              const isCorrect = id === correctId;
              const isSelected = selected === id;

              const tileStyle = [
                styles.optionTile,
                locked && isSelected && isCorrect ? styles.tileCorrect : null,
                locked && isSelected && !isCorrect ? styles.tileWrong : null,
                locked ? styles.tileLocked : null,
              ];

              return (
                <View key={id} style={styles.optionCell}>
                  <Pressable
                    disabled={locked}
                    style={tileStyle}
                    onPress={() => {
                      if (locked) return;

                      stopTTS();

                      // ✅ choice feedback
                      // success = correct answer, error = wrong answer
                      playFx(isCorrect ? 'success' : 'error');

                      setSelected(id);
                      setLocked(true);

                      if (isCorrect) setCorrectCount((c) => c + 1);
                      else wrongIdsRef.current.add(correctId);

                      setTimeout(() => {
                        setSelected(null);
                        setLocked(false);

                        const nextIndex = qIndex + 1;

                        if (nextIndex >= questions.length) {
                          const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
                          const score = Math.round((finalCorrect / questions.length) * 100);
                          const passed = score >= QUIZ_PASS_SCORE;
                          setFinished({ score, passed });
                        } else {
                          setQIndex(nextIndex);
                        }
                      }, 700);
                    }}
                  >
                    <ItemVisual item={it as ContentItem} size={86} />
                  </Pressable>
                </View>
              );
            })}
          </View>

          {qIndex > 0 && (
            <Text style={styles.scoreLine}>
              {t('learn.quiz.scoreLine', {
                correct: String(correctCount),
                done: String(qIndex),
              })}
            </Text>
          )}
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

  h1: { fontWeight: '900', fontSize: 18 },
  muted: { marginTop: 8, opacity: 0.8, lineHeight: 20 },

  progressText: { fontSize: 13, opacity: 0.75, alignSelf: 'center' },

  toastBox: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  toastText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },

  barTrack: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: '#bbb', borderRadius: 999 },

  center: { alignItems: 'center' },
  centerBlock: { marginTop: 16, alignItems: 'center' },

  promptTitle: { fontWeight: '900', fontSize: 22, textAlign: 'center' },

  hearRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  hearBtn: { minWidth: 140 },

  bigBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14 },

  // ✅ Stable 2×2 grid without gap (Android safe)
  optionsGrid: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionCell: {
    width: '50%',
    padding: 7,
  },
  optionTile: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tileCorrect: {
    borderWidth: 3,
    borderColor: '#2ecc71',
    backgroundColor: '#f0fff6',
  },
  tileWrong: {
    borderWidth: 3,
    borderColor: '#e74c3c',
    backgroundColor: '#fff3f3',
  },
  tileLocked: { opacity: 0.95 },

  scoreLine: {
    marginTop: 14,
    fontSize: 13,
    opacity: 0.75,
    textAlign: 'center',
  },

  lockTitle: { fontWeight: '900', fontSize: 28, textAlign: 'center' },
  lockSub: { marginTop: 8, fontSize: 16, opacity: 0.85, textAlign: 'center' },
  lockHint: { marginTop: 10, fontSize: 14, opacity: 0.75, textAlign: 'center' },

  doneTitle: { fontWeight: '900', fontSize: 30, textAlign: 'center' },
  mutedCenter: { marginTop: 6, fontSize: 16, opacity: 0.85, textAlign: 'center' },
  scoreBig: { fontSize: 56, marginTop: 10 },

  doneButtons: { marginTop: 16, gap: 10, alignSelf: 'stretch' },
});