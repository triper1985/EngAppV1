// src/screens/child/ChildHubScreen.tsx (Native)
import { ScrollView, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
  onStartLearn: () => void;
  onOpenRewardsShop: () => void;
  onOpenSpecialPacks: () => void;
  onOpenGames: () => void;
};

export function ChildHubScreen({
  child,
  onBack,
  onStartLearn,
  onOpenRewardsShop,
  onOpenSpecialPacks,
  onOpenGames,
}: Props) {
  const { t, dir } = useI18n();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title={t('child.hub.title', { name: child.name }) ?? child.name} onBack={onBack} dir={dir} />

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '800' }}>{child.name}</Text>
        <Text style={{ opacity: 0.7 }}>Coins: {child.coins ?? 0}</Text>
      </View>

      <Button variant="primary" fullWidth onClick={onStartLearn}>
        {t('child.hub.learn') ?? 'Start Learning'}
      </Button>

      <Button fullWidth onClick={onOpenRewardsShop}>
        {t('child.hub.rewards') ?? 'Rewards Shop'}
      </Button>

      <Button fullWidth onClick={onOpenSpecialPacks}>
        {t('child.hub.specialPacks') ?? 'Special Packs'}
      </Button>

      <Button fullWidth onClick={onOpenGames}>
        {t('child.hub.games') ?? 'Games'}
      </Button>

      <View style={{ marginTop: 12, opacity: 0.6 }}>
        <Text style={{ fontSize: 12 }}>
          Note: Advanced hub UI (icon picker, unlock snapshot) is currently available on web.
        </Text>
      </View>
    </ScrollView>
  );
}
