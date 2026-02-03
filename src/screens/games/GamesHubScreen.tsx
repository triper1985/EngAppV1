// src/screens/games/GamesHubScreen.tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';

import { TopBar } from '../../ui/TopBar';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { useI18n } from '../../i18n/I18nContext';
import { getUnlockedLayerSnapshotA, type GameType } from '../../content';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onOpenGame: (type: GameType) => void;
  /** Optional: allow hub to send user back to Learn when locked */
  onGoLearn?: () => void;
};

type GameCard = {
  type: GameType;
  titleKey: string;
  descKey: string;
  implemented: boolean;
};

const GAMES: GameCard[] = [
  {
    type: 'listen_choose',
    titleKey: 'gamesHub.gameListen.title',
    descKey: 'gamesHub.gameListen.desc',
    implemented: true,
  },
  {
    type: 'memory_pairs',
    titleKey: 'gamesHub.gamePairs.title',
    descKey: 'gamesHub.gamePairs.desc',
    implemented: true,
  },
  {
    type: 'tap_match',
    titleKey: 'gamesHub.gameTap.title',
    descKey: 'gamesHub.gameTap.desc',
    implemented: false,
  },
  {
    type: 'phonics_match',
    titleKey: 'gamesHub.gamePhonics.title',
    descKey: 'gamesHub.gamePhonics.desc',
    implemented: false,
  },
];

export function GamesHubScreen({ child, onBack, onOpenGame, onGoLearn }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  // ✅ Lock the entire Games hub until Layer 2 is completed
  // unlockedLayer = highestCompleted + 1, so Layer 2 completed => unlockedLayer >= 3
  const snapshot = getUnlockedLayerSnapshotA(child, 'A');
  const gamesUnlocked = (snapshot.unlockedLayer as number) >= 3;

  return (
    <View style={styles.root}>
      <TopBar title={t('gamesHub.title')} onBack={onBack} dir={dir} />

      <ScrollView contentContainerStyle={styles.content}>
        {!gamesUnlocked ? (
          <Card style={styles.lockCard}>
            <Text style={[styles.lockTitle, isRtl && styles.rtl]}>
              {t('gamesHub.locked.title')}
            </Text>
            <Text style={[styles.lockDesc, isRtl && styles.rtl]}>
              {t('gamesHub.locked.desc')}
            </Text>

            {onGoLearn ? (
              <View style={styles.lockBtnRow}>
                <Button onClick={onGoLearn}>{t('gamesHub.locked.cta')}</Button>
              </View>
            ) : null}
          </Card>
        ) : null}

        {GAMES.map((g) => {
          const disabled = !gamesUnlocked || !g.implemented;
          return (
            <Card key={g.type} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.textCol}>
                  <Text style={[styles.title, isRtl && styles.rtl]}>
                    {t(g.titleKey)}
                  </Text>
                  <Text style={[styles.desc, isRtl && styles.rtl]}>
                    {t(g.descKey)}
                  </Text>
                </View>

                <View style={styles.actionCol}>
                  {g.implemented ? (
                    <Button
                      onClick={() => onOpenGame(g.type)}
                      disabled={disabled}
                    >
                      {t('gamesHub.play')}
                    </Button>
                  ) : (
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badge}>{t('gamesHub.badge')}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 12, gap: 12 },
  card: { padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  textCol: { flex: 1 },
  actionCol: { width: 110, alignItems: 'flex-end' },

  title: { fontSize: 18, fontWeight: '700' },
  desc: { marginTop: 6, fontSize: 14, opacity: 0.85 },

  badgeWrap: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eee',
  },
  badge: { fontSize: 12, fontWeight: '700', opacity: 0.8 },

  lockCard: { padding: 14, marginBottom: 8 },
  lockTitle: { fontSize: 18, fontWeight: '800' },
  lockDesc: { marginTop: 8, fontSize: 14, opacity: 0.9 },
  lockBtnRow: { marginTop: 12, alignItems: 'flex-start' },

  rtl: { textAlign: 'right' },
});
