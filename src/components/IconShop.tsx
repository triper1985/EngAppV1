// src/components/IconShop.tsx
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { DimensionValue } from 'react-native';

import { ICONS, iconToDisplay } from '../data/icons';
import { getIconPrice, isIconFree } from '../data/iconShop';

import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { useI18n } from '../i18n/I18nContext';

type Props = {
  coins: number;
  unlockedIconIds: string[];
  onBuy: (iconId: string, price: number) => void;
};

type Filter = 'all' | 'canBuy' | 'free';

type Category =
  | 'all'
  | 'animals'
  | 'space'
  | 'sports'
  | 'food'
  | 'nature'
  | 'fantasy'
  | 'faces'
  | 'objects';


export function IconShop({ coins, unlockedIconIds, onBuy }: Props) {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>('all');
  const [category, setCategory] = useState<Category>('all');
  const [confirming, setConfirming] = useState<{
    iconId: string;
    label: string;
    price: number;
  } | null>(null);

  const unlocked = useMemo(
    () => new Set<string>(unlockedIconIds ?? []),
    [unlockedIconIds]
  );

  const lockedIcons = useMemo(() => ICONS.filter((ic) => !unlocked.has(ic.id)), [unlocked]);

  const canBuyCount = useMemo(() => {
    return lockedIcons.filter((ic) => {
      const price = getIconPrice(ic.id);
      return isIconFree(ic.id) || coins >= price;
    }).length;
  }, [lockedIcons, coins]);

  const filteredLockedIcons = useMemo(() => {
    const base = lockedIcons.filter((ic) => {
      const price = getIconPrice(ic.id);
      const free = isIconFree(ic.id);
      const canBuy = free || coins >= price;

      if (category !== 'all') {
        const c = (ic as any).category as string | undefined;
        if (c !== category) return false;
      }

      if (filter === 'all') return true;
      if (filter === 'free') return free;
      if (filter === 'canBuy') return canBuy;
      return true;
    });
    return base.sort((a, b) => getIconPrice(a.id) - getIconPrice(b.id));
  }, [lockedIcons, coins, filter, category]);

  function requestBuy(iconId: string, label: string) {
    const price = getIconPrice(iconId);
    const free = isIconFree(iconId);

    if (free) {
      onBuy(iconId, 0);
      return;
    }
    if (coins < price) return;

    setConfirming({ iconId, label, price });
  }

  function doBuy() {
    if (!confirming) return;
    onBuy(confirming.iconId, confirming.price);
    setConfirming(null);
  }

  const { width } = useWindowDimensions();
  const numColumns = width >= 720 ? 3 : 2;

  // We intentionally avoid FlatList here because IconShop is often rendered inside a ScrollView
  // in the screen, and nested VirtualizedList causes RN warnings & broken behavior.
  const cellWidthPct = `${100 / numColumns}%`;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t('rewards.shop.cardTitle')}</Text>
          <Text style={styles.subtitle}>{t('rewards.shop.cardSubtitle')}</Text>
        </View>

        <View style={styles.coinsPill}>
          <Text style={styles.coinsText}>{t('rewards.shop.coinsPill', { coins })}</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <Button
          variant="pill"
          onClick={() => setFilter('all')}
          style={filter === 'all' ? styles.filterSelected : undefined}
        >
          {t('rewards.shop.filter.all', { count: lockedIcons.length })}
        </Button>

        <Button
          variant="pill"
          onClick={() => setFilter('canBuy')}
          style={filter === 'canBuy' ? styles.filterSelected : undefined}
        >
          {t('rewards.shop.filter.canBuy', { count: canBuyCount })}
        </Button>

        <Button
          variant="pill"
          onClick={() => setFilter('free')}
          style={filter === 'free' ? styles.filterSelected : undefined}
        >
          {t('rewards.shop.filter.free')}
        </Button>
      </View>

      <View style={styles.categories}>
        <Button
          variant="pill"
          onClick={() => setCategory('all')}
          style={category === 'all' ? styles.filterSelected : undefined}
        >
          {t('rewards.shop.category.all')}
        </Button>

        {(['animals', 'space', 'sports', 'food', 'nature', 'fantasy', 'faces', 'objects'] as Category[]).map((c) => (
          <Button
            key={c}
            variant="pill"
            onClick={() => setCategory(c)}
            style={category === c ? styles.filterSelected : undefined}
          >
            {t(`rewards.shop.category.${c}`)}
          </Button>
        ))}
      </View>

      <View style={{ marginTop: 14 }}>
        {lockedIcons.length === 0 ? (
          <Text style={styles.info}>{t('rewards.shop.info.allUnlocked')}</Text>
        ) : filteredLockedIcons.length === 0 ? (
          <Text style={styles.info}>{t('rewards.shop.info.noMatch')}</Text>
        ) : (
          <View style={styles.gridWrap}>
            {filteredLockedIcons.map((ic) => {
              const price = getIconPrice(ic.id);
              const free = isIconFree(ic.id);
              const canBuy = free || coins >= price;
              const need = Math.max(0, price - coins);

              return (
                <View key={ic.id} style={[styles.cell, { width: cellWidthPct as unknown as DimensionValue}]}>
                  <View style={styles.itemCard}>
                    <View style={styles.itemTop}>
                      <Text style={styles.itemEmoji}>{iconToDisplay(ic.id)}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemLabel}>{ic.label}</Text>
                        <Text style={styles.itemMeta}>
                          {t('rewards.shop.priceLabel')}: <Text style={styles.bold}>{price <= 0 ? t('rewards.shop.price.free') : t('rewards.shop.price.coins', { price })}</Text>
                        </Text>
                      </View>
                    </View>

                    <Button
                      fullWidth
                      disabled={!canBuy}
                      onClick={() => requestBuy(ic.id, ic.label)}
                    >
                      {free ? t('rewards.shop.action.getFree') : canBuy ? t('rewards.shop.action.buy') : t('rewards.shop.action.needMore', { need })}
                    </Button>

                    {!free && !canBuy ? (
                      <Text style={styles.notEnough}>{t('rewards.shop.info.notEnoughCoins')}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <Modal open={!!confirming} title={t('rewards.shop.confirm.title')} onClose={() => setConfirming(null)}>
        {confirming ? (
          <>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmEmoji}>{iconToDisplay(confirming.iconId)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.confirmTitle}>{confirming.label}</Text>
                <Text style={styles.confirmMeta}>
                  {t('rewards.shop.confirm.price')}: <Text style={styles.bold}>{confirming.price}</Text> {t('rewards.shop.confirm.coinsWord')}
                </Text>
                <Text style={styles.confirmMeta}>
                  {t('rewards.shop.confirm.afterPurchase')}{' '}
                  <Text style={styles.bold}>{Math.max(0, coins - confirming.price)}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.confirmActions}>
              <Button fullWidth onClick={() => setConfirming(null)}>
                Cancel
              </Button>
              <Button fullWidth variant="primary" onClick={doBuy}>
                Buy
              </Button>
            </View>
          </>
        ) : null}
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: { fontWeight: '900', fontSize: 18 },
  subtitle: { fontSize: 12, opacity: 0.7, marginTop: 2 },

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

  filters: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterSelected: { borderColor: '#111', borderWidth: 2 },

  categories: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  info: { paddingVertical: 10, fontSize: 14, opacity: 0.7 },

  // Grid (no FlatList)
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  cell: {
    paddingHorizontal: 6,
    paddingBottom: 12,
  },

  itemCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#fff',
  },
  itemTop: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 10 },
  itemEmoji: { fontSize: 42 },
  itemLabel: { fontWeight: '900', fontSize: 16 },
  itemMeta: { fontSize: 13, opacity: 0.75, marginTop: 2 },
  bold: { fontWeight: '900' },
  notEnough: { fontSize: 12, opacity: 0.65, marginTop: 8 },

  confirmRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  confirmEmoji: { fontSize: 46 },
  confirmTitle: { fontWeight: '900' },
  confirmMeta: { fontSize: 13, opacity: 0.75, marginTop: 4 },
  confirmActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
});
