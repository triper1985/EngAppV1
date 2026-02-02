export type IconDef = {
  id: string;
  emoji: string;
  label: string;
  category?: 'animals' | 'space' | 'sports' | 'food' | 'nature' | 'fantasy' | 'faces' | 'objects';
  cost?: number;
  starter?: boolean;
};

export const ICONS: IconDef[] = [
  // Starters (free)
  { id: 'star', emoji: '⭐', label: 'Star', category: 'objects', cost: 0, starter: true },
  { id: 'rocket', emoji: '🚀', label: 'Rocket', category: 'space', cost: 0, starter: true },
  { id: 'basketball', emoji: '🏀', label: 'Basketball', category: 'sports', cost: 0, starter: true },

  // Animals
  { id: 'tiger', emoji: '🐯', label: 'Tiger', category: 'animals' },
  { id: 'lion', emoji: '🦁', label: 'Lion', category: 'animals' },
  { id: 'panda', emoji: '🐼', label: 'Panda', category: 'animals' },
  { id: 'dog', emoji: '🐶', label: 'Dog', category: 'animals' },
  { id: 'cat', emoji: '🐱', label: 'Cat', category: 'animals' },
  { id: 'dolphin', emoji: '🐬', label: 'Dolphin', category: 'animals' },
  { id: 'turtle', emoji: '🐢', label: 'Turtle', category: 'animals' },

  // Space
  { id: 'planet', emoji: '🪐', label: 'Planet', category: 'space' },
  { id: 'astronaut', emoji: '👨‍🚀', label: 'Astronaut', category: 'space' },
  { id: 'ufo', emoji: '🛸', label: 'UFO', category: 'space' },

  // Sports
  { id: 'soccer', emoji: '⚽', label: 'Soccer', category: 'sports' },
  { id: 'tennis', emoji: '🎾', label: 'Tennis', category: 'sports' },

  // Food
  { id: 'pizza', emoji: '🍕', label: 'Pizza', category: 'food' },
  { id: 'icecream', emoji: '🍦', label: 'Ice cream', category: 'food' },
  { id: 'cake', emoji: '🎂', label: 'Cake', category: 'food' },

  // Nature
  { id: 'sun', emoji: '☀️', label: 'Sun', category: 'nature' },
  { id: 'rainbow', emoji: '🌈', label: 'Rainbow', category: 'nature' },
  { id: 'tree', emoji: '🌳', label: 'Tree', category: 'nature' },
  { id: 'flower', emoji: '🌸', label: 'Flower', category: 'nature' },

  // Fantasy
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn', category: 'fantasy' },
  { id: 'dragon', emoji: '🐉', label: 'Dragon', category: 'fantasy' },
  { id: 'crown', emoji: '👑', label: 'Crown', category: 'fantasy' },

  // Faces
  { id: 'cool', emoji: '😎', label: 'Cool', category: 'faces' },
  { id: 'happy', emoji: '😄', label: 'Happy', category: 'faces' },
];

export function iconToDisplay(iconId?: string) {
  const found = ICONS.find((x) => x.id === iconId);
  return found?.emoji ?? '🙂';
}
