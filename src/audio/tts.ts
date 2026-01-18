// src/audio/tts.ts

import type { ContentItem } from '../content/types';
import type { ChildProfile } from '../types';
import { getEffectiveAudioSettings, getTtsPitch, getTtsRate } from './settings';
import { hasSpoken, markSpoken } from './once';

export type SpeakContext = 'learn' | 'quiz' | 'practice';

export type SpeakItemLike = {
  he?: string;
  en?: string;
};

type SpeakTextOpts = {
  lang?: 'en-US' | 'he-IL';
  context?: SpeakContext;
};

type SpeakOnceOpts = SpeakTextOpts & {
  delayMs?: number; // default 120ms (matches V10 behavior)
};

function normalizeText(text: string | undefined | null): string {
  return (text ?? '').trim();
}

function pickVoiceByIdOrLang(
  lang: string,
  child?: ChildProfile | null
): SpeechSynthesisVoice | undefined {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  const { voiceId } = getEffectiveAudioSettings(child);
  if (voiceId) {
    const byId =
      voices.find((v) => v.voiceURI === voiceId) ||
      voices.find((v) => v.name === voiceId);
    if (byId) return byId;
  }

  // Fallback: try match exact lang, then prefix match (en- / he-)
  const exact = voices.find((v) => v.lang === lang);
  if (exact) return exact;

  const prefix = lang.split('-')[0] + '-';
  const pref = voices.find((v) => v.lang?.startsWith(prefix));
  if (pref) return pref;

  return voices[0];
}

export function stopTTS(): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
}

export function speakText(
  text: string,
  opts: SpeakTextOpts = {},
  child?: ChildProfile | null
): void {
  const { ttsEnabled, ttsSpeed } = getEffectiveAudioSettings(child);
  if (!ttsEnabled) return;

  const clean = normalizeText(text);
  if (!clean) return;

  const lang = opts.lang ?? 'en-US';

  const synth = window.speechSynthesis;

  // Cancel previous utterance (V10 behavior)
  synth.cancel();

  const u = new SpeechSynthesisUtterance(clean);
  u.lang = lang;

  const voice = pickVoiceByIdOrLang(lang, child);
  if (voice) u.voice = voice;

  // Kid-friendly tuning (V10 baseline) + speed choice (V11.1)
  u.rate = getTtsRate(ttsSpeed);
  u.pitch = getTtsPitch();

  synth.speak(u);
}

export function speakItem(
  item: SpeakItemLike,
  opts: SpeakTextOpts = {},
  child?: ChildProfile | null
): void {
  // Default: English learning audio. If missing, fallback to Hebrew.
  const en = normalizeText(item.en);
  const he = normalizeText(item.he);

  const text = en ? en : he;
  if (!text) return;

  const lang = opts.lang ?? (en ? 'en-US' : 'he-IL');
  speakText(text, { ...opts, lang }, child);
}

/**
 * Convenience for existing code that passes ContentItem.
 */
export function speakContentItem(
  item: ContentItem,
  opts: SpeakTextOpts = {},
  child?: ChildProfile | null
): void {
  speakItem({ en: item.en, he: item.he }, opts, child);
}

/**
 * Speak only once per key (guards + delay centralized).
 * This is what removes the duplicated "already spoken" logic from screens.
 */
export function speakItemOnce(
  key: string,
  item: SpeakItemLike,
  opts: SpeakOnceOpts = {},
  child?: ChildProfile | null
): void {
  if (hasSpoken(key)) return;

  const delayMs = opts.delayMs ?? 120;

  // Mark immediately to avoid racing re-renders triggering multiple timeouts
  markSpoken(key);

  window.setTimeout(() => {
    speakItem(item, opts, child);
  }, delayMs);
}
