// src/content/packs/core/transportPack.ts
import type { ContentPack } from '../../types';

export const transportPack: ContentPack = {
  id: 'transport',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
  },

  title: 'Transport',
  titleKey: 'content.pack.transport.title',
  description: 'Ways to move around.',
  descriptionKey: 'content.pack.transport.desc',
  emoji: '🚗',

  // ✅ Core pack + opt-in bridge into beginnerTrack groups/units
  meta: { tags: ['core', 'beginnerBridge'] },

  items: [
    { id: 'transport_car', en: 'car', he: 'מכונית', visual: { kind: 'text', he: '🚗' } },
    { id: 'transport_bus', en: 'bus', he: 'אוטובוס', visual: { kind: 'text', he: '🚌' } },
    { id: 'transport_train', en: 'train', he: 'רכבת', visual: { kind: 'text', he: '🚆' } },
    { id: 'transport_bike', en: 'bike', he: 'אופניים', visual: { kind: 'text', he: '🚲' } },
  ],

  // Keep as a single group (bridge fallback will treat pack as one unit)
  groups: [],

  // Not used by beginnerTrack bridge (uses groups), but required by type.
  units: [],
};
