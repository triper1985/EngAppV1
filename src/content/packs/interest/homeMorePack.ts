// src/content/packs/interest/homeMorePack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: My Home (More)
 * ------------------------------------
 * Complementary to Core Home (no duplicates: bed, chair, table, door, window).
 * Visuals are emoji-only (temporary).
 */
export const homeMorePack: ContentPack = {
  id: 'home_more',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['home', 'vocab'],
  },

  title: 'My Home',
  titleKey: 'content.pack.home_more.title',
  description: 'Rooms and things at home.',
  descriptionKey: 'content.pack.home_more.desc',
  emoji: '🏡',

  meta: { tags: ['interest', 'beginnerBridge'] },

  items: [
    // Rooms
    { id: 'home_kitchen', en: 'kitchen', he: 'מטבח', heNiqqud: 'מִטְבָּח', visual: { kind: 'text', he: '🍳' } },
    { id: 'home_bathroom', en: 'bathroom', he: 'שירותים', heNiqqud: 'שֵׁרוּתִים', visual: { kind: 'text', he: '🛁' } },
    { id: 'home_bedroom', en: 'bedroom', he: 'חדר שינה', heNiqqud: 'חֶדֶר שֵׁנָה', visual: { kind: 'text', he: '🛌' } },
    { id: 'home_living_room', en: 'living room', he: 'סלון', heNiqqud: 'סָלוֹן', visual: { kind: 'text', he: '🛋️' } },

    // Things (avoid bed/chair/table/door/window)
    { id: 'home_lamp', en: 'lamp', he: 'מנורה', heNiqqud: 'מְנוֹרָה', visual: { kind: 'text', he: '💡' } },
    { id: 'home_sofa', en: 'sofa', he: 'ספה', heNiqqud: 'סַפָּה', visual: { kind: 'text', he: '🛋️' } },
    { id: 'home_tv', en: 'TV', he: 'טלוויזיה', heNiqqud: 'טֶלֶוִיזְיָה', visual: { kind: 'text', he: '📺' } },
    { id: 'home_fridge', en: 'fridge', he: 'מקרר', heNiqqud: 'מְקָרֵר', visual: { kind: 'text', he: '🧊' } },
  ],

  groups: [
    {
      id: 'home_more_rooms',
      title: 'My Home – Rooms',
      titleKey: 'content.group.home_more_rooms.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['home_kitchen', 'home_bathroom', 'home_bedroom', 'home_living_room'],
    },
    {
      id: 'home_more_things',
      title: 'My Home – Things',
      titleKey: 'content.group.home_more_things.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['home_lamp', 'home_sofa', 'home_tv', 'home_fridge'],
    },
  ],

  units: [],
};
