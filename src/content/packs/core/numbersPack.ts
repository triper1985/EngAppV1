// src/content/packs/core/numbersPack.ts
import type { ContentItem, ContentPack } from '../../types';

const items: ContentItem[] = [
  { id: 'one', en: 'one', he: 'אחד', visual: { kind: 'text', he: '1' } },
  { id: 'two', en: 'two', he: 'שתיים', visual: { kind: 'text', he: '2' } },
  { id: 'three', en: 'three', he: 'שלוש', visual: { kind: 'text', he: '3' } },
  { id: 'four', en: 'four', he: 'ארבע', visual: { kind: 'text', he: '4' } },
  { id: 'five', en: 'five', he: 'חמש', visual: { kind: 'text', he: '5' } },
  { id: 'six', en: 'six', he: 'שש', visual: { kind: 'text', he: '6' } },
  { id: 'seven', en: 'seven', he: 'שבע', visual: { kind: 'text', he: '7' } },
  { id: 'eight', en: 'eight', he: 'שמונה', visual: { kind: 'text', he: '8' } },
  { id: 'nine', en: 'nine', he: 'תשע', visual: { kind: 'text', he: '9' } },
  { id: 'ten', en: 'ten', he: 'עשר', visual: { kind: 'text', he: '10' } },

  {
    id: 'eleven',
    en: 'eleven',
    he: 'אחת עשרה',
    visual: { kind: 'text', he: '11' },
  },
  {
    id: 'twelve',
    en: 'twelve',
    he: 'שתים עשרה',
    visual: { kind: 'text', he: '12' },
  },
  {
    id: 'thirteen',
    en: 'thirteen',
    he: 'שלוש עשרה',
    visual: { kind: 'text', he: '13' },
  },
  {
    id: 'fourteen',
    en: 'fourteen',
    he: 'ארבע עשרה',
    visual: { kind: 'text', he: '14' },
  },
  {
    id: 'fifteen',
    en: 'fifteen',
    he: 'חמש עשרה',
    visual: { kind: 'text', he: '15' },
  },
  {
    id: 'sixteen',
    en: 'sixteen',
    he: 'שש עשרה',
    visual: { kind: 'text', he: '16' },
  },
  {
    id: 'seventeen',
    en: 'seventeen',
    he: 'שבע עשרה',
    visual: { kind: 'text', he: '17' },
  },
  {
    id: 'eighteen',
    en: 'eighteen',
    he: 'שמונה עשרה',
    visual: { kind: 'text', he: '18' },
  },
  {
    id: 'nineteen',
    en: 'nineteen',
    he: 'תשע עשרה',
    visual: { kind: 'text', he: '19' },
  },
  {
    id: 'twenty',
    en: 'twenty',
    he: 'עשרים',
    visual: { kind: 'text', he: '20' },
  },

  {
    id: 'twenty_one',
    en: 'twenty-one',
    he: 'עשרים ואחת',
    visual: { kind: 'text', he: '21' },
  },
  {
    id: 'twenty_two',
    en: 'twenty-two',
    he: 'עשרים ושתיים',
    visual: { kind: 'text', he: '22' },
  },
  {
    id: 'twenty_three',
    en: 'twenty-three',
    he: 'עשרים ושלוש',
    visual: { kind: 'text', he: '23' },
  },
  {
    id: 'twenty_four',
    en: 'twenty-four',
    he: 'עשרים וארבע',
    visual: { kind: 'text', he: '24' },
  },
  {
    id: 'twenty_five',
    en: 'twenty-five',
    he: 'עשרים וחמש',
    visual: { kind: 'text', he: '25' },
  },
  {
    id: 'twenty_six',
    en: 'twenty-six',
    he: 'עשרים ושש',
    visual: { kind: 'text', he: '26' },
  },
  {
    id: 'twenty_seven',
    en: 'twenty-seven',
    he: 'עשרים ושבע',
    visual: { kind: 'text', he: '27' },
  },
  {
    id: 'twenty_eight',
    en: 'twenty-eight',
    he: 'עשרים ושמונה',
    visual: { kind: 'text', he: '28' },
  },
  {
    id: 'twenty_nine',
    en: 'twenty-nine',
    he: 'עשרים ותשע',
    visual: { kind: 'text', he: '29' },
  },
  {
    id: 'thirty',
    en: 'thirty',
    he: 'שלושים',
    visual: { kind: 'text', he: '30' },
  },

  {
    id: 'forty',
    en: 'forty',
    he: 'ארבעים',
    visual: { kind: 'text', he: '40' },
  },
  {
    id: 'fifty',
    en: 'fifty',
    he: 'חמישים',
    visual: { kind: 'text', he: '50' },
  },
  { id: 'sixty', en: 'sixty', he: 'שישים', visual: { kind: 'text', he: '60' } },
  {
    id: 'seventy',
    en: 'seventy',
    he: 'שבעים',
    visual: { kind: 'text', he: '70' },
  },
  {
    id: 'eighty',
    en: 'eighty',
    he: 'שמונים',
    visual: { kind: 'text', he: '80' },
  },
  {
    id: 'ninety',
    en: 'ninety',
    he: 'תשעים',
    visual: { kind: 'text', he: '90' },
  },

  {
    id: 'one_hundred',
    en: 'one hundred',
    he: 'מאה',
    visual: { kind: 'text', he: '100' },
  },
  {
    id: 'two_hundred',
    en: 'two hundred',
    he: 'מאתיים',
    visual: { kind: 'text', he: '200' },
  },
  {
    id: 'three_hundred',
    en: 'three hundred',
    he: 'שלוש מאות',
    visual: { kind: 'text', he: '300' },
  },
  {
    id: 'four_hundred',
    en: 'four hundred',
    he: 'ארבע מאות',
    visual: { kind: 'text', he: '400' },
  },
  {
    id: 'five_hundred',
    en: 'five hundred',
    he: 'חמש מאות',
    visual: { kind: 'text', he: '500' },
  },
  {
    id: 'six_hundred',
    en: 'six hundred',
    he: 'שש מאות',
    visual: { kind: 'text', he: '600' },
  },
  {
    id: 'seven_hundred',
    en: 'seven hundred',
    he: 'שבע מאות',
    visual: { kind: 'text', he: '700' },
  },
  {
    id: 'eight_hundred',
    en: 'eight hundred',
    he: 'שמונה מאות',
    visual: { kind: 'text', he: '800' },
  },
  {
    id: 'nine_hundred',
    en: 'nine hundred',
    he: 'תשע מאות',
    visual: { kind: 'text', he: '900' },
  },

  {
    id: 'one_thousand',
    en: 'one thousand',
    he: 'אלף',
    visual: { kind: 'text', he: '1000' },
  },
  {
    id: 'two_thousand',
    en: 'two thousand',
    he: 'אלפיים',
    visual: { kind: 'text', he: '2000' },
  },
  {
    id: 'three_thousand',
    en: 'three thousand',
    he: 'שלושת אלפים',
    visual: { kind: 'text', he: '3000' },
  },
  {
    id: 'four_thousand',
    en: 'four thousand',
    he: 'ארבעת אלפים',
    visual: { kind: 'text', he: '4000' },
  },
  {
    id: 'five_thousand',
    en: 'five thousand',
    he: 'חמשת אלפים',
    visual: { kind: 'text', he: '5000' },
  },
  {
    id: 'six_thousand',
    en: 'six thousand',
    he: 'ששת אלפים',
    visual: { kind: 'text', he: '6000' },
  },
  {
    id: 'seven_thousand',
    en: 'seven thousand',
    he: 'שבעת אלפים',
    visual: { kind: 'text', he: '7000' },
  },
  {
    id: 'eight_thousand',
    en: 'eight thousand',
    he: 'שמונת אלפים',
    visual: { kind: 'text', he: '8000' },
  },
  {
    id: 'nine_thousand',
    en: 'nine thousand',
    he: 'תשעת אלפים',
    visual: { kind: 'text', he: '9000' },
  },
];

