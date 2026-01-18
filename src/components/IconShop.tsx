// src/components/IconShop.tsx
import { useMemo, useState } from 'react';
import { ICONS, iconToDisplay } from '../data/icons';
import { getIconPrice, isIconFree } from '../data/iconShop';

import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';

type Props = {
  coins: number;
  unlockedIconIds: string[];
  onBuy: (iconId: string, price: number) => void;
};

type Filter = 'all' | 'canBuy' | 'free';

function priceLabel(price: number) {
  if (price <= 0) return 'Free';
  return `${price} coins`;
}

export function IconShop({ coins, unlockedIconIds, onBuy }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [confirming, setConfirming] = useState<{
    iconId: string;
    label: string;
    price: number;
  } | null>(null);

  const unlocked = useMemo(
    () => new Set<string>(unlockedIconIds ?? []),
    [unlockedIconIds]
  );

  const lockedIcons = useMemo(
    () => ICONS.filter((ic) => !unlocked.has(ic.id)),
    [unlocked]
  );

  const canBuyCount = useMemo(() => {
    return lockedIcons.filter((ic) => {
      const free = isIconFree(ic.id);
      if (free) return true;
      return coins >= getIconPrice(ic.id);
    }).length;
  }, [lockedIcons, coins]);

  const filteredLockedIcons = useMemo(() => {
    return lockedIcons.filter((ic) => {
      const price = getIconPrice(ic.id);
      const free = isIconFree(ic.id);
      const canBuy = free || coins >= price;

      if (filter === 'all') return true;
      if (filter === 'free') return free;
      if (filter === 'canBuy') return canBuy;
      return true;
    });
  }, [lockedIcons, coins, filter]);

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

  return (
    <Card style={{ padding: 16 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Icon Shop</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Unlock new icons with coins
          </div>
        </div>

        <div
          style={{
            padding: '8px 10px',
            borderRadius: 12,
            border: '1px solid #ddd',
            background: '#fff',
            fontWeight: 900,
            minWidth: 92,
            textAlign: 'center',
          }}
          title="Coins"
        >
          Coins: {coins}
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          variant="pill"
          onClick={() => setFilter('all')}
          style={
            filter === 'all'
              ? { background: '#111', color: '#fff', border: '1px solid #111' }
              : undefined
          }
        >
          All ({lockedIcons.length})
        </Button>

        <Button
          variant="pill"
          onClick={() => setFilter('canBuy')}
          style={
            filter === 'canBuy'
              ? { background: '#111', color: '#fff', border: '1px solid #111' }
              : undefined
          }
        >
          Can buy ({canBuyCount})
        </Button>

        <Button
          variant="pill"
          onClick={() => setFilter('free')}
          style={
            filter === 'free'
              ? { background: '#111', color: '#fff', border: '1px solid #111' }
              : undefined
          }
        >
          Free
        </Button>
      </div>

      {/* Grid */}
      <div style={{ marginTop: 14 }}>
        {lockedIcons.length === 0 ? (
          <div style={{ padding: 10, fontSize: 14, opacity: 0.7 }}>
            🎉 All icons unlocked!
          </div>
        ) : filteredLockedIcons.length === 0 ? (
          <div style={{ padding: 10, fontSize: 14, opacity: 0.7 }}>
            Nothing matches this filter.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {filteredLockedIcons.map((ic) => {
              const price = getIconPrice(ic.id);
              const free = isIconFree(ic.id);
              const canBuy = free || coins >= price;
              const need = Math.max(0, price - coins);

              return (
                <div
                  key={ic.id}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: 14,
                    padding: 14,
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div
                    style={{ display: 'flex', gap: 12, alignItems: 'center' }}
                  >
                    <div style={{ fontSize: 42 }}>{iconToDisplay(ic.id)}</div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 900, fontSize: 16 }}>
                        {ic.label}
                      </div>
                      <div
                        style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}
                      >
                        Price: <b>{priceLabel(price)}</b>
                      </div>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    disabled={!canBuy}
                    onClick={() => requestBuy(ic.id, ic.label)}
                    title={
                      !free && !canBuy ? `Need ${need} more coins` : undefined
                    }
                  >
                    {free
                      ? 'Get for free'
                      : canBuy
                      ? 'Buy'
                      : `Need ${need} more`}
                  </Button>

                  {!free && !canBuy && (
                    <div style={{ fontSize: 12, opacity: 0.65 }}>
                      Not enough coins.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <Modal
        open={!!confirming}
        title="Confirm purchase"
        onClose={() => setConfirming(null)}
      >
        {confirming && (
          <>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 46 }}>
                {iconToDisplay(confirming.iconId)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900 }}>{confirming.label}</div>
                <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
                  Price: <b>{confirming.price}</b> coins
                </div>
                <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
                  After purchase: <b>{Math.max(0, coins - confirming.price)}</b>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <Button fullWidth onClick={() => setConfirming(null)}>
                Cancel
              </Button>
              <Button fullWidth variant="primary" onClick={doBuy}>
                Buy
              </Button>
            </div>
          </>
        )}
      </Modal>
    </Card>
  );
}
