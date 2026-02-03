// src/screens/games/GamesHubScreen.tsx
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { useI18n } from '../../i18n/I18nContext';
import {
  getAllowedGameTypesForLevelLayer,
  getUnlockedLayerSnapshotA,
  type GameType,
} from '../../content';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onOpenGame: (type: GameType) => void;
};

export function GamesHubScreen({ child, onBack, onOpenGame }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const { unlockedLayer } = getUnlockedLayerSnapshotA(child, 'A');
  const allowed = new Set(getAllowedGameTypesForLevelLayer('A', unlockedLayer));

  const games: {
    type: GameType;
    title: string;
    desc: string;
    minLayer: number;
    implemented?: boolean;
  }[] = [
    {
      type: 'listen_choose',
      title: t('gamesHub.gameListen.title'),
      desc: t('gamesHub.gameListen.desc'),
      minLayer: 0,
      implemented: true,
    },
    {
      type: 'memory_pairs',
      title: t('gamesHub.gamePairs.title'),
      desc: t('gamesHub.gamePairs.desc'),
      minLayer: 1,
      implemented: true,
    },

    // placeholders (not implemented yet)
    {
      type: 'tap_match',
      title: t('gamesHub.gameTap.title'),
      desc: t('gamesHub.gameTap.desc'),
      minLayer: 0,
      implemented: false,
    },
    {
      type: 'phonics_match',
      title: t('gamesHub.gamePhonics.title'),
      desc: t('gamesHub.gamePhonics.desc'),
      minLayer: 3,
      implemented: false,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar title={t('gamesHub.title')} onBack={onBack} dir={dir} />

      <View style={styles.stack}>
        {games.map((g) => {
          const isUnlocked =
            (unlockedLayer as number) >= g.minLayer && allowed.has(g.type);

          const badgeText = isUnlocked
            ? g.implemented
              ? t('gamesHub.play')
              : t('gamesHub.badge')
            : isRtl
              ? `נעול עד שכבה ${g.minLayer}`
              : `Locked until layer ${g.minLayer}`;

          return (
            <Pressable
              key={g.type}
              disabled={!isUnlocked || !g.implemented}
              onPress={() => {
                if (!isUnlocked || !g.implemented) return;
                onOpenGame(g.type);
              }}
              style={({ pressed }) => [
                !isUnlocked ? styles.lockedCard : undefined,
                isUnlocked && g.implemented ? styles.pressableCard : undefined,
                pressed && isUnlocked && g.implemented ? styles.pressed : undefined,
              ]}
            >
              <Card>
                <View style={[styles.row, isRtl && styles.rowRtl]}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={[styles.gameTitle, isRtl && styles.rtl]}
                      numberOfLines={1}
                    >
                      {g.title}
                    </Text>
                    <Text style={[styles.gameDesc, isRtl && styles.rtl]}>
                      {g.desc}
                    </Text>
                  </View>

                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeText}</Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 26,
    maxWidth: 820,
    alignSelf: 'center',
    width: '100%',
  },
  stack: { marginTop: 14, gap: 10 },

  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rowRtl: { flexDirection: 'row-reverse' as const },

  gameTitle: { fontWeight: '900', fontSize: 16 },
  gameDesc: { marginTop: 6, fontSize: 13, opacity: 0.75, lineHeight: 20 },

  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
    opacity: 0.9,
  },
  badgeText: { fontSize: 12, fontWeight: '800' },

  lockedCard: { opacity: 0.65 },

  // When a card is tappable we give it a subtle emphasis.
  pressableCard: {
    borderRadius: 14,
  },

  // Press feedback (kept minimal; Card provides most visuals).
  pressed: {
    opacity: 0.88,
  },

  rtl: { textAlign: 'right' as const },
});
