// src/content/packs/core/l4_shapesPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  {
    id: 'l4_shape_circle',
    en: 'circle',
    he: 'עיגול',
    heNiqqud: 'עִגּוּל',
    visual: { kind: 'image', assetId: 'l4_shape_circle' },
    tags: ['recognition'],
  },
  {
    id: 'l4_shape_square',
    en: 'square',
    he: 'ריבוע',
    heNiqqud: 'רִבּוּעַ',
    visual: { kind: 'image', assetId: 'l4_shape_square' },
    tags: ['recognition'],
  },
  {
    id: 'l4_shape_triangle',
    en: 'triangle',
    he: 'משולש',
    heNiqqud: 'מְשֻׁלָּשׁ',
    visual: { kind: 'image', assetId: 'l4_shape_triangle' },
    tags: ['recognition'],
  },
  {
    id: 'l4_shape_rectangle',
    en: 'rectangle',
    he: 'מלבן',
    heNiqqud: 'מַלְבֵּן',
    visual: { kind: 'image', assetId: 'l4_shape_rectangle' },
    tags: ['recognition'],
  },
  {
    id: 'l4_shape_star',
    en: 'star',
    he: 'כוכב',
    heNiqqud: 'כּוֹכָב',
    visual: { kind: 'image', assetId: 'l4_shape_star' },
    tags: ['recognition'],
  },
  {
    id: 'l4_shape_heart',
    en: 'heart',
    he: 'לב',
    heNiqqud: 'לֵב',
    visual: { kind: 'image', assetId: 'l4_shape_heart' },
    tags: ['recognition'],
  },
  {
    id: 'l4_shape_oval',
    en: 'oval',
    he: 'אליפסה',
    heNiqqud: 'אֲלִיפְּסָה',
    visual: { kind: 'image', assetId: 'l4_shape_oval' },
    tags: ['recognition'],
  },
  {
    id: 'l4_shape_diamond',
    en: 'diamond',
    he: 'יהלום',
    heNiqqud: 'יַהֲלוֹם',
    visual: { kind: 'image', assetId: 'l4_shape_diamond' },
    tags: ['recognition'],
  }
];

export const l4_shapesPack: ContentPack = {
  id: 'l4_shapes',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 4,
    maxLayer: 4,
    tags: ['recognition'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Shapes',
  titleKey: 'content.pack.l4_shapes.title',
  description: 'Recognize basic shapes.',
  descriptionKey: 'content.pack.l4_shapes.desc',

  items,
  groups: [
    {
      id: 'l4_shapes_basic',
      title: 'Basic Shapes',
      titleKey: 'beginner.unit.l4_shapes_basic.title',
      itemIds: ["l4_shape_circle", "l4_shape_square", "l4_shape_triangle", "l4_shape_rectangle"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_shapes_more',
      title: 'More Shapes',
      titleKey: 'beginner.unit.l4_shapes_more.title',
      itemIds: ["l4_shape_star", "l4_shape_heart", "l4_shape_oval", "l4_shape_diamond"],
      policy: { minLayer: 4 },
    }
  ],
  units: [],
};
