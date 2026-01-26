// src/audio/tts.ts
import * as Speech from 'expo-speech';
import type { AudioSettings } from './settings';
import { getAudioSettings } from './settings';
import { notifyTtsStart, notifyTtsStop } from './fx';
import { resetOnceScope } from './once';

export type SpeakItemLike = {
  text: string;
};

export type SpeakContext = {
  /**
   * Optional per-call override. If omitted we use global settings.
   * Many screens already pass: { settings: effectiveAudio }
   */
  settings?: AudioSettings;
  /**
   * Optional "once" scope key: allow speakItemOnce per-session/per-key usage
   */
  onceKey?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Translate app speed to expo-speech rate.
 * expo-speech rate is typically ~0.1..2.0 (platform dependent).
 */
function rateFromSettings(settings: AudioSettings): number {
  const speed = (settings as any).speed ?? 'normal';

  if (speed === 'slow') return 0.8;
  if (speed === 'fast') return 1.15;
  return 1.0;
}

function resolveSettings(ctx?: SpeakContext): AudioSettings {
  const global = getAudioSettings();
  const override = ctx?.settings;
  return override ? { ...global, ...override } : global;
}

function resolveVoice(settings: AudioSettings): string | undefined {
  // your AudioSettings likely has voiceId?: string
  const vid = (settings as any).voiceId as string | undefined;
  return vid || undefined;
}


/**
 * Hebrew TTS overrides (no-nikud robustness)
 * -----------------------------------------
 * Some Hebrew words are misread by TTS without ניקוד.
 * Keep this mapping SMALL and only for known problematic words/phrases.
 *
 * Strategy:
 * - If the entire utterance matches a key → replace with its override.
 * - Otherwise, leave as-is (avoid accidental replacements inside longer text).
 */
const HEBREW_TTS_OVERRIDES: Record<string, string> = {
  // UI / commands that tend to be misread without ניקוד:
  // Prefer a clearer spoken form.
  'הקשב': 'תקשיב',
  'שב': 'שב בבקשה',
};

/**
 * Intent-based Hebrew speech (preferred)
 * -------------------------------------
 * Instead of reading raw Hebrew strings (often ambiguous without ניקוד),
 * we map from the EN "intent" to a clear spoken Hebrew command.
 *
 * Keep keys lowercase.
 */
const EN_TO_HE_SPOKEN: Record<string, string> = {
  listen: 'תקשיב',
  sit: 'שב בבקשה',
  stand: 'תעמוד',
  look: 'תסתכל',
  stop: 'עצור',
  run: 'רוץ',
  jump: 'קפוץ',
  clap: 'מחא כפיים',
};


/**
 * For packs like Letter→Word we prefer Hebrew-friendly "loanword" spellings
 * for the EN word (e.g. Apple → אפל), so Hebrew TTS pronounces it naturally.
 */
const EN_TO_HE_LOANWORD: Record<string, string> = {
  'Apple': 'אפל',
  'Ball': 'בול',
  'Cat': 'קאט',
  'Dog': 'דוג',
  'Egg': 'אג',
  'Fish': 'פיש',
  'Goat': 'גואט',
  'Hat': 'האט',
  'Ice cream': 'אייס קרים',
  'Juice': "ג׳וס",
  'Kite': 'קייט',
  'Lion': 'ליון',
  'Moon': 'מון',
  'Nose': 'נוז',
  'Orange': "אורנג׳",
  'Pig': 'פיג',
  'Queen': 'קווין',
  'Robot': 'רובוט',
  'Sun': 'סאן',
  'Tree': 'טרי',
  'Umbrella': 'אמברלה',
  'Van': 'ואן',
  'Whale': 'ווייל',
  'Xylophone': 'קסילופון',
  'Yo-yo': 'יו-יו',
  'Zebra': 'זברה',
};

const EN_LETTER_TO_HE_PRON: Record<string, string> = {
  A: 'איי',
  B: 'בי',
  C: 'סי',
  D: 'די',
  E: 'אי',
  F: 'אף',
  G: "ג׳י",
  H: "אייץ׳",
  I: 'איי',
  J: "ג׳יי",
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
  W: "דאבליו",
  X: 'אקס',
  Y: 'וואי',
  Z: 'זי',
};

function normalizeHebrewForTts(text: string): string {
  const t = (text ?? '').trim();
  if (!t) return '';
  return HEBREW_TTS_OVERRIDES[t] ?? t;
}

/**
 * Derive a Hebrew phrase to speak for an item, based on its EN intent.
 * Falls back to the provided Hebrew text if no mapping exists.
 */
export function getHebrewSpeakText(item: { en?: string; he?: string; heNiqqud?: string; id?: string }): string {
  const enRaw = (item?.en ?? '').trim();
  const heNiqqudRaw = (item?.heNiqqud ?? '').trim();
  const heRaw = (item?.he ?? '').trim();

  const key = enRaw.toLowerCase();
  const mapped = EN_TO_HE_SPOKEN[key];
  if (mapped) return mapped;

  // If the Hebrew string is one of the known-problematic words, normalizeHebrewForTts will fix it.
  return heNiqqudRaw || heRaw || enRaw || (item?.id ?? '').trim() || ' ';
}

/**
 * Speak an item's Hebrew using intent-based mapping when possible.
 */
export function speakHebrewItemLike(
  item: { en?: string; he?: string; heNiqqud?: string; id?: string },
  ctx?: SpeakContext
): void {
  speakHebrewText(getHebrewSpeakText(item), ctx);
}


function loanwordFromEnglish(enWord: string): string {
  const w = (enWord ?? '').trim();
  if (!w) return '';
  return EN_TO_HE_LOANWORD[w] ?? w; // fallback: keep EN (may be OK on some devices)
}

function hePronounceLetter(letter: string): string {
  const k = (letter ?? '').trim().toUpperCase();
  return EN_LETTER_TO_HE_PRON[k] ?? k;
}

/**
 * Speak a sequence of utterances (chained) without overlapping.
 * We stop existing speech once, then play each part in order.
 */
type SpeakPart = {
  text: string;
  /** optional override per part */
  language?: string;
  rate?: number;
};

let activeSeqToken = 0;

function speakSequence(parts: SpeakPart[], ctx?: SpeakContext): void {
  const cleaned = (parts ?? [])
    .map(p => ({ ...p, text: (p.text ?? '').trim() }))
    .filter(p => p.text);

  if (!cleaned.length) return;

  const settings = resolveSettings(ctx);
  const ttsEnabled = (settings as any).ttsEnabled ?? true;
  if (!ttsEnabled) return;

  // ✅ ensure no overlap
  stopTTS();

  // ✅ duck tap FX while speech is starting/playing
  notifyTtsStart(1200);

  const baseRate = clamp(rateFromSettings(settings), 0.6, 1.4);
  const voice = resolveVoice(settings);

  const token = ++activeSeqToken;

  const speakAt = (i: number) => {
    if (token !== activeSeqToken) return;
    if (i >= cleaned.length) {
      notifyTtsStop();
      return;
    }

    const part = cleaned[i];
    const rate = clamp(part.rate ?? baseRate, 0.6, 1.4);

    try {
      Speech.speak(part.text, {
        rate,
        voice,
        language: part.language as any,
        onDone: () => speakAt(i + 1),
        onStopped: () => {
          // cancelled externally (stopTTS)
          if (token === activeSeqToken) notifyTtsStop();
        },
        onError: () => {
          if (token === activeSeqToken) notifyTtsStop();
        },
      } as any);
    } catch {
      if (token === activeSeqToken) notifyTtsStop();
    }
  };

  speakAt(0);
}

/**
 * Specialized helper: Letter → Word (English)
 * Ensures the letter is heard clearly before the phrase.
 */
export function speakLetterWordEN(letter: string, wordEn: string, ctx?: SpeakContext): void {
  const L = (letter ?? '').trim();
  const W = (wordEn ?? '').trim();
  if (!L && !W) return;
  if (!W) return speakText(L, ctx);
  if (!L) return speakText(W, ctx);

  // Part 1: letter (slightly slower helps clarity for A/I)
  // Part 2: "as in <word>"
  speakSequence(
    [
      { text: L, rate: clamp(rateFromSettings(resolveSettings(ctx)) - 0.05, 0.6, 1.4) },
      { text: `as in ${W}.` },
    ],
    ctx
  );
}

export function speakLetterWordHE(letter: string, wordEn: string, ctx?: SpeakContext): void {
  const L = (letter ?? '').trim();
  const W = (wordEn ?? '').trim();
  if (!L && !W) return;

  const heLetter = hePronounceLetter(L);
  const heWord = loanwordFromEnglish(W);
  const sentence = `${heLetter} כמו ${heWord}.`;
  speakHebrewText(sentence, ctx);
}

/**
 * Stop any in-flight speech immediately.
 */
export function stopTTS(): void {
  try {
    notifyTtsStop();
    Speech.stop();
  } catch {
    // ignore
  }
}

/**
 * Lowest-level speak (text).
 * Cancels previous speech to keep UX crisp.
 */
export function speakText(text: string, ctx?: SpeakContext): void {
  const t = (text ?? '').trim();
  if (!t) return;

  const settings = resolveSettings(ctx);
  const ttsEnabled = (settings as any).ttsEnabled ?? true;
  if (!ttsEnabled) return;

  // ✅ ensure no overlap
  stopTTS();

  // ✅ duck tap FX while speech is starting/playing
  notifyTtsStart(1200);

  const rate = clamp(rateFromSettings(settings), 0.6, 1.4);
  const voice = resolveVoice(settings);

  try {
    Speech.speak(t, {
      rate,
      voice,
      onDone: () => notifyTtsStop(),
      onStopped: () => notifyTtsStop(),
      onError: () => notifyTtsStop(),
    });
  } catch {
    // if speech fails, release ducking
    notifyTtsStop();
  }
}

/**
 * Speak Hebrew text (Beginner helper)
 * ---------------------------------
 * Some selected voices may not support Hebrew. For Beginner we allow
 * a dedicated Hebrew speak button that forces a Hebrew language hint.
 *
 * We intentionally do NOT force a specific voiceId here, because voice ids
 * are platform/device specific. Setting `language: 'he-IL'` usually selects
 * a Hebrew-capable voice when available.
 */
export function speakHebrewText(text: string, ctx?: SpeakContext): void {
  const t = normalizeHebrewForTts((text ?? '').trim());
  if (!t) return;

  const settings = resolveSettings(ctx);
  const ttsEnabled = (settings as any).ttsEnabled ?? true;
  if (!ttsEnabled) return;

  // ✅ ensure no overlap
  stopTTS();

  // ✅ duck tap FX while speech is starting/playing
  notifyTtsStart(1200);

  const rate = clamp(rateFromSettings(settings), 0.6, 1.4);

  try {
    Speech.speak(t, {
      rate,
      language: 'he-IL',
      onDone: () => notifyTtsStop(),
      onStopped: () => notifyTtsStop(),
      onError: () => notifyTtsStop(),
    } as any);
  } catch {
    notifyTtsStop();
  }
}

/**
 * Speak item wrapper.
 */
export function speakItem(item: SpeakItemLike, ctx?: SpeakContext): void {
  speakText(item.text, ctx);
}

/**
 * Compatibility: some screens call speakContentItem({text}, {settings})
 */
export function speakContentItem(item: SpeakItemLike, ctx?: SpeakContext): void {
  speakText(item.text, ctx);
}

/**
 * Speak only once per "onceKey" within a session.
 * Uses resetOnceScope() / internal once.ts mechanism you already have.
 */
const onceSpoken = new Set<string>();

export function speakItemOnce(item: SpeakItemLike, ctx?: SpeakContext): void {
  const key = ctx?.onceKey ?? item.text;
  if (!key) return;

  if (onceSpoken.has(key)) return;
  onceSpoken.add(key);

  speakText(item.text, ctx);
}

/**
 * Allow external reset (e.g., on unit enter).
 * Your project already exports resetOnceScope from './once'
 * We'll also clear our local cache when that is called.
 */
export function resetLocalOnceCache(): void {
  onceSpoken.clear();
  resetOnceScope();
}

