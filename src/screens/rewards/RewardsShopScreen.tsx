// src/screens/rewards/RewardsShopScreen.tsx
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ChildProfile } from '../../types';

import { ICONS } from '../../data/icons';
import { ChildrenStore } from '../../storage/childrenStore';

import { IconShop } from '../../components/IconShop';
import { IconPicker } from '../../components/IconPicker';
import { Confetti } from '../../components/Confetti';

import { Button } from '../../ui/Button';
import { TopBar } from '../../ui/TopBar';
import { useToast } from '../../ui/useToast';

type Props = {
  child: ChildProfile;
  onBack: () => void;
  onChildUpdated: (updated: ChildProfile) => void;
};

type Tab = 'shop' | 'owned';

function getIconLabel(iconId?: string) {
  const found = ICONS.find((i) => i.id === iconId);
  return found?.label ?? String(iconId ?? '');
}

export function RewardsShopScreen({ child, onBack, onChildUpdated }: Props) {
  const [tab, setTab] = useState<Tab>('shop');
  const [confettiKey, setConfettiKey] = useState(0);

  const { toast, showToast } = useToast(1800);

  const coins = child.coins ?? 0;

  const unlockedIconIds = useMemo(() => {
    const base = new Set<string>(child.unlockedIconIds ?? []);
    if (child.iconId) base.add(child.iconId);
    return Array.from(base.values());
  }, [child.unlockedIconIds, child.iconId]);

  function refreshChildFromStore() {
    const latest = ChildrenStore.getById(child.id) ?? child;
    onChildUpdated(latest);
  }

  const shopSelected = tab === 'shop';
  const ownedSelected = tab === 'owned';

  return (
    <View style={styles.screen}>
      {confettiKey > 0 && <Confetti key={confettiKey} durationMs={900} pieces={70} />}

      <ScrollView contentContainerStyle={styles.container}>
        <TopBar title="Icon Shop" onBack={onBack} />

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            Child: <Text style={styles.bold}>{child.name}</Text>
          </Text>

          <View style={styles.coinsPill}>
            <Text style={styles.coinsText}>Coins: {coins}</Text>
          </View>
        </View>

        <View style={styles.toastWrap}>{!!toast && <Text style={styles.toastText}>{toast}</Text>}</View>

        <View style={styles.tabsRow}>
          <Button
            variant={shopSelected ? 'primary' : 'pill'}
            onClick={() => setTab('shop')}
            style={[styles.tabPill, shopSelected ? styles.tabSelected : null]}
          >
            Shop
          </Button>

          <Button
            variant={ownedSelected ? 'primary' : 'pill'}
            onClick={() => setTab('owned')}
            style={[styles.tabPill, ownedSelected ? styles.tabSelected : null]}
          >
            Owned
          </Button>
        </View>

        <View style={{ marginTop: 12 }}>
          {tab === 'shop' ? (
            <IconShop
              coins={coins}
              unlockedIconIds={unlockedIconIds}
              onBuy={(iconId: string, _price: number) => {
                const res = ChildrenStore.buyIcon(child.id, iconId);

                if (!res.ok) {
                  if (res.reason === 'not_enough_coins') {
                    showToast('Not enough coins.');
                    return;
                  }
                  showToast('Could not complete purchase.');
                  return;
                }

                onChildUpdated(res.child);
                setConfettiKey((k) => k + 1);

                if (res.price > 0) {
                  showToast(`Purchased ${getIconLabel(iconId)} for ${res.price} coins!`);
                } else {
                  showToast(`Unlocked ${getIconLabel(iconId)}!`);
                }
              }}
            />
          ) : (
            <IconPicker
              value={child.iconId}
              unlockedIconIds={unlockedIconIds}
              onPick={(iconId: string) => {
                const res = ChildrenStore.setActiveIcon(child.id, iconId);

                if (!res.ok) {
                  if (res.reason === 'not_unlocked') {
                    showToast('This icon is not unlocked yet.');
                    return;
                  }
                  showToast('Could not change icon.');
                  return;
                }

                showToast('Icon selected!');
                refreshChildFromStore();
              }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    padding: 16,
    paddingBottom: 28,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },

  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: { fontSize: 12, opacity: 0.75 },
  bold: { fontWeight: '900' },

  coinsPill: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minWidth: 92,
    alignItems: 'center',
  },
  coinsText: { fontWeight: '900' },

  toastWrap: { marginTop: 10, minHeight: 22, justifyContent: 'center' },
  toastText: { fontSize: 16 },

  tabsRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },

  // ensures pill look even when variant="primary"
  tabPill: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  // for selected tab: just stronger border (primary already makes bg/text)
  tabSelected: {
    borderWidth: 1,
    borderColor: '#111',
  },
});
