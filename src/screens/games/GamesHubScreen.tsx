// src/screens/games/GamesHubScreen.tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
};

export function GamesHubScreen({ child, onBack }: Props) {
  const { t, dir } = useI18n();
  const isRtl = dir === 'rtl';

  const { unlockedLayer } = getUnlockedLayerSnapshotA(child, 'A');
  const allowed = new Set(getAllowedGameTypesForLevelLayer('A', unlockedLayer));

  const games: Array<{
    type: GameType;
    title: string;
    desc: string;
    minLayer: number;
  }> = [
    {
      type: 'tap_match',
      title: t('gamesHub.game1.title'),
      desc: t('gamesHub.game1.desc'),
      minLayer: 0,
    },
    {
      type: 'memory_pairs',
      title: t('gamesHub.game2.title'),
      desc: t('gamesHub.game2.desc'),
      minLayer: 1,
    },
    {
      type: 'phonics_match',
      title: t('gamesHub.game3.title'),
      desc: t('gamesHub.game3.desc'),
      minLayer: 3,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar title={t('gamesHub.title')} onBack={onBack} dir={dir} />

      <View style={styles.stack}>
        <Card>
          <Text style={[styles.headerTitle, isRtl && styles.rtl]}>
            {t('gamesHub.header')}
          </Text>
          <Text style={[styles.intro, isRtl && styles.rtl]}>
            {t('gamesHub.intro')}
          </Text>
        </Card>

        {games.map((g) => {
          const isUnlocked =
            (unlockedLayer as number) >= g.minLayer && allowed.has(g.type);

          const badgeText = isUnlocked
            ? t('gamesHub.badge')
            : isRtl
              ? `נעול עד שכבה ${g.minLayer}`
              : `Locked until layer ${g.minLayer}`;

          return (
            <Card key={g.type} style={!isUnlocked ? styles.lockedCard : undefined}>
              <View style={[styles.row, isRtl && styles.rowRtl]}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.gameTitle, isRtl && styles.rtl]} numberOfLines={1}>
                    {g.title}
                  </Text>
                  <Text style={[styles.gameDesc, isRtl && styles.rtl]}>{g.desc}</Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badgeText}</Text>
                </View>
              </View>
            </Card>
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

  headerTitle: { fontWeight: '900', fontSize: 18 },
  intro: {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.75,
    lineHeight: 20,
  },

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

  rtl: { textAlign: 'right' as const },
});
