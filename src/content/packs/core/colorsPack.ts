// src/content/packs/core/colorsPack.ts
import type { ContentPack } from '../../types';

export const colorsPack: ContentPack = {
  id: 'colors',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['colors'],
  },

  title: 'Colors',
  titleKey: 'content.pack.colors.title',

  emoji: '🎨',

  description:
    'Beginner colors: visual answers only, no English reading required.',
  descriptionKey: 'content.pack.colors.desc',

  // ✅ Core pack + opt-in bridge into beginnerTrack groups/units
  meta: { tags: ['core', 'beginnerBridge'] },

  items: [
    {
      id: 'color_red',
      en: 'red',
      he: 'אדום',
      heNiqqud: 'אָדוֹם',
    visual: { kind: 'color', hex: '#E53935' },
    },
    {
      id: 'color_blue',
      en: 'blue',
      he: 'כחול',
      heNiqqud: 'כָּחוֹל',
    visual: { kind: 'color', hex: '#1E88E5' },
    },
    {
      id: 'color_yellow',
      en: 'yellow',
      he: 'צהוב',
      heNiqqud: 'צָהֹב',
    visual: { kind: 'color', hex: '#FDD835' },
    },
    {
      id: 'color_green',
      en: 'green',
      he: 'ירוק',
      heNiqqud: 'יָרֹק',
    visual: { kind: 'color', hex: '#43A047' },
    },
    {
      id: 'color_black',
      en: 'black',
      he: 'שחור',
      heNiqqud: 'שָׁחוֹר',
    visual: { kind: 'color', hex: '#212121' },
    },
    {
      id: 'color_white',
      en: 'white',
      he: 'לבן',
      heNiqqud: 'לָבָן',
    visual: { kind: 'color', hex: '#FFFFFF' },
    },

    {
      id: 'color_gray',
      en: 'gray',
      he: 'אפור',
      heNiqqud: 'אָפֹר',
    visual: { kind: 'color', hex: '#9E9E9E' },
    },
    {
      id: 'color_brown',
      en: 'brown',
      he: 'חום',
      heNiqqud: 'חוּם',
    visual: { kind: 'color', hex: '#6D4C41' },
    },
    {
      id: 'color_pink',
      en: 'pink',
      he: 'ורוד',
      heNiqqud: 'וָרוֹד',
    visual: { kind: 'color', hex: '#EC407A' },
    },
    {
      id: 'color_purple',
      en: 'purple',
      he: 'סגול',
      heNiqqud: 'סָגוֹל',
    visual: { kind: 'color', hex: '#8E24AA' },
    },
    {
      id: 'color_orange',
      en: 'orange',
      he: 'כתום',
      heNiqqud: 'כָּתֹם',
    visual: { kind: 'color', hex: '#FB8C00' },
    },

    {
      id: 'color_gold',
      en: 'gold',
      he: 'זהב',
      heNiqqud: 'זָהָב',
    visual: { kind: 'color', hex: '#D4AF37' },
    },
    {
      id: 'color_silver',
      en: 'silver',
      he: 'כסף',
      heNiqqud: 'כֶּסֶף',
    visual: { kind: 'color', hex: '#C0C0C0' },
    },
    {
      id: 'color_rainbow',
      en: 'rainbow',
      he: 'קשת',
      heNiqqud: 'קֶשֶׁת',
    visual: { kind: 'text', he: '🌈 קֶשֶׁת' },
    },
  ],

  groups: [
    {
      id: 'colors_basics',
      policy: { minLayer: 2 },
      title: 'Colors – Basics',
      titleKey: 'content.group.colors_basics.title',
      itemIds: [
        'color_red',
        'color_blue',
        'color_yellow',
        'color_green',
        'color_black',
        'color_white',
      ],
    },
    {
      id: 'colors_neutrals',
      policy: { minLayer: 2 },
      title: 'Colors – Neutrals',
      titleKey: 'content.group.colors_neutrals.title',
      itemIds: [
        'color_gray',
        'color_brown',
        'color_pink',
        'color_purple',
        'color_orange',
      ],
    },
    {
      id: 'colors_fun',
      policy: { minLayer: 2 },
      title: 'Colors – Fun',
      titleKey: 'content.group.colors_fun.title',
      itemIds: ['color_gold', 'color_silver', 'color_rainbow'],
    },
  ],

  // ✅ V2 units (learn/quiz) — לא משפיע על beginnerTrack bridge (הוא עובד על groups)
  // אבל זה משאיר את המודל אחיד ומוכן לעתיד.
  units: [
    {
      id: 'colors_basics_learn',
      title: 'Colors – Basics (Learn)',
      kind: 'learn',
      groupId: 'colors_basics',
    },
    {
      id: 'colors_basics_quiz',
      title: 'Colors – Basics (Quiz)',
      kind: 'quiz',
      groupId: 'colors_basics',
      prereq: { requiresUnitIds: ['colors_basics_learn'] },
    },

    {
      id: 'colors_neutrals_learn',
      title: 'Colors – Neutrals (Learn)',
      kind: 'learn',
      groupId: 'colors_neutrals',
      prereq: { requiresUnitIds: ['colors_basics_quiz'] },
    },
    {
      id: 'colors_neutrals_quiz',
      title: 'Colors – Neutrals (Quiz)',
      kind: 'quiz',
      groupId: 'colors_neutrals',
      prereq: { requiresUnitIds: ['colors_neutrals_learn'] },
    },

    {
      id: 'colors_fun_learn',
      title: 'Colors – Fun (Learn)',
      kind: 'learn',
      groupId: 'colors_fun',
      prereq: { requiresUnitIds: ['colors_neutrals_quiz'] },
    },
    {
      id: 'colors_fun_quiz',
      title: 'Colors – Fun (Quiz)',
      kind: 'quiz',
      groupId: 'colors_fun',
      prereq: { requiresUnitIds: ['colors_fun_learn'] },
    },
  ],
};
