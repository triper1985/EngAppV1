// src/content/packs/interest/animalsPack.ts
import type { ContentPack } from '../../types';

/**
 * Animals pack (Interest)
 * ----------------------
 * NOTE: Marked as hidden until you decide to expose it in the UI.
 * Remove 'hidden' from tags when it's ready.
 */
export const animalsPack: ContentPack = {
  id: 'animals',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['animals'],
  },

  meta: {
    tags: ['interest', 'hidden', 'poc'],
  },

  title: 'Animals',
  titleKey: 'content.pack.animals.title',

  emoji: '🐾',

  description: 'Basic animals pack (POC).',
  descriptionKey: 'content.pack.animals.desc',

  // Keep minimal for now (safe placeholder)
  items: [],
  groups: [],
  units: [],
};
