// src/games/tapMatch/TapMatchGameScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';

import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { useI18n } from '../../i18n/I18nContext';
import { getItemVisualImage } from '../../visuals/itemVisualRegistry';

import { GameHeader } from '../common/GameHeader';
import { useGameAudio } from '../common/useGameAudio';
import type { GameItem } from '../common/gameTypes';
import { getGamePoolItems, pickRandomItemsForGame, updateRecentIds } from '../common/gamePool';

import { ChildrenStore } from '../../storage/childrenStore';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated?: (updated: ChildProfile) => void;
  /** Optional injection (useful for tests/dev) */
  items?: GameItem[];
};

type OptionVM = {
  id: string;
  label: string;
  image?: any;
};

type Feedback = 'correct' | 'wrong' | 'timeout' | null;

const QUESTIONS_PER_SESSION = 20;
const OPTIONS_PER_QUESTION = 8;
const QUESTION_TIMEOUT_MS = 10_000;
const FEEDBACK_MS = 800; // ✅ per spec

export function TapMatchGameScreen({ child, onBack, onChildUpdated, items }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const audio = useGameAudio(child);

  const coinsAwardedRef = useRef(false);
  const feedbackTimerRef = useRef<any>(null);
  const timeoutTimerRef = useRef<any>(null);
  const tickTimerRef = useRef<any>(null);

  const questionStartMsRef = useRef<number>(0);
  const usedIdsSetRef = useRef<Set<string>>(new Set());
  const correctTimesRef = useRef<number[]>([]);
  const correctCountRef = useRef(0);
  const attemptCountRef = useRef(0);
  const timeoutCountRef = useRef(0);
  const questionEndedRef = useRef(false);

  const pool = useMemo(() => {
    const base = items?.length ? items : getGamePoolItems(child);
    return base.filter((it) => (it.ttsText ?? it.label)?.trim() && !!getItemVisualImage(it.visualId ?? it.id));
  }, [items, child.id]);

  const poolKey = useMemo(() => pool.map((x) => x.id).sort().join('|'), [pool]);

  const [round, setRound] = useState(0);
  const [rounds, setRounds] = useState<GameItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [locked, setLocked] = useState(false);
  const [remainingMs, setRemainingMs] = useState(QUESTION_TIMEOUT_MS);

  const [results, setResults] = useState<{
    correct: number;
    wrong: number;
    timeout: number;
    avgTimeSec: number | null;
    coins: number;
  } | null>(null);

  // ✅ prepare a session of 20 target items (avoid repetition using recents)
  useEffect(() => {
    coinsAwardedRef.current = false;
    usedIdsSetRef.current = new Set();
    correctTimesRef.current = [];
    correctCountRef.current = 0;
    attemptCountRef.current = 0;
    timeoutCountRef.current = 0;

    setResults(null);

    setRound(0);
    setSelectedId(null);
    setFeedback(null);
    setLocked(false);
    setRemainingMs(QUESTION_TIMEOUT_MS);

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }

    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }

    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }

    const sessionCount = Math.min(QUESTIONS_PER_SESSION, pool.length);
    const { picked, usedIds } = pickRandomItemsForGame({
      child,
      gameId: 'tap_match',
      pool,
      count: sessionCount,
    });

    setRounds(picked);

    // persist recents quietly (avoid App-level rerender loops)
    if (usedIds.length) {
      const updated = updateRecentIds(child, 'tap_match', usedIds);
      ChildrenStore.upsert(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child.id, poolKey]);

  const total = rounds.length;
  const done = total > 0 && round >= total;
  const question = !done && total > 0 ? rounds[round] : null;

  const progressLabel =
    total > 0 && !done ? `${round + 1}/${total}` : total > 0 ? `${total}/${total}` : undefined;

  const options = useMemo<OptionVM[]>(() => {
    if (!question) return [];

    const others = pool.filter((x) => x.id !== question.id);

    // shuffle others
    const shuffled = [...others];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const picked = [question, ...shuffled.slice(0, Math.max(0, Math.min(OPTIONS_PER_QUESTION, pool.length) - 1))];

    // shuffle final
    for (let i = picked.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [picked[i], picked[j]] = [picked[j], picked[i]];
    }

    // track all visuals used in this session (targets + distractors)
    for (const it of picked) usedIdsSetRef.current.add(it.id);

    return picked.map((it) => ({
      id: it.id,
      label: it.label,
      image: getItemVisualImage(it.visualId ?? it.id) ?? undefined,
    }));
  }, [question?.id, poolKey]);

  function clearQuestionTimers() {
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }

  function scheduleNext() {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setRound((r) => r + 1);
    }, FEEDBACK_MS);
  }

  function triggerTimeout() {
    if (!question) return;
    if (questionEndedRef.current) return;

    questionEndedRef.current = true;

    clearQuestionTimers();
    setRemainingMs(0);

    // timeout counts as attempt (per spec)
    attemptCountRef.current += 1;
    timeoutCountRef.current += 1;

    setLocked(true);
    setSelectedId(null);
    setFeedback('timeout');
    audio.error();
    scheduleNext();
  }

  // Start each question: speak + timers
  useEffect(() => {
    clearQuestionTimers();
    if (!question) return;

    // reset per-question UI
    questionEndedRef.current = false;
    setSelectedId(null);
    setFeedback(null);
    setLocked(false);

    // speak prompt
    audio.speak(question.ttsText ?? question.label);

    // timers
    questionStartMsRef.current = Date.now();
    setRemainingMs(QUESTION_TIMEOUT_MS);

    timeoutTimerRef.current = setTimeout(() => {
      triggerTimeout();
    }, QUESTION_TIMEOUT_MS);

    tickTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - questionStartMsRef.current;
      const rem = Math.max(0, QUESTION_TIMEOUT_MS - elapsed);
      setRemainingMs(rem);
      if (rem === 0) {
        // Be robust: if JS timers drift, ensure timeout is handled.
        triggerTimeout();
      }
    }, 100);

    return () => {
      clearQuestionTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  // award coins once when finished
  useEffect(() => {
    if (!done) return;
    if (coinsAwardedRef.current) return;
    coinsAwardedRef.current = true;

    // persist recents (all visuals used during this session)
    const used = Array.from(usedIdsSetRef.current);
    if (used.length) {
      const updated = updateRecentIds(child, 'tap_match', used);
      ChildrenStore.upsert(updated);
    }

    const totalAttempts = attemptCountRef.current;
    const totalCorrect = correctCountRef.current;
    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

    const times = correctTimesRef.current;
    const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : null;

    // coins: tier by avgTime (correct-only), multiplied by accuracy
    const baseCoins = 10;
    let speedMult = 0;
    if (avgTime === null) speedMult = 0;
    else if (avgTime <= 3) speedMult = 1.0;
    else if (avgTime <= 6) speedMult = 0.7;
    else if (avgTime <= 10) speedMult = 0.4;
    else speedMult = 0.2;

    const coins = Math.max(0, Math.floor(baseCoins * speedMult * accuracy));

    if (coins > 0) {
      ChildrenStore.addCoins(child.id, coins);
    }

    const totalTimeout = timeoutCountRef.current;
    const totalWrong = Math.max(0, totalAttempts - totalCorrect - totalTimeout);

    setResults({
      correct: totalCorrect,
      wrong: totalWrong,
      timeout: totalTimeout,
      avgTimeSec: avgTime,
      coins,
    });

    const updated = ChildrenStore.getById(child.id) ?? child;
    onChildUpdated?.(updated);

    audio.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, child.id]);

  function onPick(optionId: string) {
    if (!question) return;
    if (questionEndedRef.current) return;

    questionEndedRef.current = true;

    clearQuestionTimers();

    attemptCountRef.current += 1;
    setLocked(true);
    setSelectedId(optionId);

    const isCorrect = optionId === question.id;
    if (isCorrect) {
      const seconds = (Date.now() - questionStartMsRef.current) / 1000;
      correctTimesRef.current.push(seconds);
      correctCountRef.current += 1;

      setFeedback('correct');
      audio.success();
      scheduleNext();
      return;
    }

    setFeedback('wrong');
    audio.error();
    scheduleNext();
  }

  const secondsLeft = Math.ceil(remainingMs / 1000);

  return (
    <View style={styles.root}>
      <GameHeader
        title={t('gamesHub.gameTap.title')}
        onBack={onBack}
        dir={dir}
        progressLabel={progressLabel}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {pool.length < 2 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, isRtl && styles.rtl]}>{t('gamesHub.noWords.title')}</Text>
            <Text style={[styles.emptyDesc, isRtl && styles.rtl]}>{t('gamesHub.noWords.desc')}</Text>
          </Card>
        ) : null}

        {question ? (
          <>
            <View style={styles.topRow}>
              <View style={styles.timerPill}>
                <Text style={styles.timerText}>⏳ {secondsLeft}s</Text>
              </View>

              <View style={styles.repeatWrap}>
                <Button onClick={() => audio.speak(question.ttsText ?? question.label)}>
                  🔊 {t('games.listen.repeat')}
                </Button>
              </View>
            </View>

            {feedback ? (
              <View style={styles.feedbackWrap}>
                <Text
                  style={[
                    styles.feedbackText,
                    feedback === 'correct'
                      ? styles.feedbackCorrect
                      : feedback === 'timeout'
                        ? styles.feedbackTimeout
                        : styles.feedbackWrong,
                    isRtl && styles.rtl,
                  ]}
                >
                  {feedback === 'correct'
                    ? t('games.feedback.correct')
                    : feedback === 'timeout'
                      ? t('games.feedback.timeout')
                      : t('games.feedback.wrong')}
                </Text>
              </View>
            ) : null}

            <View style={styles.grid}>
              {options.map((o) => {
                const isSel = selectedId === o.id;
                const borderStyle =
                  feedback && isSel
                    ? feedback === 'correct'
                      ? styles.borderCorrect
                      : styles.borderWrong
                    : null;

                return (
                  <Pressable
                    key={o.id}
                    onPress={() => onPick(o.id)}
                    style={[styles.option, borderStyle, feedback === 'timeout' ? styles.optionDim : null]}
                  >
                    {o.image ? (
                      <Image source={o.image} style={styles.img} resizeMode="contain" />
                    ) : (
                      <Text style={styles.fallback}>{o.label}</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {done && total > 0 ? (
          <Card style={styles.doneCard}>
            <Text style={[styles.doneTitle, isRtl && styles.rtl]}>{t('games.done.title')}</Text>
            <Text style={[styles.doneDesc, isRtl && styles.rtl]}>{t('games.done.desc')}</Text>

            {results ? (
              <View style={styles.resultsWrap}>
                <Text style={[styles.resultLine, isRtl && styles.rtl]}>
                  {t('games.results.correct')}: {results.correct}
                </Text>
                <Text style={[styles.resultLine, isRtl && styles.rtl]}>
                  {t('games.results.wrong')}: {results.wrong}
                </Text>
                <Text style={[styles.resultLine, isRtl && styles.rtl]}>
                  {t('games.results.timeout')}: {results.timeout}
                </Text>
                <Text style={[styles.resultLine, isRtl && styles.rtl]}>
                  {t('games.results.avgTime')}: {results.avgTimeSec === null ? '—' : `${results.avgTimeSec.toFixed(1)}s`}
                </Text>
                <Text style={[styles.resultLine, isRtl && styles.rtl]}>
                  {t('games.results.coins')}: {results.coins}
                </Text>
              </View>
            ) : null}

            <View style={styles.doneBtnRow}>
              <Button onClick={onBack}>{t('games.done.back')}</Button>
            </View>
          </Card>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 12, gap: 12 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  timerPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  timerText: { fontSize: 16, fontWeight: '900' },

  repeatWrap: { alignItems: 'flex-end' },

  feedbackWrap: { paddingVertical: 6 },
  feedbackText: { fontSize: 18, fontWeight: '800' },
  feedbackCorrect: {},
  feedbackWrong: {},
  feedbackTimeout: {},

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },

  option: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  optionDim: { opacity: 0.6 },

  borderCorrect: { borderColor: '#2e7d32' },
  borderWrong: { borderColor: '#c62828' },

  img: { width: '78%', height: '78%' },
  fallback: { fontSize: 22, fontWeight: '800' },

  emptyCard: { padding: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptyDesc: { marginTop: 8, fontSize: 14, opacity: 0.9 },

  doneCard: { padding: 14 },
  resultsWrap: { marginTop: 10, gap: 6 },
  resultLine: { fontSize: 16 },
  doneTitle: { fontSize: 18, fontWeight: '900' },
  doneDesc: { marginTop: 8, fontSize: 14, opacity: 0.9 },
  doneBtnRow: { marginTop: 12, alignItems: 'flex-start' },

  rtl: { textAlign: 'right' },
});
