// src/content/packs/core/l4_patternsPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  {
    id: 'l4_pattern_ab',
    en: 'pattern ab',
    he: 'דפוס א-ב',
    heNiqqud: 'דְּפוּס אַ-ב',
    visual: { kind: 'image', assetId: 'l4_pattern_ab' },
    tags: ['recognition'],
  },
  {
    id: 'l4_pattern_aba',
    en: 'pattern aba',
    he: 'דפוס א-ב-א',
    heNiqqud: 'דְּפוּס אַ-ב-אַ',
    visual: { kind: 'image', assetId: 'l4_pattern_aba' },
    tags: ['recognition'],
  },
  {
    id: 'l4_pattern_abc',
    en: 'pattern abc',
    he: 'דפוס א-ב-ג',
    heNiqqud: 'דְּפוּס אַ-ב-ג',
    visual: { kind: 'image', assetId: 'l4_pattern_abc' },
    tags: ['recognition'],
  },
  {
    id: 'l4_pattern_aabb',
    en: 'pattern aabb',
    he: 'דפוס א-א-ב-ב',
    heNiqqud: 'דְּפוּס אַ-אַ-ב-ב',
    visual: { kind: 'image', assetId: 'l4_pattern_aabb' },
    tags: ['recognition'],
  }
];

export const l4_patternsPack: ContentPack = {
  id: 'l4_patterns',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 4,
    maxLayer: 4,
    tags: ['recognition'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Patterns',
  titleKey: 'content.pack.l4_patterns.title',
  description: 'Find what comes next in a pattern.',
  descriptionKey: 'content.pack.l4_patterns.desc',

  items,
  groups: [
    {
      id: 'l4_patterns_ab',
      title: 'AB Pattern',
      titleKey: 'beginner.unit.l4_patterns_ab.title',
      itemIds: ["l4_pattern_ab"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_patterns_aba',
      title: 'ABA Pattern',
      titleKey: 'beginner.unit.l4_patterns_aba.title',
      itemIds: ["l4_pattern_aba"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_patterns_abc',
      title: 'ABC Pattern',
      titleKey: 'beginner.unit.l4_patterns_abc.title',
      itemIds: ["l4_pattern_abc"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_patterns_aabb',
      title: 'AABB Pattern',
      titleKey: 'beginner.unit.l4_patterns_aabb.title',
      itemIds: ["l4_pattern_aabb"],
      policy: { minLayer: 4 },
    }
  ],
  units: [],
};
