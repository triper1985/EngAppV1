// src/content/packs/core/homePack.ts
import type { ContentPack } from '../../types';

export const homePack: ContentPack = {
  id: 'home',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
  },

  title: 'Home',
  titleKey: 'content.pack.home.title',
  description: 'Everyday things at home.',
  descriptionKey: 'content.pack.home.desc',
  emoji: '🏠',

  // ✅ Core pack + opt-in bridge into beginnerTrack groups/units
  meta: { tags: ['core', 'beginnerBridge'] },

  items: [
    { id: 'home_bed', en: 'bed', he: 'מיטה',
      heNiqqud: 'מִטָּה',
    visual: { kind: 'text', he: '🛏️' } },
    { id: 'home_chair', en: 'chair', he: 'כיסא',
      heNiqqud: 'כִּסֵּא',
    visual: { kind: 'text', he: '🪑' } },
    { id: 'home_table', en: 'table', he: 'שולחן',
      heNiqqud: 'שֻׁלְחָן',
    visual: { kind: 'text', he: '🪑' } },
    { id: 'home_door', en: 'door', he: 'דלת',
      heNiqqud: 'דֶּלֶת',
    visual: { kind: 'text', he: '🚪' } },
    { id: 'home_window', en: 'window', he: 'חלון',
      heNiqqud: 'חַלּוֹן',
    visual: { kind: 'text', he: '🪟' } },
  ],

  // Keep as a single group (bridge fallback will treat pack as one unit)
  groups: [],

  // Not used by beginnerTrack bridge (uses groups), but required by type.
  units: [],
};
