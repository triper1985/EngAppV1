// src/content/packs/core/toysPack.ts
import type { ContentPack } from '../../types';

export const toysPack: ContentPack = {
  id: 'toys',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
  },

  title: 'Toys',
  titleKey: 'content.pack.toys.title',
  description: 'Fun toys and games.',
  descriptionKey: 'content.pack.toys.desc',
  emoji: '🧸',

  // ✅ Core pack + opt-in bridge into beginnerTrack groups/units
  meta: { tags: ['core', 'beginnerBridge'] },

  items: [
    { id: 'toys_ball', en: 'ball', he: 'כדור', visual: { kind: 'text', he: '⚽' } },
    { id: 'toys_doll', en: 'doll', he: 'בובה', visual: { kind: 'text', he: '🪆' } },
    { id: 'toys_teddy', en: 'teddy bear', he: 'דובי', visual: { kind: 'text', he: '🧸' } },
    { id: 'toys_blocks', en: 'blocks', he: 'קוביות', visual: { kind: 'text', he: '🧱' } },
  ],

  // Keep as a single group (bridge fallback will treat pack as one unit)
  groups: [],

  // Not used by beginnerTrack bridge (uses groups), but required by type.
  units: [],
};
