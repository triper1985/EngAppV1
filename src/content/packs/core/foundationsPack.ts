// src/content/packs/core/foundationsPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  // Orientation (very early)
  {
    id: 'hello',
    en: 'hello',
    he: 'שלום',
    heNiqqud: 'שָׁלוֹם',
    visual: { kind: 'text', he: '👋🙂' },
  },
  { id: 'bye', en: 'bye', he: 'ביי',
    heNiqqud: 'בַּיי', visual: { kind: 'text', he: '➡️👋' } },
  { id: 'yes', en: 'yes', he: 'כן',
    heNiqqud: 'כֵּן', visual: { kind: 'text', he: '✅' } },
  { id: 'no', en: 'no', he: 'לא',
    heNiqqud: 'לֹא', visual: { kind: 'text', he: '❌' } },
  {
    id: 'please',
    en: 'please',
    he: 'בבקשה',
    heNiqqud: 'בְּבַקָּשָׁה',
    visual: { kind: 'text', he: '🙏' },
  },
  {
    id: 'thank_you',
    en: 'thank you',
    he: 'תודה',
    heNiqqud: 'תּוֹדָה',
    visual: { kind: 'text', he: '💛' },
  },

  // Emotions
  { id: 'happy', en: 'happy', he: 'שמח',
    heNiqqud: 'שָׂמֵחַ', visual: { kind: 'text', he: '😀' } },
  { id: 'sad', en: 'sad', he: 'עצוב',
    heNiqqud: 'עָצוּב', visual: { kind: 'text', he: '😢' } },
  { id: 'angry', en: 'angry', he: 'כועס',
    heNiqqud: 'כּוֹעֵס', visual: { kind: 'text', he: '😠' } },
  {
    id: 'scared',
    en: 'scared',
    he: 'מפחד',
    heNiqqud: 'מְפֻחָד',
    visual: { kind: 'text', he: '😨' },
  },
  { id: 'tired', en: 'tired', he: 'עייף',
    heNiqqud: 'עָיֵף', visual: { kind: 'text', he: '🥱' } },
  { id: 'calm', en: 'calm', he: 'רגוע',
    heNiqqud: 'רָגוּעַ', visual: { kind: 'text', he: '😌' } },
];

export const foundationsPack: ContentPack = {
  id: 'foundations',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 0,
    maxLayer: 0,
    tags: ['orientation', 'emotions'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Foundations',
  titleKey: 'content.pack.foundations.title',
  emoji: '🧩',

  description: 'Very first words: greetings, yes/no, and simple feelings.',
  descriptionKey: 'content.pack.foundations.desc',

  items,

  groups: [
    {
      id: 'orientation',
      title: 'Orientation',
      titleKey: 'content.group.orientation.title',
      policy: {
        minLayer: 0,
        skills: ['orientation'],
        gamePoolContribution: true,
      },
      itemIds: ['hello', 'bye', 'yes', 'no', 'please', 'thank_you'],
    },
    {
      id: 'emotions',
      title: 'Emotions',
      titleKey: 'content.group.emotions.title',
      policy: { minLayer: 0, skills: ['emotions'], gamePoolContribution: true },
      itemIds: ['happy', 'sad', 'angry', 'scared', 'tired', 'calm'],
    },
  ],

  // Units are bridged from groups into beginnerTrack
  units: [],
};
