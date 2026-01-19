import type { ContentPack } from '../schema';

function num(
  id: string,
  text: string,
  emoji: string,
  heb: string,
  diff: 1 | 2
) {
  return {
    id,
    packId: 'basic',
    audioText: text,
    assist: { hebrewHint: heb },
    display: { type: 'icon' as const, value: emoji },
    difficulty: diff,
  };
}

export const basicPack: ContentPack = {
  id: 'basic',
  type: 'basic',
  title: 'English Basics',
  icon: '🔤',
  isBuiltIn: true,
  items: [
    // stage 1
    {
      id: 'ball',
      packId: 'basic',
      audioText: 'ball',
      assist: { hebrewHint: 'כדור', slowRepeat: true },
      display: { type: 'icon', value: '⚽' },
      difficulty: 1,
    },
    {
      id: 'cat',
      packId: 'basic',
      audioText: 'cat',
      assist: { hebrewHint: 'חתול', slowRepeat: true },
      display: { type: 'icon', value: '🐱' },
      difficulty: 1,
    },
    {
      id: 'dog',
      packId: 'basic',
      audioText: 'dog',
      assist: { hebrewHint: 'כלב', slowRepeat: true },
      display: { type: 'icon', value: '🐶' },
      difficulty: 1,
    },

    // numbers 1-10 (ids: one..ten)
    num('one', 'one', '1️⃣', 'אחד', 2),
    num('two', 'two', '2️⃣', 'שתיים', 2),
    num('three', 'three', '3️⃣', 'שלוש', 2),
    num('four', 'four', '4️⃣', 'ארבע', 2),
    num('five', 'five', '5️⃣', 'חמש', 2),
    num('six', 'six', '6️⃣', 'שש', 2),
    num('seven', 'seven', '7️⃣', 'שבע', 2),
    num('eight', 'eight', '8️⃣', 'שמונה', 2),
    num('nine', 'nine', '9️⃣', 'תשע', 2),
    num('ten', 'ten', '🔟', 'עשר', 2),

    // 11-20 (ids: eleven..twenty)
    num('eleven', 'eleven', '1️⃣1️⃣', 'אחת עשרה', 2),
    num('twelve', 'twelve', '1️⃣2️⃣', 'שתים עשרה', 2),
    num('thirteen', 'thirteen', '1️⃣3️⃣', 'שלוש עשרה', 2),
    num('fourteen', 'fourteen', '1️⃣4️⃣', 'ארבע עשרה', 2),
    num('fifteen', 'fifteen', '1️⃣5️⃣', 'חמש עשרה', 2),
    num('sixteen', 'sixteen', '1️⃣6️⃣', 'שש עשרה', 2),
    num('seventeen', 'seventeen', '1️⃣7️⃣', 'שבע עשרה', 2),
    num('eighteen', 'eighteen', '1️⃣8️⃣', 'שמונה עשרה', 2),
    num('nineteen', 'nineteen', '1️⃣9️⃣', 'תשע עשרה', 2),
    num('twenty', 'twenty', '2️⃣0️⃣', 'עשרים', 2),

    // tens 10..90 (ids: ten, twenty already exist – ok, duplicates avoided by catalog)
    num('thirty', 'thirty', '3️⃣0️⃣', 'שלושים', 2),
    num('forty', 'forty', '4️⃣0️⃣', 'ארבעים', 2),
    num('fifty', 'fifty', '5️⃣0️⃣', 'חמישים', 2),
    num('sixty', 'sixty', '6️⃣0️⃣', 'שישים', 2),
    num('seventy', 'seventy', '7️⃣0️⃣', 'שבעים', 2),
    num('eighty', 'eighty', '8️⃣0️⃣', 'שמונים', 2),
    num('ninety', 'ninety', '9️⃣0️⃣', 'תשעים', 2),

    // hundreds 100..900 (simple emojis)
    num('one_hundred', 'one hundred', '💯', 'מאה', 2),
    num('two_hundred', 'two hundred', '2️⃣💯', 'מאתיים', 2),
    num('three_hundred', 'three hundred', '3️⃣💯', 'שלוש מאות', 2),
    num('four_hundred', 'four hundred', '4️⃣💯', 'ארבע מאות', 2),
    num('five_hundred', 'five hundred', '5️⃣💯', 'חמש מאות', 2),
    num('six_hundred', 'six hundred', '6️⃣💯', 'שש מאות', 2),
    num('seven_hundred', 'seven hundred', '7️⃣💯', 'שבע מאות', 2),
    num('eight_hundred', 'eight hundred', '8️⃣💯', 'שמונה מאות', 2),
    num('nine_hundred', 'nine hundred', '9️⃣💯', 'תשע מאות', 2),

    // thousands 1000..9000
    num('one_thousand', 'one thousand', '1️⃣k', 'אלף', 2),
    num('two_thousand', 'two thousand', '2️⃣k', 'אלפיים', 2),
    num('three_thousand', 'three thousand', '3️⃣k', 'שלושת אלפים', 2),
    num('four_thousand', 'four thousand', '4️⃣k', 'ארבעת אלפים', 2),
    num('five_thousand', 'five thousand', '5️⃣k', 'חמשת אלפים', 2),
    num('six_thousand', 'six thousand', '6️⃣k', 'ששת אלפים', 2),
    num('seven_thousand', 'seven thousand', '7️⃣k', 'שבעת אלפים', 2),
    num('eight_thousand', 'eight thousand', '8️⃣k', 'שמונת אלפים', 2),
    num('nine_thousand', 'nine thousand', '9️⃣k', 'תשעת אלפים', 2),

    // letters A-Z (ids: letter_a..letter_z)
    ...'abcdefghijklmnopqrstuvwxyz'.split('').map((ch) => ({
      id: `letter_${ch}`,
      packId: 'basic',
      audioText: ch,
      assist: { hebrewHint: ch.toUpperCase() },
      display: { type: 'icon' as const, value: ch.toUpperCase() },
      difficulty: 2 as const,
    })),
  ],
};