export const numbersPack: ContentPack = {
  id: 'numbers',
  policy: {
    packType: 'core',
    levelTag: 'A',
    minLayer: 2,
    maxLayer: 4,
    tags: ['numbers'],
  },
  meta: { tags: ['core', 'beginnerBridge'] },

  title: 'Numbers',
  titleKey: 'content.pack.numbers.title',

  emoji: '🔢',

  description: 'Learn to say and recognize numbers (sound → symbol).',
  descriptionKey: 'content.pack.numbers.desc',

  items,

  groups: [
    {
      id: 'numbers_1_5',
      title: 'Numbers 1–5',
      titleKey: 'beginner.unit.numbers_1_5.title',
      itemIds: ['one', 'two', 'three', 'four', 'five'],
      policy: { minLayer: 2 },
    },
    {
      id: 'numbers_6_10',
      title: 'Numbers 6–10',
      titleKey: 'beginner.unit.numbers_6_10.title',
      itemIds: ['six', 'seven', 'eight', 'nine', 'ten'],
      policy: { minLayer: 2 },
    },
    {
      id: 'numbers_11_15',
      title: 'Numbers 11–15',
      titleKey: 'beginner.unit.numbers_11_15.title',
      itemIds: ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'],
      policy: { minLayer: 2 },
    },
    {
      id: 'numbers_16_20',
      title: 'Numbers 16–20',
      titleKey: 'beginner.unit.numbers_16_20.title',
      itemIds: ['sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
      policy: { minLayer: 2 },
    },
    {
      id: 'numbers_21_25',
      title: 'Numbers 21–25',
      titleKey: 'beginner.unit.numbers_21_25.title',
      itemIds: [
        'twenty_one',
        'twenty_two',
        'twenty_three',
        'twenty_four',
        'twenty_five',
      ],
      policy: { minLayer: 2 },
    },
    {
      id: 'numbers_26_30',
      title: 'Numbers 26–30',
      titleKey: 'beginner.unit.numbers_26_30.title',
      itemIds: [
        'twenty_six',
        'twenty_seven',
        'twenty_eight',
        'twenty_nine',
        'thirty',
      ],
      policy: { minLayer: 2 },
    },

    // ✅ Tens split (V10)
    {
      id: 'tens_10_50',
      title: 'Tens (10–50)',
      titleKey: 'beginner.unit.tens_10_50.title',
      itemIds: ['ten', 'twenty', 'thirty', 'forty', 'fifty'],
      policy: { minLayer: 3 },
    },
    {
      id: 'tens_60_90',
      title: 'Tens (60–90)',
      titleKey: 'beginner.unit.tens_60_90.title',
      itemIds: ['sixty', 'seventy', 'eighty', 'ninety'],
      policy: { minLayer: 3 },
    },

    {
      id: 'hundreds_100_900',
      title: 'Hundreds (100–900)',
      titleKey: 'beginner.unit.hundreds_100_900.title',
      itemIds: [
        'one_hundred',
        'two_hundred',
        'three_hundred',
        'four_hundred',
        'five_hundred',
        'six_hundred',
        'seven_hundred',
        'eight_hundred',
        'nine_hundred',
      ],
      policy: { minLayer: 3 },
    },
    {
      id: 'thousands_1000_9000',
      title: 'Thousands (1000–9000)',
      titleKey: 'beginner.unit.thousands_1000_9000.title',
      itemIds: [
        'one_thousand',
        'two_thousand',
        'three_thousand',
        'four_thousand',
        'five_thousand',
        'six_thousand',
        'seven_thousand',
        'eight_thousand',
        'nine_thousand',
      ],
      policy: { minLayer: 4 },
    },
  ],

  // Track units are bridged from pack.groups into the Beginner track; keep empty to avoid duplication.
  units: [],
};
