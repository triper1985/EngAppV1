// src/content/packs/core/listeningPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  // Sounds / actions (listening-first)
  {
    id: 'clap',
    en: 'clap',
    he: 'מחא כפיים',
      heNiqqud: 'מְחָא כַּפַּיִם',
    visual: { kind: 'text', he: '👏' },
  },
  { id: 'jump', en: 'jump', he: 'קפוץ',
      heNiqqud: 'קְפֹץ',
    visual: { kind: 'text', he: '🦘' } },
  { id: 'run', en: 'run', he: 'רוץ',
      heNiqqud: 'רוּץ',
    visual: { kind: 'text', he: '🏃' } },
  { id: 'stop', en: 'stop', he: 'עצור',
      heNiqqud: 'עֲצוֹר',
    visual: { kind: 'text', he: '🛑' } },

  // Classroom / attention
  {
    id: 'listen',
    en: 'listen',
    he: 'הקשב',
      heNiqqud: 'הַקְשֵׁב',
    visual: { kind: 'text', he: '👂' },
  },
  { id: 'look', en: 'look', he: 'תסתכל',
      heNiqqud: 'תִּסְתַּכֵּל',
    visual: { kind: 'text', he: '👀' } },
  { id: 'sit', en: 'sit', he: 'שב',
      heNiqqud: 'שֵׁב',
    visual: { kind: 'text', he: '🪑' } },
  { id: 'stand', en: 'stand', he: 'עמוד',
      heNiqqud: 'עֲמוֹד',
    visual: { kind: 'text', he: '🧍' } },
];

export const listeningPack: ContentPack = {
  id: 'listening',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 1,
    maxLayer: 1,
    tags: ['listening', 'sounds'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Listening & Sounds',
  titleKey: 'content.pack.listening.title',
  emoji: '👂',

  description: 'Listen and respond: simple actions and attention words.',
  descriptionKey: 'content.pack.listening.desc',

  items,

  groups: [
    {
      id: 'sounds_actions',
      title: 'Actions',
      titleKey: 'content.group.sounds_actions.title',
      policy: {
        minLayer: 1,
        skills: ['listening'],
        gamePoolContribution: true,
      },
      itemIds: ['clap', 'jump', 'run', 'stop'],
    },
    {
      id: 'classroom_attention',
      title: 'Attention',
      titleKey: 'content.group.classroom_attention.title',
      policy: {
        minLayer: 1,
        skills: ['listening'],
        gamePoolContribution: true,
      },
      itemIds: ['listen', 'look', 'sit', 'stand'],
    },
  ],

  units: [],
};
