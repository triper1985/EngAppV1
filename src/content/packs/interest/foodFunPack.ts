// src/content/packs/interest/foodFunPack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: Fun Food (Beginner / Level A)
 * ----------------------------------------------------
 * Goal: expand beyond Core Food without duplicating Core items/icons.
 * Parent-added only (interest).
 */
export const foodFunPack: ContentPack = {
  id: 'food_fun',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['food'],
  },

  title: 'Fun Food',
  titleKey: 'content.pack.food_fun.title',
  description: 'Tasty treats to learn and recognize.',
  descriptionKey: 'content.pack.food_fun.desc',
  emoji: '🍕',

  meta: { tags: ['interest'] },

  items: [
    {
      id: 'food_pizza',
      en: 'pizza',
      he: 'פיצה',
      heNiqqud: 'פִּיצָּה',
      visual: { kind: 'text', he: '🍕' },
    },
    {
      id: 'food_hamburger',
      en: 'hamburger',
      he: 'המבורגר',
      heNiqqud: 'הַמְבּוּרְגֶּר',
      visual: { kind: 'text', he: '🍔' },
    },
    {
      id: 'food_fries',
      en: 'fries',
      he: "צ'יפס",
      heNiqqud: "צִ׳יפְּס",
      visual: { kind: 'text', he: '🍟' },
    },
    {
      id: 'food_ice_cream',
      en: 'ice cream',
      he: 'גלידה',
      heNiqqud: 'גְּלִידָה',
      visual: { kind: 'text', he: '🍦' },
    },
    {
      id: 'food_cake',
      en: 'cake',
      he: 'עוגה',
      heNiqqud: 'עוּגָה',
      visual: { kind: 'text', he: '🍰' },
    },
    {
      id: 'food_donut',
      en: 'donut',
      he: 'דונאט',
      heNiqqud: 'דּוֹנָאט',
      visual: { kind: 'text', he: '🍩' },
    },
    {
      id: 'food_cheese',
      en: 'cheese',
      he: 'גבינה',
      heNiqqud: 'גְּבִינָה',
      visual: { kind: 'text', he: '🧀' },
    },
    {
      id: 'food_yogurt',
      en: 'yogurt',
      he: 'יוגורט',
      heNiqqud: 'יוֹגוּרְט',
      visual: { kind: 'text', he: '🥣' },
    },
  ],

  groups: [
    {
      id: 'food_fun_treats',
      title: 'Fun Food – Treats',
      titleKey: 'content.group.food_fun_treats.title',
      policy: {
        minLayer: 2,
        gamePoolContribution: true,
      },
      itemIds: [
        'food_pizza',
        'food_hamburger',
        'food_fries',
        'food_ice_cream',
        'food_cake',
        'food_donut',
        'food_cheese',
        'food_yogurt',
      ],
    },
  ],

  // Track units are bridged from groups into beginnerTrack; keep empty to avoid duplication.
  units: [],
};
