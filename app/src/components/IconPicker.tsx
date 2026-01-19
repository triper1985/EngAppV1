// src/components/IconPicker.tsx
import { ICONS, iconToDisplay } from '../data/icons';
import { Card } from '../ui/Card';

type Props = {
  value?: string;
  unlockedIconIds: string[];
  onPick: (iconId: string) => void;
};

export function IconPicker({ value, unlockedIconIds, onPick }: Props) {
  const unlocked = new Set(unlockedIconIds ?? []);
  const visibleIcons = ICONS.filter((ic) => unlocked.has(ic.id));

  return (
    <Card style={{ padding: 16 }}>
      <div>
        <div style={{ fontWeight: 900, fontSize: 18 }}>🧑‍🎨 Choose icon</div>
        <div style={{ fontSize: 13, opacity: 0.75, marginTop: 2 }}>
          Pick an unlocked icon
        </div>
      </div>

      {visibleIcons.length === 0 ? (
        <div style={{ marginTop: 12, fontSize: 14, opacity: 0.75 }}>
          No unlocked icons yet. Go to <b>Shop</b> to get your first one.
        </div>
      ) : (
        <>
          <div
            style={{
              marginTop: 12,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
              gap: 10,
            }}
          >
            {visibleIcons.map((ic) => {
              const selected = ic.id === value;

              return (
                <button
                  key={ic.id}
                  onClick={() => onPick(ic.id)}
                  style={{
                    border: selected ? '2px solid #111' : '1px solid #ddd',
                    borderRadius: 14,
                    padding: 12,
                    background: selected ? '#f3f3f3' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 70,
                  }}
                  title={ic.label}
                >
                  <div style={{ fontSize: 28 }}>{iconToDisplay(ic.id)}</div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
            Selected: <b>{iconToDisplay(value)}</b>
          </div>
        </>
      )}
    </Card>
  );
}
