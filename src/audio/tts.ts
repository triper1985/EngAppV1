// src/audio/tts.ts
// RN-safe TTS layer:
// - Web: window.speechSynthesis
// - Native (Expo): expo-speech
//
// Product decision (V1LearnTest):
// ✅ TTS language is ALWAYS English (en-US) regardless of UI locale.

import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

import type { AudioSettings } from './settings';
import { getAudioSettings } from './settings';

export type SpeakContext = {
  /** Kept for compatibility, but ignored: language is always English. */
  lang?: string;

  /** Optional: effective settings (global + child override). If provided, it wins. */
  settings?: AudioSettings;
};


export type SpeakItemLike = {
  text: string;
  lang?: string;
};

const AUDIO_LANG = 'en-US';

function clampRateFromSpeed(speed: AudioSettings['ttsSpeed']): number {
  // expo-speech rate differs per platform; keep it conservative.
  return speed === 'slow' ? 0.8 : 1.0;
}

function getWebSynth(): SpeechSynthesis | null {
  try {
    const w = globalThis as any;
    return w?.speechSynthesis ?? null;
  } catch {
    return null;
  }
}

function resolveWebVoice(voiceId?: string): SpeechSynthesisVoice | null {
  if (!voiceId) return null;
  const synth = getWebSynth();
  if (!synth?.getVoices) return null;

  const voices = synth.getVoices() ?? [];
  for (const v of voices) {
    const id = (v as any)?.voiceURI || v.name;
    if (id === voiceId) return v;
  }
  return null;
}

export function stopTTS() {
  // Web
  try {
    const synth = getWebSynth();
    synth?.cancel?.();
  } catch {
    // ignore
  }

  // Native
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}

export function speakText(text: string, _ctx?: SpeakContext) {
  const s = _ctx?.settings ?? getAudioSettings();
  if (!s.ttsEnabled) return;

  const clean = String(text ?? '').trim();
  if (!clean) return;

  // Always stop previous first
  stopTTS();

  // ---------- Native (Expo) ----------
  if (Platform.OS !== 'web') {
    try {
      Speech.speak(clean, {
        rate: clampRateFromSpeed(s.ttsSpeed),
        pitch: 1.0,
        voice: s.voiceId ?? undefined,
        language: AUDIO_LANG,
      });
    } catch {
      // ignore
    }
    return;
  }

  // ---------- Web ----------
  const synth = getWebSynth();
  if (!synth) return;

  try {
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = AUDIO_LANG;
    u.rate = s.ttsSpeed === 'slow' ? 0.8 : 1.0;

    const v = resolveWebVoice(s.voiceId);
    if (v) u.voice = v;

    synth.speak(u);
  } catch {
    // ignore
  }
}

export function speakItem(item: SpeakItemLike, ctx?: SpeakContext) {
  // ctx/lang kept for compatibility but ignored.
  speakText(item?.text ?? '', ctx);
}

export function speakContentItem(item: SpeakItemLike, ctx?: SpeakContext) {
  speakItem(item, ctx);
}

// “Once” behavior is handled by once.ts; here we just keep API
export function speakItemOnce(item: SpeakItemLike, ctx?: SpeakContext) {
  speakItem(item, ctx);
}

/**
 * Returns voices list best-effort.
 * Note: We FILTER to English voices only.
 */
export async function listAvailableVoices(): Promise<
  Array<{ id: string; name: string; language?: string }>
> {
  // Native
  if (Platform.OS !== 'web') {
    try {
      const v = await Speech.getAvailableVoicesAsync();
      const arr = Array.isArray(v) ? v : [];
      return arr
        .map((x: any) => {
          const id = String(
            x?.identifier ?? x?.id ?? x?.voiceURI ?? x?.name ?? x?.language ?? ''
          );
          const name = String(x?.name ?? x?.identifier ?? id);
          const language = x?.language ? String(x.language) : undefined;
          return id ? { id, name, language } : null;
        })
        .filter(Boolean)
        .filter((x: any) => String(x.language ?? '').toLowerCase().startsWith('en')) as any;
    } catch {
      return [];
    }
  }

  // Web
  const synth = getWebSynth();
  if (!synth?.getVoices) return [];
  try {
    return (synth.getVoices() ?? [])
      .map((v) => {
        const id = String((v as any)?.voiceURI || v.name || '');
        const name = String(v.name || id);
        const language = v.lang ? String(v.lang) : undefined;
        return id ? { id, name, language } : null;
      })
      .filter(Boolean)
      .filter((x: any) => String(x.language ?? '').toLowerCase().startsWith('en')) as any;
  } catch {
    return [];
  }
}
