// src/content/packs/core/l4_directionsPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  {
    id: 'l4_dir_up',
    en: 'up',
    he: 'למעלה',
    heNiqqud: 'לְמַעְלָה',
    visual: { kind: 'image', assetId: 'l4_dir_up' },
    tags: ['recognition'],
  },
  {
    id: 'l4_dir_down',
    en: 'down',
    he: 'למטה',
    heNiqqud: 'לְמַטָּה',
    visual: { kind: 'image', assetId: 'l4_dir_down' },
    tags: ['recognition'],
  },
  {
    id: 'l4_dir_left',
    en: 'left',
    he: 'שמאל',
    heNiqqud: 'שְׂמֹאל',
    visual: { kind: 'image', assetId: 'l4_dir_left' },
    tags: ['recognition'],
  },
  {
    id: 'l4_dir_right',
    en: 'right',
    he: 'ימין',
    heNiqqud: 'יָמִין',
    visual: { kind: 'image', assetId: 'l4_dir_right' },
    tags: ['recognition'],
  },
  {
    id: 'l4_dir_up_left',
    en: 'up-left',
    he: 'למעלה שמאל',
    heNiqqud: 'לְמַעְלָה שְׂמֹאל',
    visual: { kind: 'image', assetId: 'l4_dir_up_left' },
    tags: ['recognition'],
  },
  {
    id: 'l4_dir_up_right',
    en: 'up-right',
    he: 'למעלה ימין',
    heNiqqud: 'לְמַעְלָה יָמִין',
    visual: { kind: 'image', assetId: 'l4_dir_up_right' },
    tags: ['recognition'],
  },
  {
    id: 'l4_dir_down_left',
    en: 'down-left',
    he: 'למטה שמאל',
    heNiqqud: 'לְמַטָּה שְׂמֹאל',
    visual: { kind: 'image', assetId: 'l4_dir_down_left' },
    tags: ['recognition'],
  },
  {
    id: 'l4_dir_down_right',
    en: 'down-right',
    he: 'למטה ימין',
    heNiqqud: 'לְמַטָּה יָמִין',
    visual: { kind: 'image', assetId: 'l4_dir_down_right' },
    tags: ['recognition'],
  }
];

export const l4_directionsPack: ContentPack = {
  id: 'l4_directions',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 4,
    maxLayer: 4,
    tags: ['recognition'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Directions',
  titleKey: 'content.pack.l4_directions.title',
  description: 'Recognize arrows and directions.',
  descriptionKey: 'content.pack.l4_directions.desc',

  items,
  groups: [
    {
      id: 'l4_directions_basic',
      title: 'Up / Down / Left / Right',
      titleKey: 'beginner.unit.l4_directions_basic.title',
      itemIds: ["l4_dir_up", "l4_dir_down", "l4_dir_left", "l4_dir_right"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_directions_diagonal',
      title: 'Diagonal',
      titleKey: 'beginner.unit.l4_directions_diagonal.title',
      itemIds: ["l4_dir_up_left", "l4_dir_up_right", "l4_dir_down_left", "l4_dir_down_right"],
      policy: { minLayer: 4 },
    }
  ],
  units: [],
};
