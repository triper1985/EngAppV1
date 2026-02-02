// src/content/packs/interest/transportMorePack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: More Transport
 * ------------------------------------
 * Complementary to Core Transport (no duplicates: car, bus, train, bike).
 * Visuals are emoji-only (temporary).
 */
export const transportMorePack: ContentPack = {
  id: 'transport_more',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['transport', 'vocab'],
  },

  title: 'More Transport',
  titleKey: 'content.pack.transport_more.title',
  description: 'More ways to travel and move.',
  descriptionKey: 'content.pack.transport_more.desc',
  emoji: '✈️',

  meta: { tags: ['interest', 'beginnerBridge'] },

  items: [
    // Land (avoid car/bus/train/bike)
    { id: 'transport_truck', en: 'truck', he: 'משאית', heNiqqud: 'מַשָּׂאִית', visual: { kind: 'text', he: '🚚' } },
    { id: 'transport_motorcycle', en: 'motorcycle', he: 'אופנוע', heNiqqud: 'אוֹפְנוֹעַ', visual: { kind: 'text', he: '🏍️' } },
    { id: 'transport_scooter', en: 'scooter', he: 'קורקינט', heNiqqud: 'קוֹרְקִינְט', visual: { kind: 'text', he: '🛴' } },
    { id: 'transport_subway', en: 'subway', he: 'מטרו', heNiqqud: 'מֶטְרוֹ', visual: { kind: 'text', he: '🚇' } },

    // Air/Sea
    { id: 'transport_airplane', en: 'airplane', he: 'מטוס', heNiqqud: 'מָטוֹס', visual: { kind: 'text', he: '✈️' } },
    { id: 'transport_helicopter', en: 'helicopter', he: 'מסוק', heNiqqud: 'מָסוֹק', visual: { kind: 'text', he: '🚁' } },
    { id: 'transport_boat', en: 'boat', he: 'סירה', heNiqqud: 'סִירָה', visual: { kind: 'text', he: '⛵' } },
  ],

  groups: [
    {
      id: 'transport_more_land',
      title: 'More Transport – Land',
      titleKey: 'content.group.transport_more_land.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['transport_truck', 'transport_motorcycle', 'transport_scooter', 'transport_subway'],
    },
    {
      id: 'transport_more_air_sea',
      title: 'More Transport – Air & Sea',
      titleKey: 'content.group.transport_more_air_sea.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['transport_airplane', 'transport_helicopter', 'transport_boat'],
    },
  ],

  units: [],
};
