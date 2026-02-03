// src/games/phonicsMatch/PhonicsMatchGameScreen.tsx
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

const QUESTIONS_PER_SESSION = 12;
const OPTIONS_PER_QUESTION = 4;
const FEEDBACK_MS = 1200;

function firstLetter(label: string): string {
  const s = (label ?? '').trim();
  if (!s) return '';
  const c = s[0].toUpperCase();
  return /[A-Z]/.test(c) ? c : '';
}

export function PhonicsMatchGameScreen({ child, onBack, onChildUpdated, items }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const audio = useGameAudio(child);

  const coinsAwardedRef = useRef(false);
  const feedbackTimerRef = useRef<any>(null);
  const mistakesRef = useRef(0);
  const correctCountRef = useRef(0);
  const attemptCountRef = useRef(0);

  const pool = useMemo(() => {
    const base = items?.length ? items : getGamePoolItems(child);
    return base.filter((it) => (it.ttsText ?? it.label)?.trim() && !!getItemVisualImage(it.visualId ?? it.id));
  }, [items, child.id]);

  const poolKey = useMemo(() => pool.map((x) => x.id).sort().join('|'), [pool]);

  const [round, setRound] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [locked, setLocked] = useState(false);

  const [results, setResults] = useState<{
    correct: number;
    wrong: number;
    coins: number;
  } | null>(null);

  // Build a session of letters, sampled from pool items (avoid repetition via recents)
  useEffect(() => {
    mistakesRef.current = 0;
    correctCountRef.current = 0;
    attemptCountRef.current = 0;
    coinsAwardedRef.current = false;

    setResults(null);

    setRound(0);
    setSelectedId(null);
    setFeedback(null);
    setLocked(false);

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }

    // pick items to derive letters from, then dedupe letters
    const sessionCount = Math.min(Math.max(QUESTIONS_PER_SESSION * 2, QUESTIONS_PER_SESSION), pool.length);
    const { picked, usedIds } = pickRandomItemsForGame({
      child,
      gameId: 'phonics_match',
      pool,
      count: sessionCount,
    });

    const uniq: string[] = [];
    const seen = new Set<string>();
    for (const it of picked) {
      const l = firstLetter(it.label);
      if (!l) continue;
      if (seen.has(l)) continue;
      seen.add(l);
      uniq.push(l);
      if (uniq.length >= QUESTIONS_PER_SESSION) break;
    }

    setLetters(uniq);

    // persist recents quietly
    if (usedIds.length) {
      const updated = updateRecentIds(child, 'phonics_match', usedIds);
      ChildrenStore.upsert(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child.id, poolKey]);

  const total = letters.length;
  const done = total > 0 && round >= total;
  const letter = !done && total > 0 ? letters[round] : null;

  const progressLabel =
    total > 0 && !done ? `${round + 1}/${total}` : total > 0 ? `${total}/${total}` : undefined;

  // Options: pick 1 correct (word starting with the letter) + 3 wrong
  const options = useMemo<OptionVM[]>(() => {
    if (!letter) return [];

    const good = pool.filter((x) => firstLetter(x.label) === letter);
    const bad = pool.filter((x) => firstLetter(x.label) && firstLetter(x.label) !== letter);

    if (!good.length) return [];

    // shuffle helpers
    function shuffle<T>(arr: T[]) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    const correct = shuffle(good)[0];
    const wrongs = shuffle(bad).slice(0, Math.max(0, Math.min(OPTIONS_PER_QUESTION, 1 + bad.length) - 1));
    const picked = shuffle([correct, ...wrongs]);

    return picked.map((it) => ({
      id: it.id,
      label: it.label,
      image: getItemVisualImage(it.visualId ?? it.id) ?? undefined,
    }));
  }, [letter, poolKey]);

  // Speak at start of each round
  useEffect(() => {
    if (!letter) return;

    audio.speak(letter);
    setSelectedId(null);
    setFeedback(null);
    setLocked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter]);

  // award coins once when finished + compute results
  useEffect(() => {
    if (!done) return;
    if (coinsAwardedRef.current) return;
    coinsAwardedRef.current = true;

    const correct = correctCountRef.current;
    const wrong = mistakesRef.current;

    // Small, stable reward (like other games), scaled a bit by accuracy
    const accuracy = total > 0 ? correct / total : 0;
    let coins = wrong === 0 ? 5 : 3;
    if (accuracy >= 0.85) coins += 1;
    if (accuracy <= 0.4) coins = Math.max(1, coins - 1);

    setResults({ correct, wrong, coins });

    if (coins > 0) ChildrenStore.addCoins(child.id, coins);

    const updated = ChildrenStore.getById(child.id) ?? child;
    onChildUpdated?.(updated);

    audio.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, child.id, total]);
  function scheduleNext() {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setRound((r) => r + 1);
    }, FEEDBACK_MS);
  }

  function onPick(optionId: string) {
    if (!letter) return;
    if (locked) return;

    setLocked(true);
    setSelectedId(optionId);

    attemptCountRef.current += 1;

    const correct = firstLetter(pool.find((x) => x.id === optionId)?.label ?? '') === letter;
    if (correct) {
      correctCountRef.current += 1;
      setFeedback('correct');
      audio.success();
      scheduleNext();
      return;
    }

    mistakesRef.current += 1;
    setFeedback('wrong');
    audio.error();
    scheduleNext();
  }

  return (
    <View style={styles.root}>
      <GameHeader
        title={t('gamesHub.gamePhonics.title')}
        onBack={onBack}
        dir={dir}
        progressLabel={progressLabel}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {!pool.length ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, isRtl && styles.rtl]}>{t('gamesHub.noWords.title')}</Text>
            <Text style={[styles.emptyDesc, isRtl && styles.rtl]}>{t('gamesHub.noWords.desc')}</Text>
          </Card>
        ) : null}

        {letter ? (
          <>
            <View style={styles.promptCard}>
              <Text style={styles.promptLetter}>{letter}</Text>
              <View style={styles.repeatRow}>
                <Button onClick={() => audio.speak(letter)}>🔊 {t('games.listen.repeat')}</Button>
              </View>
            </View>

            {feedback ? (
              <View style={styles.feedbackWrap}>
                <Text
                  style={[
                    styles.feedbackText,
                    feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong,
                    isRtl && styles.rtl,
                  ]}
                >
                  {feedback === 'correct' ? t('games.feedback.correct') : t('games.feedback.wrong')}
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
                  <Pressable key={o.id} onPress={() => onPick(o.id)} style={[styles.option, borderStyle]}>
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

  promptCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 10,
  },
  promptLetter: { fontSize: 56, fontWeight: '900' },
  repeatRow: { alignItems: 'center' },

  feedbackWrap: { paddingVertical: 6 },
  feedbackText: { fontSize: 18, fontWeight: '800' },
  feedbackCorrect: {},
  feedbackWrong: {},

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
