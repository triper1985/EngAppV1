// src/content/packs/interest/spacePack.ts
import type { ContentPack } from '../../types';

export const spacePack: ContentPack = {
  id: 'space',
  policy: {
    packType: 'interest',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['space'],
  },

  title: 'Space',
  titleKey: 'content.pack.space.title',

  emoji: '🪐',

  description: 'Space basics: learn words by sound + icons.',
  descriptionKey: 'content.pack.space.desc',

  meta: { tags: ['interest'] },

  items: [
    {
      id: 'space_star',
      en: 'star',
      he: 'כוכב',
      visual: { kind: 'text', he: '⭐ כוכב' },
    },
    {
      id: 'space_moon',
      en: 'moon',
      he: 'ירח',
      visual: { kind: 'text', he: '🌙 ירח' },
    },
    {
      id: 'space_sun',
      en: 'sun',
      he: 'שמש',
      visual: { kind: 'text', he: '☀️ שמש' },
    },
    {
      id: 'space_planet',
      en: 'planet',
      he: 'כוכב לכת',
      visual: { kind: 'text', he: '🪐 כוכב לכת' },
    },
  ],

  groups: [
    {
      id: 'space_basics',
      title: 'Space – Basics',
      titleKey: 'content.group.space_basics.title',
      policy: {
        minLayer: 2,
        gamePoolContribution: true,
      },
      itemIds: ['space_star', 'space_moon', 'space_sun', 'space_planet'],
    },
  ],

  // Track units are bridged from groups into beginnerTrack; keep empty to avoid duplication.
  units: [],
};
