// src/content/packs/core/l4_spatialPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  {
    id: 'l4_spatial_in',
    en: 'in',
    he: 'בפנים',
    heNiqqud: 'בִּפְנִים',
    visual: { kind: 'image', assetId: 'l4_spatial_in' },
    tags: ['recognition'],
  },
  {
    id: 'l4_spatial_out',
    en: 'out',
    he: 'בחוץ',
    heNiqqud: 'בַּחוּץ',
    visual: { kind: 'image', assetId: 'l4_spatial_out' },
    tags: ['recognition'],
  },
  {
    id: 'l4_spatial_above',
    en: 'above',
    he: 'מעל',
    heNiqqud: 'מֵעַל',
    visual: { kind: 'image', assetId: 'l4_spatial_above' },
    tags: ['recognition'],
  },
  {
    id: 'l4_spatial_below',
    en: 'below',
    he: 'מתחת',
    heNiqqud: 'מִתַּחַת',
    visual: { kind: 'image', assetId: 'l4_spatial_below' },
    tags: ['recognition'],
  },
  {
    id: 'l4_spatial_between',
    en: 'between',
    he: 'בין',
    heNiqqud: 'בֵּין',
    visual: { kind: 'image', assetId: 'l4_spatial_between' },
    tags: ['recognition'],
  },
  {
    id: 'l4_spatial_next_to',
    en: 'next to',
    he: 'ליד',
    heNiqqud: 'לְיַד',
    visual: { kind: 'image', assetId: 'l4_spatial_next_to' },
    tags: ['recognition'],
  },
  {
    id: 'l4_spatial_near',
    en: 'near',
    he: 'קרוב',
    heNiqqud: 'קָרוֹב',
    visual: { kind: 'image', assetId: 'l4_spatial_near' },
    tags: ['recognition'],
  },
  {
    id: 'l4_spatial_far',
    en: 'far',
    he: 'רחוק',
    heNiqqud: 'רָחוֹק',
    visual: { kind: 'image', assetId: 'l4_spatial_far' },
    tags: ['recognition'],
  }
];

export const l4_spatialPack: ContentPack = {
  id: 'l4_spatial',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 4,
    maxLayer: 4,
    tags: ['recognition'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Spatial',
  titleKey: 'content.pack.l4_spatial.title',
  description: 'Understand simple spatial relations.',
  descriptionKey: 'content.pack.l4_spatial.desc',

  items,
  groups: [
    {
      id: 'l4_spatial_inout',
      title: 'In / Out',
      titleKey: 'beginner.unit.l4_spatial_inout.title',
      itemIds: ["l4_spatial_in", "l4_spatial_out"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_spatial_relations',
      title: 'Around',
      titleKey: 'beginner.unit.l4_spatial_relations.title',
      itemIds: ["l4_spatial_above", "l4_spatial_below", "l4_spatial_between", "l4_spatial_next_to", "l4_spatial_near", "l4_spatial_far"],
      policy: { minLayer: 4 },
    }
  ],
  units: [],
};
