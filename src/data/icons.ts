export type IconDef = {
  id: string;
  emoji: string;
  label: string;
  cost?: number;
  starter?: boolean;
};

export const ICONS: IconDef[] = [
  { id: 'star', emoji: '⭐', label: 'Star', cost: 0, starter: true },
  { id: 'rocket', emoji: '🚀', label: 'Rocket', cost: 0, starter: true },
  {
    id: 'basketball',
    emoji: '🏀',
    label: 'Basketball',
    cost: 0,
    starter: true,
  },

  { id: 'unicorn', emoji: '🦄', label: 'Unicorn', cost: 5 },
  { id: 'tiger', emoji: '🐯', label: 'Tiger', cost: 5 },
];

export function iconToDisplay(iconId?: string) {
  const found = ICONS.find((x) => x.id === iconId);
  return found?.emoji ?? '🙂';
}
