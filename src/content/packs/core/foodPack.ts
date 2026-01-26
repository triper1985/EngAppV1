// src/content/packs/core/foodPack.ts
import type { ContentPack } from '../../types';

export const foodPack: ContentPack = {
  id: 'food',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
  },

  title: 'Food',
  titleKey: 'content.pack.food.title',
  description: 'Simple food and drinks.',
  descriptionKey: 'content.pack.food.desc',
  emoji: '🍎',

  // ✅ Core pack + opt-in bridge into beginnerTrack groups/units
  meta: { tags: ['core', 'beginnerBridge'] },

  items: [
    { id: 'food_apple', en: 'apple', he: 'תפוח',
      heNiqqud: 'תַּפּוּחַ',
    visual: { kind: 'text', he: '🍎' } },
    { id: 'food_banana', en: 'banana', he: 'בננה',
      heNiqqud: 'בָּנָנָה',
    visual: { kind: 'text', he: '🍌' } },
    { id: 'food_bread', en: 'bread', he: 'לחם',
      heNiqqud: 'לֶחֶם',
    visual: { kind: 'text', he: '🍞' } },
    { id: 'food_milk', en: 'milk', he: 'חלב',
      heNiqqud: 'חָלָב',
    visual: { kind: 'text', he: '🥛' } },
    { id: 'food_water', en: 'water', he: 'מים',
      heNiqqud: 'מַיִם',
    visual: { kind: 'text', he: '💧' } },
  ],

  // Keep as a single group (bridge fallback will treat pack as one unit)
  groups: [],

  // Not used by beginnerTrack bridge (uses groups), but required by type.
  units: [],
};
