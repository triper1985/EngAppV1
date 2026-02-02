// src/content/packs/interest/clothesMorePack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: More Clothes
 * ----------------------------------
 * Complementary to Core Clothes (no duplicates: shirt, pants, shoes, hat).
 * Visuals are emoji-only (temporary).
 */
export const clothesMorePack: ContentPack = {
  id: 'clothes_more',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['clothes', 'vocab'],
  },

  title: 'More Clothes',
  titleKey: 'content.pack.clothes_more.title',
  description: 'More things you can wear.',
  descriptionKey: 'content.pack.clothes_more.desc',
  emoji: '🧥',

  meta: { tags: ['interest', 'beginnerBridge'] },

  items: [
    { id: 'clothes_jacket', en: 'jacket', he: "ג'קט", heNiqqud: "גֶ'קֶט", visual: { kind: 'text', he: '🧥' } },
    { id: 'clothes_socks', en: 'socks', he: 'גרביים', heNiqqud: 'גַּרְבַּיִם', visual: { kind: 'text', he: '🧦' } },
    { id: 'clothes_dress', en: 'dress', he: 'שמלה', heNiqqud: 'שִׂמְלָה', visual: { kind: 'text', he: '👗' } },
    { id: 'clothes_gloves', en: 'gloves', he: 'כפפות', heNiqqud: 'כְּפָפוֹת', visual: { kind: 'text', he: '🧤' } },
    { id: 'clothes_scarf', en: 'scarf', he: 'צעיף', heNiqqud: 'צָעִיף', visual: { kind: 'text', he: '🧣' } },
    { id: 'clothes_shorts', en: 'shorts', he: 'מכנסיים קצרים', heNiqqud: 'מִכְנָסַיִם קְצָרִים', visual: { kind: 'text', he: '🩳' } },
  ],

  groups: [
    {
      id: 'clothes_more_basics',
      title: 'More Clothes – Basics',
      titleKey: 'content.group.clothes_more_basics.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['clothes_jacket', 'clothes_socks', 'clothes_dress', 'clothes_gloves', 'clothes_scarf', 'clothes_shorts'],
    },
  ],

  units: [],
};
