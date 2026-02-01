// src/content/packs/core/l4_symbolsPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  {
    id: 'l4_symbol_check',
    en: 'check',
    he: 'וי',
    heNiqqud: 'וִי',
    visual: { kind: 'image', assetId: 'l4_symbol_check' },
    tags: ['recognition'],
  },
  {
    id: 'l4_symbol_cross',
    en: 'cross',
    he: 'איקס',
    heNiqqud: 'אִיקְס',
    visual: { kind: 'image', assetId: 'l4_symbol_cross' },
    tags: ['recognition'],
  },
  {
    id: 'l4_symbol_play',
    en: 'play',
    he: 'נגן',
    heNiqqud: 'נַגֵּן',
    visual: { kind: 'image', assetId: 'l4_symbol_play' },
    tags: ['recognition'],
  },
  {
    id: 'l4_symbol_pause',
    en: 'pause',
    he: 'השהה',
    heNiqqud: 'הַשְׁהֵה',
    visual: { kind: 'image', assetId: 'l4_symbol_pause' },
    tags: ['recognition'],
  },
  {
    id: 'l4_symbol_stop',
    en: 'stop',
    he: 'עצור',
    heNiqqud: 'עֲצוֹר',
    visual: { kind: 'image', assetId: 'l4_symbol_stop' },
    tags: ['recognition'],
  },
  {
    id: 'l4_symbol_plus',
    en: 'plus',
    he: 'פלוס',
    heNiqqud: 'פְּלוּס',
    visual: { kind: 'image', assetId: 'l4_symbol_plus' },
    tags: ['recognition'],
  },
  {
    id: 'l4_symbol_minus',
    en: 'minus',
    he: 'מינוס',
    heNiqqud: 'מִינוּס',
    visual: { kind: 'image', assetId: 'l4_symbol_minus' },
    tags: ['recognition'],
  }
];

export const l4_symbolsPack: ContentPack = {
  id: 'l4_symbols',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 4,
    maxLayer: 4,
    tags: ['recognition'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Symbols',
  titleKey: 'content.pack.l4_symbols.title',
  description: 'Recognize common symbols.',
  descriptionKey: 'content.pack.l4_symbols.desc',

  items,
  groups: [
    {
      id: 'l4_symbols_yesno',
      title: 'Yes / No',
      titleKey: 'beginner.unit.l4_symbols_yesno.title',
      itemIds: ["l4_symbol_check", "l4_symbol_cross"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_symbols_controls',
      title: 'Controls',
      titleKey: 'beginner.unit.l4_symbols_controls.title',
      itemIds: ["l4_symbol_play", "l4_symbol_pause", "l4_symbol_stop"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_symbols_math',
      title: 'Plus / Minus',
      titleKey: 'beginner.unit.l4_symbols_math.title',
      itemIds: ["l4_symbol_plus", "l4_symbol_minus"],
      policy: { minLayer: 4 },
    }
  ], 
  units: [],
};
