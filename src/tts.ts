// src/tts.ts
import type { ContentItem } from './content/types';

/**
 * V10 decision:
 * - Global child-friendly TTS tuning
 * - Slower rate + slightly higher pitch
 *
 * Future (documented):
 * - Parent UI for choosing voice / rate / pitch
 */

const CHILD_TTS_RATE = 0.65; // slower, clearer for kids
const CHILD_TTS_PITCH = 1.2; // slightly warmer, less metallic

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const synth = window.speechSynthesis;
  const voices = synth?.getVoices?.() ?? [];
  if (!voices.length) return undefined;

  const base = lang.split('-')[0];

  // Prefer:
  // 1) exact lang match (en-US, he-IL)
  // 2) same language prefix
  // 3) first available voice
  return (
    voices.find((v) => v.lang === lang) ??
    voices.find((v) => v.lang?.startsWith(base)) ??
    voices[0]
  );
}

export function speakText(text: string, lang: string = 'en-US') {
  const synth = window.speechSynthesis;
  if (!synth) return;

  synth.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;

  const voice = pickVoice(lang);
  if (voice) u.voice = voice;

  // Child-friendly tuning (V10)
  u.rate = CHILD_TTS_RATE;
  u.pitch = CHILD_TTS_PITCH;

  synth.speak(u);
}

export function speakItem(item: ContentItem) {
  // Default: English learning audio. If missing, fallback to Hebrew.
  const text = item.en?.trim() ? item.en : item.he ?? '';
  if (!text) return;

  const lang = item.en?.trim() ? 'en-US' : 'he-IL';
  speakText(text, lang);
}
