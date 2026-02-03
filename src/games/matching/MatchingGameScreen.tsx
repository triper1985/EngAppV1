// src/games/matching/MatchingGameScreen.tsx
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
import { coinsRewardForGameSession } from '../../rewards/coins';
import { ChildrenStore } from '../../storage/childrenStore';

import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

import { getItemVisualImage } from '../../visuals/itemVisualRegistry';
import { GameHeader } from '../common/GameHeader';
import { useGameAudio } from '../common/useGameAudio';
import type { GameItem } from '../common/gameTypes';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated?: (updated: ChildProfile) => void;

  /** Optional. If omitted, we use a tiny built-in demo list. */
  items?: GameItem[];

  /** 4–6 pairs recommended (8–12 cards) */
  pairsCount?: number;
};

type CardKind = 'image' | 'word';

type CardVM = {
  cardId: string;
  pairId: string;
  kind: CardKind;
  item: GameItem;
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

export function MatchingGameScreen({
  child,
  onBack,
  onChildUpdated,
  items,
  pairsCount = 4,
}: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';
  const audio = useGameAudio(child);

  // ✅ track mistakes + award-once
  const mistakesRef = useRef(0);
  const coinsAwardedRef = useRef(false);

  const pool = useMemo(() => {
    const base = items?.length ? items : sampleItems();
    return base.filter((it) => (it.ttsText ?? it.label)?.trim());
  }, [items]);

  const [seed, setSeed] = useState(0);

  const deck = useMemo(() => {
    const picked = shuffle(pool).slice(0, Math.max(2, Math.min(pairsCount, pool.length)));
    const cards: CardVM[] = [];
    for (const it of picked) {
      cards.push({ cardId: `${it.id}:img:${seed}`, pairId: it.id, kind: 'image', item: it });
      cards.push({ cardId: `${it.id}:word:${seed}`, pairId: it.id, kind: 'word', item: it });
    }
    return shuffle(cards);
  }, [pool, pairsCount, seed]);

  const [openCardIds, setOpenCardIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(() => new Set());
  const [locked, setLocked] = useState(false);

  const totalPairs = useMemo(() => {
    const s = new Set(deck.map((c) => c.pairId));
    return s.size;
  }, [deck]);

  const done = matchedPairIds.size >= totalPairs && totalPairs > 0;

  // ✅ award coins once when finished
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

  function speakItem(it: GameItem) {
    const text = it.ttsText ?? it.label;
    if (!text) return;
    audio.speak(text);
  }

  function reset() {
    audio.tap();
    mistakesRef.current = 0;
    coinsAwardedRef.current = false;

    setSeed((s) => s + 1);
    setOpenCardIds([]);
    setMatchedPairIds(new Set());
    setLocked(false);
  }

  function onCardPress(card: CardVM) {
    const isMatched = matchedPairIds.has(card.pairId);
    const isOpen = openCardIds.includes(card.cardId);

    // ✅ Requirement: If face-up, tapping again repeats the word (doesn't close)
    if (isOpen || isMatched) {
      audio.tap();
      speakItem(card.item);
      return;
    }

    if (done) return;
    if (locked) return;
    if (matchedPairIds.has(card.pairId)) return;

    audio.tap();

    const nextOpen = [...openCardIds, card.cardId].slice(-2);
    setOpenCardIds(nextOpen);

    if (nextOpen.length === 2) {
      const [aId, bId] = nextOpen;
      const a = deck.find((c) => c.cardId === aId);
      const b = deck.find((c) => c.cardId === bId);
      if (!a || !b) return;

      setLocked(true);

      if (a.pairId === b.pairId) {
        audio.success();
        speakItem(a.item);
        setTimeout(() => {
          setMatchedPairIds((prev) => new Set([...prev, a.pairId]));
          setOpenCardIds([]);
          setLocked(false);
        }, 450);
      } else {
        mistakesRef.current += 1;
        audio.error();
        setTimeout(() => {
          setOpenCardIds([]);
          setLocked(false);
        }, 650);
      }
    }
  }

  const finishBonus = coinsRewardForGameSession(child, { perfect: mistakesRef.current === 0 });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GameHeader
        title={t('games.matching.title')}
        onBack={onBack}
        dir={dir}
        progressLabel={
          done
            ? t('games.common.completed')
            : isRtl
              ? `Pairs: ${matchedPairIds.size}/${totalPairs}`
              : `Pairs: ${matchedPairIds.size}/${totalPairs}`
        }
      />

      {done ? (
        <Card>
          <Text style={[styles.big, isRtl && styles.rtl]}>{t('games.common.wellDone')}</Text>

          <Text style={styles.coinsLine}>
            {t('games.common.coinsLine', { bonus: String(finishBonus) })}
          </Text>

          <View style={styles.row}>
            <Button onClick={reset}>{t('games.common.playAgain')}</Button>
            <Button variant="secondary" onClick={onBack}>
              {t('games.common.back')}
            </Button>
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={[styles.prompt, isRtl && styles.rtl]}>{t('games.matching.prompt')}</Text>
        </Card>
      )}

      <View style={styles.grid}>
        {deck.map((c) => {
          const isMatched = matchedPairIds.has(c.pairId);
          const isOpen = openCardIds.includes(c.cardId);
          const faceUp = isMatched || isOpen;

          const img = c.item.visualId ? getItemVisualImage(c.item.visualId) : null;

          return (
            <Pressable
              key={c.cardId}
              onPress={() => onCardPress(c)}
              style={({ pressed }) => [
                styles.tile,
                pressed && !locked ? styles.tilePressed : null,
                locked && !faceUp ? styles.tileLocked : null,
              ]}
            >
              <Card style={[styles.tileCard, isMatched ? styles.tileMatched : null]}>
                {faceUp ? (
                  c.kind === 'image' ? (
                    <View style={styles.face}>
                      {img ? (
                        <Image source={img} style={styles.image} resizeMode="contain" />
                      ) : (
                        <Text style={styles.fallback}>?</Text>
                      )}
                      {/* Small speaker cue */}
                      <Text style={styles.speakerHint}>🔊</Text>
                    </View>
                  ) : (
                    <View style={styles.face}>
                      <View style={styles.wordRow}>
                        <Text style={styles.speaker}>🔊</Text>
                        <Text style={[styles.word, isRtl && styles.rtl]} numberOfLines={1}>
                          {(c.item.ttsText ?? c.item.label) || ''}
                        </Text>
                      </View>
                      <Text style={styles.speakerHint}>tap to repeat</Text>
                    </View>
                  )
                ) : (
                  <View style={styles.back}>
                    <Text style={styles.backText}>?</Text>
                  </View>
                )}
              </Card>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row}>
        <Button variant="secondary" onClick={reset}>
          {t('games.common.restart')}
        </Button>
      </View>
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

  rtl: { textAlign: 'right' as const },

  big: { fontSize: 22, fontWeight: '900' },
  prompt: { fontSize: 16, fontWeight: '900' },

  coinsLine: {
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '800',
  },

  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },

  grid: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  tile: { width: 140, maxWidth: '30%' },
  tilePressed: { transform: [{ scale: 0.98 }] },
  tileLocked: { opacity: 0.85 },

  tileCard: { padding: 10, minHeight: 140, justifyContent: 'center' },
  tileMatched: { opacity: 0.88 },

  face: { alignItems: 'center', justifyContent: 'center', gap: 10 },

  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  speaker: { fontSize: 20 },
  word: { fontSize: 22, fontWeight: '900' },

  speakerHint: {
    fontSize: 12,
    fontWeight: '800',
    opacity: 0.55,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  back: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  backText: { fontSize: 42, fontWeight: '900', opacity: 0.18 },

  image: { width: 82, height: 82 },
  fallback: { fontSize: 42, fontWeight: '900', opacity: 0.3 },
});
