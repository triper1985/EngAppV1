// src/content/packs/core/animalsPack.ts
import type { ContentItem, ContentPack } from '../../types';

/**
 * Animals pack (Core)
 * ------------------
 * Layer 2 (World Objects): basic, concrete vocabulary.
 *
 * Notes:
 * - Visuals use emoji as a safe fallback.
 * - If an itemId is present in `src/visuals/itemVisualRegistry.ts`, the UI will
 *   prefer the image icon over these fallback visuals.
 */

const items: ContentItem[] = [
  // Farm
  { id: 'cow', en: 'cow', he: 'פרה',
      heNiqqud: 'פָּרָה',
    visual: { kind: 'text', he: '🐄' } },
  { id: 'sheep', en: 'sheep', he: 'כבשה',
      heNiqqud: 'כִּבְשָׂה',
    visual: { kind: 'text', he: '🐑' } },
  { id: 'pig', en: 'pig', he: 'חזיר',
      heNiqqud: 'חֲזִיר',
    visual: { kind: 'text', he: '🐷' } },
  { id: 'horse', en: 'horse', he: 'סוס',
      heNiqqud: 'סוּס',
    visual: { kind: 'text', he: '🐴' } },
  { id: 'chicken', en: 'chicken', he: 'תרנגולת',
      heNiqqud: 'תַּרְנְגוֹלֶת',
    visual: { kind: 'text', he: '🐔' } },
  { id: 'duck', en: 'duck', he: 'ברווז',
      heNiqqud: 'בַּרְוָז',
    visual: { kind: 'text', he: '🦆' } },
  { id: 'goat', en: 'goat', he: 'עז',
      heNiqqud: 'עֵז',
    visual: { kind: 'text', he: '🐐' } },
  { id: 'dog', en: 'dog', he: 'כלב',
      heNiqqud: 'כֶּלֶב',
    visual: { kind: 'text', he: '🐶' } },

  // Sea
  { id: 'fish', en: 'fish', he: 'דג',
      heNiqqud: 'דָּג',
    visual: { kind: 'text', he: '🐟' } },
  { id: 'dolphin', en: 'dolphin', he: 'דולפין',
      heNiqqud: 'דּוֹלְפִין',
    visual: { kind: 'text', he: '🐬' } },
  { id: 'shark', en: 'shark', he: 'כריש',
      heNiqqud: 'כָּרִישׁ',
    visual: { kind: 'text', he: '🦈' } },
  { id: 'octopus', en: 'octopus', he: 'תמנון',
      heNiqqud: 'תַּמְנוּן',
    visual: { kind: 'text', he: '🐙' } },
  { id: 'crab', en: 'crab', he: 'סרטן',
      heNiqqud: 'סַרְטָן',
    visual: { kind: 'text', he: '🦀' } },
  {
    id: 'sea_turtle',
    en: 'sea turtle',
    he: 'צב ים',
      heNiqqud: 'צָב יָם',
    visual: { kind: 'text', he: '🐢' },
  },
  { id: 'whale', en: 'whale', he: 'לוויתן',
      heNiqqud: 'לִוְיָתָן',
    visual: { kind: 'text', he: '🐋' } },
  { id: 'seahorse', en: 'seahorse', he: 'סוסון ים',
      heNiqqud: 'סוּסוֹן יָם',
    visual: { kind: 'text', he: '🐴🌊' } },

  // Jungle
  { id: 'lion', en: 'lion', he: 'אריה',
      heNiqqud: 'אַרְיֵה',
    visual: { kind: 'text', he: '🦁' } },
  { id: 'tiger', en: 'tiger', he: 'נמר',
      heNiqqud: 'נָמֵר',
    visual: { kind: 'text', he: '🐯' } },
  { id: 'elephant', en: 'elephant', he: 'פיל',
      heNiqqud: 'פִּיל',
    visual: { kind: 'text', he: '🐘' } },
  { id: 'monkey', en: 'monkey', he: 'קוף',
      heNiqqud: 'קוֹף',
    visual: { kind: 'text', he: '🐵' } },
  { id: 'giraffe', en: 'giraffe', he: 'ג׳ירפה',
      heNiqqud: "'גִ'ירָפָה'", visual: { kind: 'text', he: '🦒' } },
  { id: 'zebra', en: 'zebra', he: 'זברה',
      heNiqqud: 'זֶבְרָה',
    visual: { kind: 'text', he: '🦓' } },
  { id: 'parrot', en: 'parrot', he: 'תוכי',
      heNiqqud: 'תּוּכִּי',
    visual: { kind: 'text', he: '🦜' } },
  { id: 'snake', en: 'snake', he: 'נחש',
      heNiqqud: 'נָחָשׁ',
    visual: { kind: 'text', he: '🐍' } },
];

export const animalsPack: ContentPack = {
  id: 'animals',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['animals', 'vocab'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Animals',
  titleKey: 'content.pack.animals.title',
  emoji: '🐾',

  description: 'Learn basic animals (farm, sea, jungle).',
  descriptionKey: 'content.pack.animals.desc',

  items,

  groups: [
    {
      id: 'animals_farm',
      title: 'Farm Animals',
      titleKey: 'content.group.animals_farm.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: ['cow', 'sheep', 'pig', 'horse', 'chicken', 'duck', 'goat', 'dog'],
    },
    {
      id: 'animals_sea',
      title: 'Sea Animals',
      titleKey: 'content.group.animals_sea.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: [
        'fish',
        'dolphin',
        'shark',
        'octopus',
        'crab',
        'sea_turtle',
        'whale',
        'seahorse',
      ],
    },
    {
      id: 'animals_jungle',
      title: 'Jungle Animals',
      titleKey: 'content.group.animals_jungle.title',
      policy: { minLayer: 2, skills: ['vocab'], gamePoolContribution: true },
      itemIds: [
        'lion',
        'tiger',
        'elephant',
        'monkey',
        'giraffe',
        'zebra',
        'parrot',
        'snake',
      ],
    },
  ],

  // Units are bridged from groups into beginnerTrack
  units: [],
};
