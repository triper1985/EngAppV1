// src/content/packs/core/l4_emotionsPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  {
    id: 'l4_emotion_happy',
    en: 'happy',
    he: 'שמח',
    heNiqqud: 'שָׂמֵחַ',
    visual: { kind: 'image', assetId: 'l4_emotion_happy' },
    tags: ['recognition'],
  },
  {
    id: 'l4_emotion_sad',
    en: 'sad',
    he: 'עצוב',
    heNiqqud: 'עָצוּב',
    visual: { kind: 'image', assetId: 'l4_emotion_sad' },
    tags: ['recognition'],
  },
  {
    id: 'l4_emotion_angry',
    en: 'angry',
    he: 'כועס',
    heNiqqud: 'כּוֹעֵס',
    visual: { kind: 'image', assetId: 'l4_emotion_angry' },
    tags: ['recognition'],
  },
  {
    id: 'l4_emotion_surprised',
    en: 'surprised',
    he: 'מופתע',
    heNiqqud: 'מוּפְתָּע',
    visual: { kind: 'image', assetId: 'l4_emotion_surprised' },
    tags: ['recognition'],
  },
  {
    id: 'l4_emotion_scared',
    en: 'scared',
    he: 'מפחד',
    heNiqqud: 'מְפַחֵד',
    visual: { kind: 'image', assetId: 'l4_emotion_scared' },
    tags: ['recognition'],
  },
  {
    id: 'l4_emotion_sleepy',
    en: 'sleepy',
    he: 'עייף',
    heNiqqud: 'עָיֵף',
    visual: { kind: 'image', assetId: 'l4_emotion_sleepy' },
    tags: ['recognition'],
  }
];

export const l4_emotionsPack: ContentPack = {
  id: 'l4_emotions',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 4,
    maxLayer: 4,
    tags: ['recognition'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Emotions',
  titleKey: 'content.pack.l4_emotions.title',
  description: 'Recognize basic emotions.',
  descriptionKey: 'content.pack.l4_emotions.desc',

  items,
  groups: [
    {
      id: 'l4_emotions_basic',
      title: 'Basic Emotions',
      titleKey: 'beginner.unit.l4_emotions_basic.title',
      itemIds: ["l4_emotion_happy", "l4_emotion_sad", "l4_emotion_angry", "l4_emotion_surprised"],
      policy: { minLayer: 4 },
    },
    {
      id: 'l4_emotions_more',
      title: 'More Emotions',
      titleKey: 'beginner.unit.l4_emotions_more.title',
      itemIds: ["l4_emotion_scared", "l4_emotion_sleepy"],
      policy: { minLayer: 4 },
    }
  ],
  units: [],
};
