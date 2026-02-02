// src/content/packs/interest/spacePack.ts
import type { ContentPack } from '../../types';

/**
 * V12.3 — Interest Pack: Space (Beginner / Level A)
 * -----------------------------------------------
 * Expanded to two groups/units:
 * - Space Objects
 * - Space Tech
 *
 * Visuals are emoji-only (temporary) for clean rendering.
 */
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

  emoji: '🚀',

  description: 'Learn space words by sound + icons.',
  descriptionKey: 'content.pack.space.desc',

  meta: { tags: ['interest', 'beginnerBridge'] },

  items: [
    { id: 'space_sun', en: 'sun', he: 'שמש', heNiqqud: 'שֶׁמֶשׁ', visual: { kind: 'text', he: '☀️' } },
    { id: 'space_moon', en: 'moon', he: 'ירח', heNiqqud: 'יָרֵחַ', visual: { kind: 'text', he: '🌙' } },
    { id: 'space_star', en: 'star', he: 'כוכב', heNiqqud: 'כּוֹכָב', visual: { kind: 'text', he: '⭐' } },
    { id: 'space_planet', en: 'planet', he: 'כוכב לכת', heNiqqud: 'כּוֹכָב לֶכֶת', visual: { kind: 'text', he: '🪐' } },
    { id: 'space_earth', en: 'earth', he: 'כדור הארץ', heNiqqud: 'כַּדּוּר הָאָרֶץ', visual: { kind: 'text', he: '🌍' } },

    { id: 'space_rocket', en: 'rocket', he: 'טיל', heNiqqud: 'טִיל', visual: { kind: 'text', he: '🚀' } },
    { id: 'space_astronaut', en: 'astronaut', he: 'אסטרונאוט', heNiqqud: 'אַסְטְרוֹנָאוּט', visual: { kind: 'text', he: '🧑‍🚀' } },
    { id: 'space_satellite', en: 'satellite', he: 'לוויין', heNiqqud: 'לַוְיָן', visual: { kind: 'text', he: '🛰️' } },
  ],

  groups: [
    {
      id: 'space_objects',
      title: 'Space – Objects',
      titleKey: 'content.group.space_objects.title',
      policy: { minLayer: 2, gamePoolContribution: true },
      itemIds: ['space_sun', 'space_moon', 'space_star', 'space_planet', 'space_earth'],
    },
    {
      id: 'space_tech',
      title: 'Space – Tech',
      titleKey: 'content.group.space_tech.title',
      policy: { minLayer: 2, gamePoolContribution: true },
      itemIds: ['space_rocket', 'space_astronaut', 'space_satellite'],
    },
  ],

  // Track units are bridged from groups into beginnerTrack; keep empty to avoid duplication.
  units: [],
};
