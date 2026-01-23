// src/content/packs/core/letterWordsPack.ts
import type { ContentItem, ContentPack } from '../../types';

// Letter → Word (A → Apple)
// -------------------------
// Notes:
// - Beginner kids can't read English yet, so UI uses visuals.
// - We keep the displayed letter as a text visual.
// - The linked word uses iconId that points to itemVisualRegistry.
// - We also store Hebrew words for the "Speak Hebrew" button.

type LetterWordLink = { en: string; he: string; iconId: string };

function lw(
  id: string,
  letter: string,
  link: LetterWordLink
): ContentItem & { link: LetterWordLink } {
  return {
    id,
    en: letter,
    he: letter,
    visual: { kind: 'text', he: letter },
    link,
    tags: ['letterWord'],
  };
}

const items: (ContentItem & { link: LetterWordLink })[] = [
  lw('lw_a', 'A', { en: 'Apple', he: 'תפוח', iconId: 'lw_apple_icon' }),
  lw('lw_b', 'B', { en: 'Ball', he: 'כדור', iconId: 'lw_ball_icon' }),

  // ✅ FIX: Cat should use the icon that lives under items/letter_words/cat.png
  // So iconId must match the file name: cat.png → "cat"
  lw('lw_c', 'C', { en: 'Cat', he: 'חתול', iconId: 'cat' }),

  lw('lw_d', 'D', { en: 'Dog', he: 'כלב', iconId: 'lw_dog_icon' }),
  lw('lw_e', 'E', { en: 'Egg', he: 'ביצה', iconId: 'lw_egg_icon' }),
  lw('lw_f', 'F', { en: 'Fish', he: 'דג', iconId: 'lw_fish_icon' }),

  lw('lw_g', 'G', { en: 'Goat', he: 'עז', iconId: 'lw_goat_icon' }),
  lw('lw_h', 'H', { en: 'Hat', he: 'כובע', iconId: 'lw_hat_icon' }),
  lw('lw_i', 'I', {
    en: 'Ice cream',
    he: 'גלידה',
    iconId: 'lw_icecream_icon',
  }),
  lw('lw_j', 'J', { en: 'Juice', he: 'מיץ', iconId: 'lw_juice_icon' }),
  lw('lw_k', 'K', { en: 'Kite', he: 'עפיפון', iconId: 'lw_kite_icon' }),
  lw('lw_l', 'L', { en: 'Lion', he: 'אריה', iconId: 'lw_lion_icon' }),

  lw('lw_m', 'M', { en: 'Moon', he: 'ירח', iconId: 'lw_moon_icon' }),
  lw('lw_n', 'N', { en: 'Nose', he: 'אף', iconId: 'lw_nose_icon' }),
  lw('lw_o', 'O', { en: 'Orange', he: 'תפוז', iconId: 'lw_orange_icon' }),
  lw('lw_p', 'P', { en: 'Pig', he: 'חזיר', iconId: 'lw_pig_icon' }),
  lw('lw_q', 'Q', { en: 'Queen', he: 'מלכה', iconId: 'lw_queen_icon' }),
  lw('lw_r', 'R', { en: 'Robot', he: 'רובוט', iconId: 'lw_robot_icon' }),

  lw('lw_s', 'S', { en: 'Sun', he: 'שמש', iconId: 'lw_sun_icon' }),
  lw('lw_t', 'T', { en: 'Tree', he: 'עץ', iconId: 'lw_tree_icon' }),
  lw('lw_u', 'U', {
    en: 'Umbrella',
    he: 'מטרייה',
    iconId: 'lw_umbrella_icon',
  }),
  lw('lw_v', 'V', { en: 'Van', he: 'ואן', iconId: 'lw_van_icon' }),
  lw('lw_w', 'W', { en: 'Whale', he: 'לוויתן', iconId: 'lw_whale_icon' }),
  lw('lw_x', 'X', {
    en: 'Xylophone',
    he: 'קסילופון',
    iconId: 'lw_xylophone_icon',
  }),
  lw('lw_y', 'Y', { en: 'Yo-yo', he: 'יו-יו', iconId: 'lw_yoyo_icon' }),
  lw('lw_z', 'Z', { en: 'Zebra', he: 'זברה', iconId: 'lw_zebra_icon' }),
];

export const letterWordsPack: ContentPack = {
  id: 'letter_words',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 3,
    maxLayer: 3,
    tags: ['core', 'beginnerBridge', 'phonics'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Letter → Word',
  titleKey: 'content.pack.letter_words.title',
  emoji: '🔗',
  description: 'Match a letter to a word (A → Apple).',
  descriptionKey: 'content.pack.letter_words.desc',

  items,

  groups: [
    {
      id: 'letter_words_a_f',
      title: 'Letter → Word (A–F)',
      titleKey: 'beginner.unit.letter_words_a_f.title',
      itemIds: ['lw_a', 'lw_b', 'lw_c', 'lw_d', 'lw_e', 'lw_f'],
      policy: { minLayer: 3, maxLayer: 3, skills: ['phonics'] },
    },
    {
      id: 'letter_words_g_l',
      title: 'Letter → Word (G–L)',
      titleKey: 'beginner.unit.letter_words_g_l.title',
      itemIds: ['lw_g', 'lw_h', 'lw_i', 'lw_j', 'lw_k', 'lw_l'],
      policy: { minLayer: 3, maxLayer: 3, skills: ['phonics'] },
    },
    {
      id: 'letter_words_m_r',
      title: 'Letter → Word (M–R)',
      titleKey: 'beginner.unit.letter_words_m_r.title',
      itemIds: ['lw_m', 'lw_n', 'lw_o', 'lw_p', 'lw_q', 'lw_r'],
      policy: { minLayer: 3, maxLayer: 3, skills: ['phonics'] },
    },
    {
      id: 'letter_words_s_z',
      title: 'Letter → Word (S–Z)',
      titleKey: 'beginner.unit.letter_words_s_z.title',
      itemIds: ['lw_s', 'lw_t', 'lw_u', 'lw_v', 'lw_w', 'lw_x', 'lw_y', 'lw_z'],
      policy: { minLayer: 3, maxLayer: 3, skills: ['phonics'] },
    },
  ],

  // Not used by the Beginner bridge (bridge uses pack.groups) but kept for completeness.
  units: [],
};
