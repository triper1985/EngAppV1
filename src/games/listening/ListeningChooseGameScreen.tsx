// src/games/listening/ListeningChooseGameScreen.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ChildProfile } from '../../types';

import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

import { getItemVisualImage } from '../../visuals/itemVisualRegistry';
import { GameHeader } from '../common/GameHeader';
import { useGameAudio } from '../common/useGameAudio';
import type { GameItem } from '../common/gameTypes';

import { coinsRewardForGameSession } from '../../rewards/coins';
import { ChildrenStore } from '../../storage/childrenStore';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated?: (updated: ChildProfile) => void;

  /** Optional. If omitted, we use a tiny built-in demo list. */
  items?: GameItem[];

  /** 3–4 recommended */
  optionCount?: 3 | 4;
};

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sampleItems(): GameItem[] {
  // Beginner games are English-only by design.
  return [
    { id: 'apple', label: 'Apple', ttsText: 'Apple', visualId: 'food_apple' },
    { id: 'banana', label: 'Banana', ttsText: 'Banana', visualId: 'food_banana' },
    { id: 'dog', label: 'Dog', ttsText: 'Dog', visualId: 'dog' },
    { id: 'duck', label: 'Duck', ttsText: 'Duck', visualId: 'duck' },
    { id: 'fish', label: 'Fish', ttsText: 'Fish', visualId: 'fish' },
    { id: 'cow', label: 'Cow', ttsText: 'Cow', visualId: 'cow' },
  ];
}

export function ListeningChooseGameScreen({
  child,
  onBack,
  onChildUpdated,
  items,
  optionCount = 3,
}: Props) {
  const { t, dir } = useI18n();
  const audio = useGameAudio(child);

  const mistakesRef = useRef(0);
  const coinsAwardedRef = useRef(false);

  const pool = useMemo(() => {
    const base = items?.length ? items : sampleItems();
    return base.filter((it) => (it.ttsText ?? it.label)?.trim());
  }, [items]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null);

  useEffect(() => {
    setOrder(shuffle(pool.map((_, i) => i)));
    setRoundIndex(0);
    setLastQuestionId(null);
    mistakesRef.current = 0;
    coinsAwardedRef.current = false;
  }, [pool]);

  const total = order.length;
  const done = total > 0 && roundIndex >= total;
  const question = !done && total > 0 ? pool[order[roundIndex]] : null;

  const options = useMemo(() => {
    if (!question) return [];
    const others = pool.filter((x) => x.id !== question.id);
    const picked = shuffle(others).slice(0, Math.max(0, optionCount - 1));
    return shuffle([question, ...picked]);
  }, [pool, question, optionCount]);

  useEffect(() => {
    if (!question) return;
    if (lastQuestionId === question.id) return;
    setLastQuestionId(question.id);
    audio.speak(question.ttsText ?? question.label);
  }, [audio, question, lastQuestionId]);

  useEffect(() => {
    if (!done) return;
    if (coinsAwardedRef.current) return;
    coinsAwardedRef.current = true;

    const latest = ChildrenStore.getById(child.id) ?? child;
    const perfect = mistakesRef.current === 0;
    const bonus = coinsRewardForGameSession(latest, { perfect });

    if (bonus > 0) {
      ChildrenStore.addCoins(child.id, bonus);
      const updated = ChildrenStore.getById(child.id) ?? latest;
      onChildUpdated?.(updated);
    }
  }, [done, child, onChildUpdated]);

  function onPick(picked: GameItem) {
    if (!question || locked) return;
    audio.tap();

    if (picked.id === question.id) {
      setLocked(true);
      audio.success();
      audio.speak(question.ttsText ?? question.label);
      setTimeout(() => {
        setLocked(false);
        setRoundIndex((i) => i + 1);
      }, 650);
    } else {
      mistakesRef.current += 1;
      setLocked(true);
      audio.error();
      setTimeout(() => setLocked(false), 650);
    }
  }

  function onRepeat() {
    if (!question) return;
    audio.tap();
    audio.speak(question.ttsText ?? question.label);
  }

  function onPlayAgain() {
    audio.tap();
    mistakesRef.current = 0;
    coinsAwardedRef.current = false;
    setOrder(shuffle(pool.map((_, i) => i)));
    setRoundIndex(0);
    setLastQuestionId(null);
  }

  const finishBonus = coinsRewardForGameSession(child, { perfect: mistakesRef.current === 0 });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GameHeader
        title={t('games.listening.title')}
        onBack={onBack}
        dir={dir}
        progressLabel={done ? t('games.common.completed') : `${roundIndex + 1} / ${Math.max(1, total)}`}
      />

      {/* חשוב: done לפני question, כי question נהיה null ברגע ש-done */}
      {done ? (
        <Card>
          <Text style={styles.big}>{t('games.common.wellDone')}</Text>

          <Text style={styles.coinsLine}>
            {t('games.common.coinsLine', { bonus: String(finishBonus) })}
          </Text>

          <View style={styles.row}>
            <Button onClick={onPlayAgain}>{t('games.common.playAgain')}</Button>
            <Button variant="secondary" onClick={onBack}>
              {t('games.common.back')}
            </Button>
          </View>
        </Card>
      ) : !question ? (
        <Card>
          <Text style={styles.title}>{t('games.common.empty')}</Text>
        </Card>
      ) : (
        <>
          <Card>
            <View style={styles.repeatRow}>
              <Pressable
                onPress={onRepeat}
                style={({ pressed }) => [styles.repeatBtn, pressed ? styles.repeatBtnPressed : null]}
                accessibilityRole="button"
              >
                <Text style={styles.repeatIcon}>🔊</Text>
                <Text style={styles.repeatText}>Repeat</Text>
              </Pressable>
            </View>
          </Card>

          <View style={styles.grid}>
            {options.map((opt) => {
              const img = opt.visualId ? getItemVisualImage(opt.visualId) : null;

              return (
                <Pressable
                  key={opt.id}
                  onPress={() => onPick(opt)}
                  style={({ pressed }) => [
                    styles.tile,
                    pressed && !locked ? styles.tilePressed : null,
                    locked ? styles.tileLocked : null,
                  ]}
                >
                  <Card style={styles.tileCard}>
                    <View style={styles.tileInner}>
                      {img ? (
                        <Image source={img} style={styles.image} resizeMode="contain" />
                      ) : (
                        <Text style={styles.fallback}>?</Text>
                      )}
                      <Text style={styles.label} numberOfLines={1}>
                        {(opt.ttsText ?? opt.label) || ''}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 26,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    gap: 12,
  },

  big: { fontSize: 22, fontWeight: '900' },
  title: { fontSize: 16, fontWeight: '800' },

  coinsLine: {
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '800',
  },

  row: { marginTop: 12, flexDirection: 'row', gap: 10, flexWrap: 'wrap' },

  repeatRow: { flexDirection: 'row', justifyContent: 'center' },
  repeatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#eee',
  },
  repeatBtnPressed: { transform: [{ scale: 0.99 }], opacity: 0.9 },
  repeatIcon: { fontSize: 24 },
  repeatText: { fontSize: 16, fontWeight: '900' },

  grid: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  tile: { width: 160, maxWidth: '46%' },
  tilePressed: { transform: [{ scale: 0.98 }] },
  tileLocked: { opacity: 0.85 },

  tileCard: { padding: 10 },
  tileInner: { alignItems: 'center', gap: 10 },

  image: { width: 92, height: 92 },
  fallback: { fontSize: 42, fontWeight: '900', opacity: 0.3 },

  label: { fontSize: 12, fontWeight: '800', opacity: 0.65, textTransform: 'uppercase' },
});
