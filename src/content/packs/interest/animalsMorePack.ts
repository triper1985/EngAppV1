// src/content/packs/interest/animalsMorePack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: More Animals
 * ----------------------------------
 * Complementary to Core Animals (no duplicate items).
 * Visuals are emoji-only (temporary).
 */
export const animalsMorePack: ContentPack = {
  id: 'animals_more',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['animals', 'vocab'],
  },

  title: 'More Animals',
  titleKey: 'content.pack.animals_more.title',
  description: 'Extra animals to discover.',
  descriptionKey: 'content.pack.animals_more.desc',
  emoji: '🦊',

  meta: { tags: ['interest', 'beginnerBridge'] },

  items: [
    // Pets / small animals (Core animals already has dog)
    { id: 'animals_cat', en: 'cat', he: 'חתול', heNiqqud: 'חָתוּל', visual: { kind: 'text', he: '🐱' } },
    { id: 'animals_rabbit', en: 'rabbit', he: 'ארנב', heNiqqud: 'אַרְנָב', visual: { kind: 'text', he: '🐰' } },
    { id: 'animals_hamster', en: 'hamster', he: 'אוגר', heNiqqud: 'אוֹגֵר', visual: { kind: 'text', he: '🐹' } },
    { id: 'animals_frog', en: 'frog', he: 'צפרדע', heNiqqud: 'צְפַרְדֵּעַ', visual: { kind: 'text', he: '🐸' } },

    // Wild animals (avoid lion/tiger/elephant/monkey/giraffe/zebra etc from core)
    { id: 'animals_bear', en: 'bear', he: 'דוב', heNiqqud: 'דֹּב', visual: { kind: 'text', he: '🐻' } },
    { id: 'animals_fox', en: 'fox', he: 'שועל', heNiqqud: 'שׁוּעָל', visual: { kind: 'text', he: '🦊' } },
    { id: 'animals_panda', en: 'panda', he: 'פנדה', heNiqqud: 'פַּנְדָּה', visual: { kind: 'text', he: '🐼' } },
    { id: 'animals_kangaroo', en: 'kangaroo', he: 'קנגורו', heNiqqud: 'קַנְגּוּרוּ', visual: { kind: 'text', he: '🦘' } },
    { id: 'animals_penguin', en: 'penguin', he: 'פינגווין', heNiqqud: 'פִּינְגּוּוִין', visual: { kind: 'text', he: '🐧' } },
    { id: 'animals_owl', en: 'owl', he: 'ינשוף', heNiqqud: 'יַנְשׁוּף', visual: { kind: 'text', he: '🦉' } },
  ],

  groups: [
    {
      id: 'animals_more_pets',
      title: 'More Animals – Pets',
      titleKey: 'content.group.animals_more_pets.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['animals_cat', 'animals_rabbit', 'animals_hamster', 'animals_frog'],
    },
    {
      id: 'animals_more_wild',
      title: 'More Animals – Wild',
      titleKey: 'content.group.animals_more_wild.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: [
        'animals_bear',
        'animals_fox',
        'animals_panda',
        'animals_kangaroo',
        'animals_penguin',
        'animals_owl',
      ],
    },
  ],

  units: [],
};
