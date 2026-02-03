// src/screens/learn/UnitPracticeScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import type { ChildProfile } from '../../types';
import type { UnitId } from '../../tracks/beginnerTrack';
import type { ContentItem } from '../../content/types';

import { BEGINNER_UNITS, resolveUnitItems, type UnitDef } from '../../tracks/beginnerTrack';

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

import { getFailedIdsToday } from '../../tracks/beginnerProgress';

import { ChildrenStore } from '../../storage/childrenStore';
import { coinsRewardForUnitPractice } from '../../rewards/coins';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { shuffle } from './learnUtils';
import { useI18n } from '../../i18n/I18nContext';
import { ItemVisual } from './ItemVisual';

function getHebrewLabel(it: any): string {
  return (it?.heNiqqud ?? it?.he ?? '').toString();
}


function getSpeakTextHebrew(it: ContentItem): string {
  const anyIt = it as any;
  const linkHe = typeof anyIt?.link?.he === 'string' ? anyIt.link.he : '';
  if (linkHe && linkHe.trim()) return linkHe.trim();
  return (it.he ?? it.en ?? it.id ?? '').trim() || ' ';
}

type Props = {
  child: ChildProfile;
  unitId: UnitId;
  onBack: () => void;
  onChildUpdated?: (updated: ChildProfile) => void;

  // optional: smooth “practice → quiz”
  onStartQuiz?: (unitId: UnitId) => void;
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

function getSpeakTextForItem(it: ContentItem, _isRtl: boolean, effectiveAudio?: any): string {
  if (prefersHebrewTts(effectiveAudio)) {
    return (it as any).heNiqqud ?? it.he ?? it.en ?? it.id ?? ' ';
  }
  return it.en ?? it.he ?? it.id ?? ' ';
}

function speakPromptEN(it: any, isRtl: boolean, effectiveAudio: any) {
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

  const text = getSpeakTextForItem(it as ContentItem, isRtl, effectiveAudio);
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

export function UnitPracticeScreen({ child, unitId, onBack, onStartQuiz, onChildUpdated  }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  // ✅ Effective audio settings for THIS child (global + child override)
  const effectiveAudio = useMemo(() => getEffectiveAudioSettings(child), [child]);

  const unit: UnitDef | undefined = useMemo(
    () => BEGINNER_UNITS.find((u) => u.id === unitId),
    [unitId]
  );

  const unitTitle = useMemo(() => {
    if (!unit) return '';
    return unit.titleKey ? t(unit.titleKey) : unit.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, t]);

  const catalog = useMemo(() => {
    const packIds = ensureRequiredSelected(child.selectedPackIds ?? ['basic']);
    return getItemsForPackIds(packIds);
  }, [child.selectedPackIds]);

  const unitItems = useMemo(() => {
    if (!unit) return [];
    return resolveUnitItems(unit, catalog);
  }, [unit, catalog]);

  const failedIds = useMemo(() => getFailedIdsToday(child, unitId), [child, unitId]);

  const byId = useMemo(() => new Map(unitItems.map((it) => [it.id, it])), [unitItems]);

  const questions: Question[] = useMemo(() => {
    if (!unit || unitItems.length === 0) return [];

    const availableIds = unitItems.map((it) => it.id);
    const focused = failedIds.filter((id) => availableIds.includes(id));
    const practiceIds = focused.length > 0 ? focused : availableIds;

    const qCount = Math.min(6, practiceIds.length);
    const correctIds = shuffle(practiceIds).slice(0, qCount);

    return correctIds.map((correctId) => {
      const optionCount = Math.min(4, Math.max(3, availableIds.length));
      const distractors = shuffle(availableIds.filter((x) => x !== correctId)).slice(
        0,
        optionCount - 1
      );

      return { correctId, optionIds: shuffle([correctId, ...distractors]) };
    });
  }, [unit, unitItems, failedIds]);

  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const mistakesRef = useRef(0);
  const coinsAwardedRef = useRef(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const lastAutoSpeakKey = useRef<string>('');
  const lastSpeakAtRef = useRef(0);

  // ✅ play "complete" FX once when done screen is reached
  const doneFxPlayedRef = useRef(false);

  useEffect(() => {
    return () => stopTTS();
  }, []);

  useEffect(() => {
    setQIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setLocked(false);
    lastAutoSpeakKey.current = '';
    doneFxPlayedRef.current = false; // ✅ reset
  }, [unitId]);

  const focusedAvailable = useMemo(
    () => failedIds.filter((id) => byId.has(id)).length,
    [failedIds, byId]
  );

  // ✅ compute these BEFORE any conditional return
  const done = qIndex >= questions.length;
  const q = questions[qIndex];
  const correctItem = q ? byId.get(q.correctId) : undefined;

  // ✅ Hook must ALWAYS be called (no conditional returns before it)
  useEffect(() => {
    if (done) return;
    if (!correctItem) return;

    const key = `${unitId}:${qIndex}:${correctItem.id}`;
    if (lastAutoSpeakKey.current === key) return;
    lastAutoSpeakKey.current = key;

    const tt = setTimeout(() => {
      speakPromptEN(correctItem as any, isRtl, effectiveAudio);
}, 120);

    return () => clearTimeout(tt);
  }, [unitId, qIndex, correctItem, done, isRtl, effectiveAudio]);

  // ✅ when done becomes true, play "complete" once
  useEffect(() => {
    if (!done) return;
    if (doneFxPlayedRef.current) return;
    doneFxPlayedRef.current = true;

    playFx('complete');
  }, [done]);

  // ✅ award coins once when practice completes
  useEffect(() => {
    if (!done) return;
    if (coinsAwardedRef.current) return;
    coinsAwardedRef.current = true;

    const latest = ChildrenStore.getById(child.id) ?? child;
    const perfect = mistakesRef.current === 0;
    const bonus = coinsRewardForUnitPractice(latest, { perfect });

    if (bonus > 0) {
      ChildrenStore.addCoins(child.id, bonus);
      const updated = ChildrenStore.getById(child.id) ?? latest;
      onChildUpdated?.(updated);
    }
  }, [done, child, onChildUpdated]); 

  // -----------------------------------------
  // Render
  // -----------------------------------------

  if (!unit) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar
          backLabel={t('learn.common.back')}
          dir={dir}
          title={t('learn.practice.titleFallback')}
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

  const topTitle = `${unitTitle} — ${t('learn.practice.titleShort')}`;

  if (unitItems.length === 0 || questions.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar backLabel={t('learn.common.back')} dir={dir} title={topTitle} onBack={onBack} />
        <View style={{ marginTop: 14 }}>
          <Card>
            <Text style={styles.h1}>{t('learn.practice.notEnoughTitle')}</Text>
            <Text style={styles.muted}>{t('learn.practice.notEnoughSubtitle')}</Text>
          </Card>
        </View>
      </ScrollView>
    );
  }

  if (done) {
    const score = Math.round((correctCount / questions.length) * 100);

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TopBar backLabel={t('learn.common.back')} dir={dir} title={topTitle} onBack={onBack} />

        <View style={{ marginTop: 14 }}>
          <Card>
            <View style={styles.center}>
              <Text style={styles.doneTitle}>{t('learn.practice.doneTitle')}</Text>

              {focusedAvailable > 0 ? (
                <Text style={styles.mutedCenter}>{t('learn.practice.doneFocused')}</Text>
              ) : (
                <Text style={styles.mutedCenter}>{t('learn.practice.doneGeneral')}</Text>
              )}

              <Text style={styles.scoreBig}>{score}%</Text>

              <Text style={styles.mutedCenter}>
                {t('learn.practice.correctLine', {
                  correct: String(correctCount),
                  total: String(questions.length),
                })}
              </Text>

              <View style={styles.doneButtons}>
                {onStartQuiz && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      stopAllFx();
                      stopTTS();
                      onStartQuiz(unitId);
                    }}
                  >
                    {t('learn.practice.buttonTryQuiz')}
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

  const progressPct = Math.round(((qIndex + 1) / questions.length) * 100);
  const subtitle =
    focusedAvailable > 0 ? t('learn.practice.subtitleFocused') : t('learn.practice.subtitleGeneral');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar
        backLabel={t('learn.common.back')}
        dir={dir}
        title={topTitle}
        onBack={onBack}
        right={
          <Text style={styles.progressText}>
            {qIndex + 1}/{questions.length}
          </Text>
        }
      />

      <View style={{ marginTop: 14 }}>
        <Card>
          <Text style={[styles.muted, isRtl && styles.rtl]}>{subtitle}</Text>

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
                  speakPromptEN(correctItem as any, isRtl, effectiveAudio);
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

          <View style={styles.optionsGrid}>
            {q.optionIds.map((id) => {
              const it = byId.get(id);
              if (!it) return null;

              const isCorrect = id === q.correctId;
              const isSelected = selected === id;

              const tileStyle = [
                styles.optionTile,
                locked && isSelected && isCorrect ? styles.tileCorrect : null,
                locked && isSelected && !isCorrect ? styles.tileWrong : null,
                locked ? styles.tileLocked : null,
              ];

              return (
                <Pressable
                  key={id}
                  disabled={locked}
                  style={tileStyle}
                  onPress={() => {
                    if (locked) return;

                    stopTTS();

                    setSelected(id);
                    setLocked(true);

                    if (isCorrect) {
                      setCorrectCount((c) => c + 1);
                      playFx('success');
                    } else {
                      mistakesRef.current += 1;
                      playFx('error');
                    }

                    setTimeout(() => {
                      setSelected(null);
                      setLocked(false);
                      setQIndex((i) => i + 1);
                    }, 520);
                  }}
                >
                  <ItemVisual item={it as ContentItem} size={78} />
                </Pressable>
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

  barTrack: {
    marginTop: 10,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#bbb',
    borderRadius: 999,
  },

  center: { alignItems: 'center' },
  centerBlock: { marginTop: 16, alignItems: 'center' },

  promptTitle: { fontWeight: '900', fontSize: 22, textAlign: 'center' },

  hearRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  hearBtn: { minWidth: 140 },

  bigBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14 },

  optionsGrid: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionTile: {
    width: '48%',
    marginBottom: 14,
    minHeight: 140,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e6e6e6',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 10,
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

  doneTitle: { fontWeight: '900', fontSize: 30, textAlign: 'center' },
  mutedCenter: { marginTop: 8, opacity: 0.8, textAlign: 'center', lineHeight: 20 },
  scoreBig: { fontSize: 56, marginTop: 10 },

  doneButtons: { marginTop: 16, gap: 10, alignSelf: 'stretch' },
});
