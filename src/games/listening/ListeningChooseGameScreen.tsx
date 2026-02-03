// src/games/listening/ListeningChooseGameScreen.tsx
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

import { coinsRewardForGameSession } from '../../rewards/coins';
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
const FEEDBACK_MS = 1200; // ✅ time to see feedback before moving on

export function ListeningChooseGameScreen({ child, onBack, onChildUpdated, items }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const audio = useGameAudio(child);

  const mistakesRef = useRef(0);
  const coinsAwardedRef = useRef(false);
  const feedbackTimerRef = useRef<any>(null);

  const pool = useMemo(() => {
    const base = items?.length ? items : getGamePoolItems(child);
    // require speakable text + image visual (game is picture-based)
    return base.filter((it) => (it.ttsText ?? it.label)?.trim() && !!getItemVisualImage(it.visualId ?? it.id));
  }, [items, child.id]); // ✅ stable: avoid re-run on object identity

  const poolKey = useMemo(() => pool.map((x) => x.id).sort().join('|'), [pool]);

  const [round, setRound] = useState(0);
  const [rounds, setRounds] = useState<GameItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [locked, setLocked] = useState(false);

  // ✅ prepare a session of rounds (avoid repetition using recents)
  useEffect(() => {
    // reset
    mistakesRef.current = 0;
    coinsAwardedRef.current = false;
    setRound(0);
    setSelectedId(null);
    setFeedback(null);
    setLocked(false);

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }

    // Build rounds: distinct questions, prefer to avoid recents
    const sessionCount = Math.min(QUESTIONS_PER_SESSION, pool.length);
    const picked: GameItem[] = [];

    let tempChild = child;
    let remaining = pool;

    for (let i = 0; i < sessionCount; i++) {
      const { picked: one, usedIds } = pickRandomItemsForGame({
        child: tempChild,
        gameId: 'listen_choose',
        pool: remaining,
        count: 1,
      });

      if (!one.length) break;

      picked.push(one[0]);

      // update temp recents so the session itself avoids repeats
      tempChild = updateRecentIds(tempChild, 'listen_choose', usedIds);
      remaining = remaining.filter((x) => x.id !== one[0].id);
    }

    setRounds(picked);

    // persist recents quietly (avoid App-level rerender loops)
    if (picked.length) {
      const updated = updateRecentIds(child, 'listen_choose', picked.map((x) => x.id));
      ChildrenStore.upsert(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [child.id, poolKey]);

  const total = rounds.length;
  const done = total > 0 && round >= total;
  const question = !done && total > 0 ? rounds[round] : null;

  // ✅ 4 options: 1 correct + 3 random others
  const options = useMemo<OptionVM[]>(() => {
    if (!question) return [];

    const others = pool.filter((x) => x.id !== question.id);

    // shuffle others
    const shuffled = [...others];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const picked = [question, ...shuffled.slice(0, Math.max(0, OPTIONS_PER_QUESTION - 1))];

    // shuffle final
    for (let i = picked.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [picked[i], picked[j]] = [picked[j], picked[i]];
    }

    return picked.map((it) => ({
      id: it.id,
      label: it.label,
      image: getItemVisualImage(it.visualId ?? it.id) ?? undefined,
    }));
  }, [question?.id, poolKey]);

  // Speak at start of each question
  useEffect(() => {
    if (!question) return;

    audio.speak(question.ttsText ?? question.label);

    // reset per-question UI
    setSelectedId(null);
    setFeedback(null);
    setLocked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id]);

  // award coins once when finished
  useEffect(() => {
    if (!done) return;
    if (coinsAwardedRef.current) return;
    coinsAwardedRef.current = true;

    const latest = ChildrenStore.getById(child.id) ?? child;
    const perfect = mistakesRef.current === 0;
    const bonus = coinsRewardForGameSession(latest, { perfect });

    if (bonus > 0) {
      ChildrenStore.addCoins(child.id, bonus);
    }

    const updated = ChildrenStore.getById(child.id) ?? latest;
    onChildUpdated?.(updated);

    audio.complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, child.id]);

  function scheduleNext() {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setRound((r) => r + 1);
    }, FEEDBACK_MS);
  }

  function onPick(optionId: string) {
    if (!question) return;
    if (locked) return;

    setLocked(true);
    setSelectedId(optionId);

    const isCorrect = optionId === question.id;

    if (isCorrect) {
      setFeedback('correct');
      audio.success();
      scheduleNext();
      return;
    }

    // wrong:
    mistakesRef.current += 1;
    setFeedback('wrong');
    audio.error();
    scheduleNext();
  }

  const progressLabel =
    total > 0 && !done ? `${round + 1}/${total}` : total > 0 ? `${total}/${total}` : undefined;

  return (
    <View style={styles.root}>
      <GameHeader
        title={t('gamesHub.gameListen.title')}
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

        {question ? (
          <>
            <View style={styles.repeatRow}>
              <Button onClick={() => audio.speak(question.ttsText ?? question.label)}>
                🔊 {t('games.listen.repeat')}
              </Button>
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
                  <Pressable
                    key={o.id}
                    onPress={() => onPick(o.id)}
                    style={[styles.option, borderStyle]}
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

  repeatRow: { alignItems: 'flex-start' },

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
  doneTitle: { fontSize: 18, fontWeight: '900' },
  doneDesc: { marginTop: 8, fontSize: 14, opacity: 0.9 },
  doneBtnRow: { marginTop: 12, alignItems: 'flex-start' },

  rtl: { textAlign: 'right' },
});
