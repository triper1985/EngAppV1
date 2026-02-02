// src/content/packs/interest/foodFunPack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: Fun Food (Beginner / Level A)
 * ----------------------------------------------------
 * Goal: expand beyond Core Food without duplicating Core items/icons.
 *
 * Core Food includes:
 * - apple, banana, bread, milk, water
 *
 * This pack is complementary and intentionally avoids those items.
 * Visuals are emoji-only (temporary) so they render nicely in cards.
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
  description: 'Fruits, vegetables, and tasty meals.',
  descriptionKey: 'content.pack.food_fun.desc',
  emoji: '🍽️',

  meta: { tags: ['interest', 'beginnerBridge'] },

  items: [
    // Fruits (NO: apple, banana)
    { id: 'food_orange', en: 'orange', he: 'תפוז', heNiqqud: 'תַּפּוּז', visual: { kind: 'text', he: '🍊' } },
    { id: 'food_grapes', en: 'grapes', he: 'ענבים', heNiqqud: 'עֲנָבִים', visual: { kind: 'text', he: '🍇' } },
    { id: 'food_strawberry', en: 'strawberry', he: 'תות', heNiqqud: 'תּוּת', visual: { kind: 'text', he: '🍓' } },
    { id: 'food_watermelon', en: 'watermelon', he: 'אבטיח', heNiqqud: 'אֲבַטִּיחַ', visual: { kind: 'text', he: '🍉' } },
    { id: 'food_pear', en: 'pear', he: 'אגס', heNiqqud: 'אַגָּס', visual: { kind: 'text', he: '🍐' } },

    // Vegetables
    { id: 'food_carrot', en: 'carrot', he: 'גזר', heNiqqud: 'גֶּזֶר', visual: { kind: 'text', he: '🥕' } },
    { id: 'food_tomato', en: 'tomato', he: 'עגבנייה', heNiqqud: 'עַגְבָנִיָּה', visual: { kind: 'text', he: '🍅' } },
    { id: 'food_cucumber', en: 'cucumber', he: 'מלפפון', heNiqqud: 'מְלָפְפוֹן', visual: { kind: 'text', he: '🥒' } },
    { id: 'food_potato', en: 'potato', he: 'תפוח אדמה', heNiqqud: 'תַּפּוּחַ אֲדָמָה', visual: { kind: 'text', he: '🥔' } },
    { id: 'food_corn', en: 'corn', he: 'תירס', heNiqqud: 'תִּירָס', visual: { kind: 'text', he: '🌽' } },

    // Meals & snacks (NO: bread, milk, water)
    { id: 'food_pizza', en: 'pizza', he: 'פיצה', heNiqqud: 'פִּיצָּה', visual: { kind: 'text', he: '🍕' } },
    { id: 'food_hamburger', en: 'hamburger', he: 'המבורגר', heNiqqud: 'הַמְבּוּרְגֶּר', visual: { kind: 'text', he: '🍔' } },
    { id: 'food_fries', en: 'fries', he: "צ'יפס", heNiqqud: "צִ׳יפְּס", visual: { kind: 'text', he: '🍟' } },
    { id: 'food_ice_cream', en: 'ice cream', he: 'גלידה', heNiqqud: 'גְּלִידָה', visual: { kind: 'text', he: '🍦' } },
    { id: 'food_cake', en: 'cake', he: 'עוגה', heNiqqud: 'עוּגָה', visual: { kind: 'text', he: '🍰' } },
    { id: 'food_donut', en: 'donut', he: 'דונאט', heNiqqud: 'דּוֹנָאט', visual: { kind: 'text', he: '🍩' } },
    { id: 'food_cheese', en: 'cheese', he: 'גבינה', heNiqqud: 'גְּבִינָה', visual: { kind: 'text', he: '🧀' } },
    { id: 'food_yogurt', en: 'yogurt', he: 'יוגורט', heNiqqud: 'יוֹגוּרְט', visual: { kind: 'text', he: '🥣' } },
  ],

  groups: [
    {
      id: 'food_fun_fruits',
      title: 'Fun Food – Fruits',
      titleKey: 'content.group.food_fun_fruits.title',
      policy: { minLayer: 2, gamePoolContribution: true },
      itemIds: ['food_orange', 'food_grapes', 'food_strawberry', 'food_watermelon', 'food_pear'],
    },
    {
      id: 'food_fun_vegetables',
      title: 'Fun Food – Vegetables',
      titleKey: 'content.group.food_fun_vegetables.title',
      policy: { minLayer: 2, gamePoolContribution: true },
      itemIds: ['food_carrot', 'food_tomato', 'food_cucumber', 'food_potato', 'food_corn'],
    },
    {
      id: 'food_fun_meals_snacks',
      title: 'Fun Food – Meals & Snacks',
      titleKey: 'content.group.food_fun_meals_snacks.title',
      policy: { minLayer: 2, gamePoolContribution: true },
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
