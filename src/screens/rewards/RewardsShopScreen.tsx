// src/screens/rewards/RewardsShopScreen.tsx (Native)
import { ScrollView, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';
import { TopBar } from '../../ui/TopBar';
import { Button } from '../../ui/Button';
import { useI18n } from '../../i18n/I18nContext';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
};

export function RewardsShopScreen({ child, onBack }: Props) {
  const { t, dir } = useI18n();
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TopBar title={t('rewards.title') ?? 'Rewards'} onBack={onBack} dir={dir} />
      <View style={{ gap: 8 }}>
        <Text style={{ fontWeight: '800', fontSize: 16 }}>{child.name}</Text>
        <Text style={{ opacity: 0.7 }}>Coins: {child.coins ?? 0}</Text>
      </View>

      <Text style={{ opacity: 0.75 }}>
        The full Rewards Shop UI is currently implemented for web. We'll port it to native in a later step.
      </Text>

      <Button onClick={onBack} fullWidth>
        {t('parent.common.back') ?? 'Back'}
      </Button>
    </ScrollView>
  );
}
