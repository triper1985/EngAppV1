// src/content/packs/core/lettersPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  { id: 'letter_a', en: 'A', he: 'A', visual: { kind: 'text', he: 'A' } },
  { id: 'letter_b', en: 'B', he: 'B', visual: { kind: 'text', he: 'B' } },
  { id: 'letter_c', en: 'C', he: 'C', visual: { kind: 'text', he: 'C' } },
  { id: 'letter_d', en: 'D', he: 'D', visual: { kind: 'text', he: 'D' } },
  { id: 'letter_e', en: 'E', he: 'E', visual: { kind: 'text', he: 'E' } },
  { id: 'letter_f', en: 'F', he: 'F', visual: { kind: 'text', he: 'F' } },

  { id: 'letter_g', en: 'G', he: 'G', visual: { kind: 'text', he: 'G' } },
  { id: 'letter_h', en: 'H', he: 'H', visual: { kind: 'text', he: 'H' } },
  { id: 'letter_i', en: 'I', he: 'I', visual: { kind: 'text', he: 'I' } },
  { id: 'letter_j', en: 'J', he: 'J', visual: { kind: 'text', he: 'J' } },
  { id: 'letter_k', en: 'K', he: 'K', visual: { kind: 'text', he: 'K' } },
  { id: 'letter_l', en: 'L', he: 'L', visual: { kind: 'text', he: 'L' } },

  { id: 'letter_m', en: 'M', he: 'M', visual: { kind: 'text', he: 'M' } },
  { id: 'letter_n', en: 'N', he: 'N', visual: { kind: 'text', he: 'N' } },
  { id: 'letter_o', en: 'O', he: 'O', visual: { kind: 'text', he: 'O' } },
  { id: 'letter_p', en: 'P', he: 'P', visual: { kind: 'text', he: 'P' } },
  { id: 'letter_q', en: 'Q', he: 'Q', visual: { kind: 'text', he: 'Q' } },
  { id: 'letter_r', en: 'R', he: 'R', visual: { kind: 'text', he: 'R' } },

  { id: 'letter_s', en: 'S', he: 'S', visual: { kind: 'text', he: 'S' } },
  { id: 'letter_t', en: 'T', he: 'T', visual: { kind: 'text', he: 'T' } },
  { id: 'letter_u', en: 'U', he: 'U', visual: { kind: 'text', he: 'U' } },
  { id: 'letter_v', en: 'V', he: 'V', visual: { kind: 'text', he: 'V' } },
  { id: 'letter_w', en: 'W', he: 'W', visual: { kind: 'text', he: 'W' } },
  { id: 'letter_x', en: 'X', he: 'X', visual: { kind: 'text', he: 'X' } },
  { id: 'letter_y', en: 'Y', he: 'Y', visual: { kind: 'text', he: 'Y' } },
  { id: 'letter_z', en: 'Z', he: 'Z', visual: { kind: 'text', he: 'Z' } },
];

export const lettersPack: ContentPack = {
  id: 'letters',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 3,
    maxLayer: 4,
    tags: ['letters', 'phonics'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Letters',
  titleKey: 'content.pack.letters.title',

  emoji: '🔤',

  description: 'Learn to recognize letters (sound → symbol).',
  descriptionKey: 'content.pack.letters.desc',

  items,

  groups: [
    {
      id: 'letters_a_f',
      title: 'Letters A–F',
      titleKey: 'beginner.unit.letters_a_f.title',
      itemIds: [
        'letter_a',
        'letter_b',
        'letter_c',
        'letter_d',
        'letter_e',
        'letter_f',
      ],
      policy: { minLayer: 3, maxLayer: 3, skills: ['phonics'] },
    },
    {
      id: 'letters_g_l',
      title: 'Letters G–L',
      titleKey: 'beginner.unit.letters_g_l.title',
      itemIds: [
        'letter_g',
        'letter_h',
        'letter_i',
        'letter_j',
        'letter_k',
        'letter_l',
      ],
      policy: { minLayer: 3, maxLayer: 3, skills: ['phonics'] },
    },
    {
      id: 'letters_m_r',
      title: 'Letters M–R',
      titleKey: 'beginner.unit.letters_m_r.title',
      itemIds: [
        'letter_m',
        'letter_n',
        'letter_o',
        'letter_p',
        'letter_q',
        'letter_r',
      ],
      policy: { minLayer: 3, maxLayer: 3, skills: ['phonics'] },
    },
    {
      id: 'letters_s_z',
      title: 'Letters S–Z',
      titleKey: 'beginner.unit.letters_s_z.title',
      itemIds: [
        'letter_s',
        'letter_t',
        'letter_u',
        'letter_v',
        'letter_w',
        'letter_x',
        'letter_y',
        'letter_z',
      ],
      policy: { minLayer: 4, maxLayer: 4, skills: ['phonics'] },
    },
  ],

  units: [],
};
