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

import { getItemVisualImage } from '../../visuals/itemVisualRegistry';
import { GameHeader } from '../common/GameHeader';
import { useGameAudio } from '../common/useGameAudio';
import type { GameItem } from '../common/gameTypes';
import {
  getGamePoolItems,
  pickRandomItemsForGame,
  updateRecentIds,
} from '../common/gamePool';

import { useI18n } from '../../i18n/I18nContext';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated?: (updated: ChildProfile) => void;

  /** Optional override for tests/dev. */
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

function fontSizeForWord(word: string) {
  const n = (word ?? '').length;
  if (n <= 6) return 22;
  if (n <= 9) return 18;
  if (n <= 12) return 16;
  return 14;
}

export function MatchingGameScreen({
  child,
  onBack,
  onChildUpdated,
  items,
  pairsCount = 4,
}: Props) {
  const audio = useGameAudio(child);
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  // ✅ track mistakes + award-once
  const mistakesRef = useRef(0);
  const coinsAwardedRef = useRef(false);

  // ✅ pool comes from completed content (dynamic, per child)
  const pool = useMemo(() => {
    const base = items?.length ? items : getGamePoolItems(child);
    // avoid super long labels that won't fit nicely
    return base.filter(
      (it) => (it.ttsText ?? it.label)?.trim() && (it.label ?? '').length <= 12
    );
  }, [items, child]);

  const [seed, setSeed] = useState(0);

  // ✅ pick pairs using the REAL signature in your project
  const pickedPairs = useMemo(() => {
    const count = Math.max(2, Math.min(pairsCount, pool.length));
    return pickRandomItemsForGame({
      child,
      gameId: 'memory_pairs',
      pool,
      count,
    });
  }, [pool, pairsCount, child, seed]);

  // ✅ persist recents quietly (no onChildUpdated here)
  useEffect(() => {
    if (!pickedPairs.usedIds.length) return;

    const updatedChild = updateRecentIds(child, 'memory_pairs', pickedPairs.usedIds);

    // Save quietly to the store. Do NOT call onChildUpdated here,
    // otherwise App.tsx may set state and cause a render loop.
    ChildrenStore.upsert(updatedChild);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedPairs.usedIds.join('|'), child.id]);

  const deck = useMemo(() => {
    const cards: CardVM[] = [];
    for (const it of pickedPairs.picked) {
      cards.push({
        cardId: `${it.id}:img:${seed}`,
        pairId: it.id,
        kind: 'image',
        item: it,
      });
      cards.push({
        cardId: `${it.id}:word:${seed}`,
        pairId: it.id,
        kind: 'word',
        item: it,
      });
    }
    return shuffle(cards);
  }, [pickedPairs.picked, seed]);

  const [openCardIds, setOpenCardIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(() => new Set());
  const [locked, setLocked] = useState(false);

  const totalPairs = useMemo(() => {
    const s = new Set(deck.map((c) => c.pairId));
    return s.size;
  }, [deck]);

  const done = totalPairs > 0 && matchedPairIds.size >= totalPairs;

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
      const updated = ChildrenStore.getById(child.id) ?? latest;
      onChildUpdated?.(updated);
    }
  }, [done, child, onChildUpdated]);

  function resetGame() {
    audio.tap();
    mistakesRef.current = 0;
    coinsAwardedRef.current = false;
    setOpenCardIds([]);
    setMatchedPairIds(new Set());
    setSeed((s) => s + 1);
  }

  function speakWord(it: GameItem) {
    audio.speak(it.ttsText ?? it.label);
  }

  function onPressCard(card: CardVM) {
    if (locked) return;

    // already matched: allow "tap to repeat" only on WORD cards
    if (matchedPairIds.has(card.pairId)) {
      if (card.kind === 'word') {
        audio.tap();
        speakWord(card.item);
      }
      return;
    }

    // already open: repeat only on WORD cards (and don't close)
    if (openCardIds.includes(card.cardId)) {
      if (card.kind === 'word') {
        audio.tap();
        speakWord(card.item);
      }
      return;
    }

    audio.tap();

    // open
    const nextOpen = [...openCardIds, card.cardId];
    setOpenCardIds(nextOpen);

    // ✅ when opening a WORD card, speak immediately (kids can't read)
    if (card.kind === 'word') {
      speakWord(card.item);
    }

    // if only one card open, wait for second
    if (nextOpen.length < 2) return;

    // evaluate match
    const a = deck.find((c) => c.cardId === nextOpen[0]);
    const b = deck.find((c) => c.cardId === nextOpen[1]);
    if (!a || !b) return;

    const isMatch = a.pairId === b.pairId && a.kind !== b.kind;

    setLocked(true);

    if (isMatch) {
      // success: let any TTS finish a bit, then play success fx
      setTimeout(() => {
        audio.success();
        setMatchedPairIds((prev) => new Set(prev).add(a.pairId));
        setOpenCardIds([]);
        setLocked(false);
      }, 500);
    } else {
      mistakesRef.current += 1;
      audio.error();
      setTimeout(() => {
        setOpenCardIds([]);
        setLocked(false);
      }, 850);
    }
  }

  const finishBonus = coinsRewardForGameSession(child, {
    perfect: mistakesRef.current === 0,
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GameHeader
        title={t('gamesHub.gamePairs.title')}
        onBack={onBack}
        dir={dir}
        progressLabel={
          done ? t('games.common.completed') : `${matchedPairIds.size} / ${Math.max(1, totalPairs)}`
        }
      />

      {done ? (
        <Card>
          <Text style={[styles.big, isRtl && styles.rtl]}>
            {t('games.common.wellDone')}
          </Text>
          <Text style={[styles.coinsLine, isRtl && styles.rtl]}>
            {`הרווחת ${finishBonus} מטבעות`}
          </Text>

          <View style={styles.row}>
            <Button onClick={resetGame}>{t('games.common.playAgain')}</Button>
            <Button variant="secondary" onClick={onBack}>
              {t('games.common.back')}
            </Button>
          </View>
        </Card>
      ) : deck.length === 0 ? (
        <Card>
          <Text style={[styles.title, isRtl && styles.rtl]}>{t('games.common.empty')}</Text>
          <Text style={[styles.subtitle, isRtl && styles.rtl]}>
            סיים שכבה 2 כדי לפתוח מילים למשחקים.
          </Text>
          <View style={styles.row}>
            <Button onClick={onBack}>{t('games.common.back')}</Button>
          </View>
        </Card>
      ) : (
        <>
          <Card>
            <Text style={[styles.hint, isRtl && styles.rtl]}>
              {t('games.matching.prompt')}. לחץ על כרטיס מילה כדי לשמוע אותה.
            </Text>
          </Card>

          <View style={styles.grid}>
            {deck.map((card) => {
              const isOpen = openCardIds.includes(card.cardId);
              const isMatched = matchedPairIds.has(card.pairId);
              const faceUp = isOpen || isMatched;

              const imgSource =
                card.kind === 'image'
                  ? (getItemVisualImage(card.item.visualId ?? card.item.id) ?? undefined)
                  : undefined;

              return (
                <Pressable
                  key={card.cardId}
                  onPress={() => onPressCard(card)}
                  style={[styles.slot, isMatched && styles.slotMatched]}
                >
                  {faceUp ? (
                    card.kind === 'image' ? (
                      imgSource ? (
                        <Image
                          source={imgSource}
                          style={styles.img}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.backText}>?</Text>
                      )
                    ) : (
                      <Text
                        style={[
                          styles.word,
                          { fontSize: fontSizeForWord(card.item.label) },
                        ]}
                      >
                        {card.item.label}
                      </Text>
                    )
                  ) : (
                    <View style={styles.back}>
                      <Text style={styles.backText}>?</Text>
                    </View>
                  )}
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
  container: { padding: 12, gap: 12 },

  title: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  subtitle: { opacity: 0.8 },

  hint: { fontSize: 16, opacity: 0.9 },

  big: { fontSize: 26, fontWeight: '900', marginBottom: 6 },
  coinsLine: { fontSize: 16, opacity: 0.85, marginBottom: 12 },

  row: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: 12 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  slot: {
    width: 150,
    height: 120,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e6e6e6',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  slotMatched: {
    borderColor: '#cfead6',
    backgroundColor: '#f7fffa',
  },

  back: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 42, opacity: 0.5 },

  img: { width: 90, height: 90 },
  word: { fontWeight: '900' },

  rtl: { writingDirection: 'rtl', textAlign: 'right' },
});
