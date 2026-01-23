// src/screens/learn/letterWordSpeech.ts

const LETTER_NAME_HE: Record<string, string> = {
  A: 'איי',
  B: 'בי',
  C: 'סי',
  D: 'די',
  E: 'אי',
  F: 'אף',
  G: 'ג׳י',
  H: 'אייץ׳',
  I: 'איי',
  J: 'ג׳יי',
  K: 'קיי',
  L: 'אל',
  M: 'אם',
  N: 'אן',
  O: 'או',
  P: 'פי',
  Q: 'קיו',
  R: 'אר',
  S: 'אס',
  T: 'טי',
  U: 'יו',
  V: 'וי',
  W: 'דאבל-יו',
  X: 'אקס',
  Y: 'וואי',
  Z: 'זי',
};

export function buildLetterWordPhraseEN(letter: string, wordEn: string): string {
  const L = (letter || '').trim();
  const W = (wordEn || '').trim();
  if (!L && !W) return '';
  if (!W) return L;
  if (!L) return W;
  return `${L} as in ${W}.`;
}

export function buildLetterWordPhraseHE(letter: string, wordEn: string, wordHe: string): string {
  const L = (letter || '').trim().toUpperCase();
  const WEN = (wordEn || '').trim();
  const WHE = (wordHe || '').trim();
  const letterNameHe = LETTER_NAME_HE[L] ?? L;

  // קצר לילדים: "אפל זה תפוח. אפל מתחיל ב־איי."
  if (WEN && WHE) {
    return `${WEN} זה ${WHE}. ${WEN} מתחיל ב־${letterNameHe}.`;
  }

  // fallbacks
  if (WHE) return WHE;
  if (WEN) return `${WEN} מתחיל ב־${letterNameHe}.`;
  return letterNameHe;
}
