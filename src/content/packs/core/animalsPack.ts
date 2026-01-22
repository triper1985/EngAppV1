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
  { id: 'cow', en: 'cow', he: 'פרה', visual: { kind: 'text', he: '🐄' } },
  { id: 'sheep', en: 'sheep', he: 'כבשה', visual: { kind: 'text', he: '🐑' } },
  { id: 'pig', en: 'pig', he: 'חזיר', visual: { kind: 'text', he: '🐷' } },
  { id: 'horse', en: 'horse', he: 'סוס', visual: { kind: 'text', he: '🐴' } },
  { id: 'chicken', en: 'chicken', he: 'תרנגולת', visual: { kind: 'text', he: '🐔' } },
  { id: 'duck', en: 'duck', he: 'ברווז', visual: { kind: 'text', he: '🦆' } },
  { id: 'goat', en: 'goat', he: 'עז', visual: { kind: 'text', he: '🐐' } },
  { id: 'dog', en: 'dog', he: 'כלב', visual: { kind: 'text', he: '🐶' } },

  // Sea
  { id: 'fish', en: 'fish', he: 'דג', visual: { kind: 'text', he: '🐟' } },
  { id: 'dolphin', en: 'dolphin', he: 'דולפין', visual: { kind: 'text', he: '🐬' } },
  { id: 'shark', en: 'shark', he: 'כריש', visual: { kind: 'text', he: '🦈' } },
  { id: 'octopus', en: 'octopus', he: 'תמנון', visual: { kind: 'text', he: '🐙' } },
  { id: 'crab', en: 'crab', he: 'סרטן', visual: { kind: 'text', he: '🦀' } },
  {
    id: 'sea_turtle',
    en: 'sea turtle',
    he: 'צב ים',
    visual: { kind: 'text', he: '🐢' },
  },
  { id: 'whale', en: 'whale', he: 'לוויתן', visual: { kind: 'text', he: '🐋' } },
  { id: 'seahorse', en: 'seahorse', he: 'סוסון ים', visual: { kind: 'text', he: '🐴🌊' } },

  // Jungle
  { id: 'lion', en: 'lion', he: 'אריה', visual: { kind: 'text', he: '🦁' } },
  { id: 'tiger', en: 'tiger', he: 'נמר', visual: { kind: 'text', he: '🐯' } },
  { id: 'elephant', en: 'elephant', he: 'פיל', visual: { kind: 'text', he: '🐘' } },
  { id: 'monkey', en: 'monkey', he: 'קוף', visual: { kind: 'text', he: '🐵' } },
  { id: 'giraffe', en: 'giraffe', he: 'ג׳ירפה', visual: { kind: 'text', he: '🦒' } },
  { id: 'zebra', en: 'zebra', he: 'זברה', visual: { kind: 'text', he: '🦓' } },
  { id: 'parrot', en: 'parrot', he: 'תוכי', visual: { kind: 'text', he: '🦜' } },
  { id: 'snake', en: 'snake', he: 'נחש', visual: { kind: 'text', he: '🐍' } },
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
