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

  if (speed === 'slow') return 0.85;
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


