import type { LevelId } from '../types';

export const LEVELS: {
  id: LevelId;
  title: string;
  description: string;
  maxDifficulty: 1 | 2 | 3;
  sessionItemsTarget: number;
  coinsPerSession: number;
}[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Very easy words, lots of repeats.',
    maxDifficulty: 1,
    sessionItemsTarget: 6,
    coinsPerSession: 2,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'More variety, a bit harder.',
    maxDifficulty: 2,
    sessionItemsTarget: 8,
    coinsPerSession: 2,
  },
  {
    id: 'hero',
    title: 'Hero',
    description: 'Harder items and less hints.',
    maxDifficulty: 3,
    sessionItemsTarget: 10,
    coinsPerSession: 3,
  },
];

export function getLevel(levelId?: LevelId) {
  return LEVELS.find((l) => l.id === (levelId ?? 'beginner')) ?? LEVELS[0];
}
