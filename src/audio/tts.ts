// src/audio/tts.ts
// RN-safe TTS layer:
// - Web: window.speechSynthesis
// - Native (Expo): expo-speech (best effort)
//
// Public API is kept compatible with previous versions.

import { Platform } from 'react-native';
import type { AudioSettings } from './settings';
import { getAudioSettings } from './settings';

export type SpeakContext = {
  lang?: string; // e.g. 'en' | 'he'
};

export type SpeakItemLike = {
  text: string;
  lang?: string;
};

// ---------- Optional native speech bridge (expo-speech) ----------
type ExpoSpeechLike = {
  speak?: (text: string, options?: any) => void;
  stop?: () => void;
  getAvailableVoicesAsync?: () => Promise<any[]>;
};

function tryGetExpoSpeech(): ExpoSpeechLike | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-speech');
    return (mod?.default ?? mod) as ExpoSpeechLike;
  } catch {
    return null;
  }
}

function clampRateFromSpeed(speed: AudioSettings['ttsSpeed']): number {
  // expo-speech "rate" differs per platform, but ~0.8/1.0 is usually safe.
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

// Track last engine to stop cleanly
let lastEngine: 'web' | 'expo' | null = null;

export function stopTTS() {
  // Stop web
  try {
    const synth = getWebSynth();
    synth?.cancel?.();
  } catch {
    // ignore
  }

  // Stop expo
  try {
    const expo = tryGetExpoSpeech();
    expo?.stop?.();
  } catch {
    // ignore
  }

  lastEngine = null;
}

export function speakText(text: string, ctx?: SpeakContext) {
  const s = getAudioSettings();
  if (!s.ttsEnabled) return;

  const clean = String(text ?? '').trim();
  if (!clean) return;

  // Always stop previous first
  stopTTS();

  // ---------- Native (Expo) ----------
  if (Platform.OS !== 'web') {
    const expo = tryGetExpoSpeech();
    if (expo?.speak) {
      lastEngine = 'expo';

      // Best-effort mapping:
      // - rate from speed
      // - voiceId passed as "voice" (may be ignored on some platforms)
      // - language can be passed if supported; some expo versions use "language"
      expo.speak(clean, {
        rate: clampRateFromSpeed(s.ttsSpeed),
        pitch: 1.0,
        voice: s.voiceId ?? undefined,
        language: ctx?.lang ?? undefined,
      });
      return;
    }

    // If expo-speech missing, do nothing (no crash)
    return;
  }

  // ---------- Web ----------
  const synth = getWebSynth();
  if (!synth) return;

  try {
    const u = new SpeechSynthesisUtterance(clean);

    // language (optional)
    if (ctx?.lang) u.lang = ctx.lang;

    // speed
    u.rate = s.ttsSpeed === 'slow' ? 0.8 : 1.0;

    // voice
    const v = resolveWebVoice(s.voiceId);
    if (v) u.voice = v;

    lastEngine = 'web';
    synth.speak(u);
  } catch {
    // ignore
  }
}

export function speakItem(item: SpeakItemLike, ctx?: SpeakContext) {
  speakText(item?.text ?? '', { lang: item?.lang ?? ctx?.lang });
}

export function speakContentItem(item: SpeakItemLike, ctx?: SpeakContext) {
  speakItem(item, ctx);
}

// “Once” behavior is handled by once.ts; here we just keep API
export function speakItemOnce(item: SpeakItemLike, ctx?: SpeakContext) {
  speakItem(item, ctx);
}

/**
 * Optional helper (if you want to use it later):
 * Returns voices list best-effort (web sync, native async when available).
 */
export async function listAvailableVoices(): Promise<Array<{ id: string; name: string; language?: string }>> {
  // Native
  if (Platform.OS !== 'web') {
    const expo = tryGetExpoSpeech();
    if (expo?.getAvailableVoicesAsync) {
      try {
        const v = await expo.getAvailableVoicesAsync();
        const arr = Array.isArray(v) ? v : [];
        return arr
          .map((x) => {
            const id = String(x?.identifier ?? x?.id ?? x?.voiceURI ?? x?.name ?? x?.language ?? '');
            const name = String(x?.name ?? x?.identifier ?? id);
            const language = x?.language ? String(x.language) : undefined;
            return id ? { id, name, language } : null;
          })
          .filter(Boolean) as any;
      } catch {
        return [];
      }
    }
    return [];
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
      .filter(Boolean) as any;
  } catch {
    return [];
  }
}
