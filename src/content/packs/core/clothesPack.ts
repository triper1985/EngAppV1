// src/content/packs/core/clothesPack.ts
import type { ContentPack } from '../../types';

export const clothesPack: ContentPack = {
  id: 'clothes',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
  },

  title: 'Clothes',
  titleKey: 'content.pack.clothes.title',
  description: 'Basic clothes you wear.',
  descriptionKey: 'content.pack.clothes.desc',
  emoji: '👕',

  // ✅ Core pack + opt-in bridge into beginnerTrack groups/units
  meta: { tags: ['core', 'beginnerBridge'] },

  items: [
    { id: 'clothes_shirt', en: 'shirt', he: 'חולצה', visual: { kind: 'text', he: '👕' } },
    { id: 'clothes_pants', en: 'pants', he: 'מכנסיים', visual: { kind: 'text', he: '👖' } },
    { id: 'clothes_shoes', en: 'shoes', he: 'נעליים', visual: { kind: 'text', he: '👟' } },
    { id: 'clothes_hat', en: 'hat', he: 'כובע', visual: { kind: 'text', he: '🧢' } },
  ],

  // Keep as a single group (bridge fallback will treat pack as one unit)
  groups: [],

  // Not used by beginnerTrack bridge (uses groups), but required by type.
  units: [],
};
