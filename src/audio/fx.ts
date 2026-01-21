// src/audio/fx.ts
import { Audio } from 'expo-av';
import { getAudioSettings } from './settings';

export type FxEvent =
  | 'tap'
  | 'success'
  | 'error'
  | 'complete'
  | 'learn_complete'
  | 'quiz_success'
  | 'quiz_fail'
  | 'quiz_retry_success'
  | 'unlock';

const FX_SOURCES: Record<FxEvent, any> = {
  tap: require('../../assets/fx/tap.mp3'),

  success: require('../../assets/fx/success.mp3'),
  quiz_success: require('../../assets/fx/success.mp3'),
  quiz_retry_success: require('../../assets/fx/success.mp3'),

  error: require('../../assets/fx/error.mp3'),
  quiz_fail: require('../../assets/fx/error.mp3'),

  complete: require('../../assets/fx/complete.mp3'),
  learn_complete: require('../../assets/fx/complete.mp3'),

  unlock: require('../../assets/fx/unlock.mp3'),
};

const cache = new Map<FxEvent, Audio.Sound>();

async function getSound(event: FxEvent): Promise<Audio.Sound | null> {
  const src = FX_SOURCES[event];
  if (!src) return null;

  const existing = cache.get(event);
  if (existing) return existing;

  const { sound } = await Audio.Sound.createAsync(src, { shouldPlay: false });
  cache.set(event, sound);
  return sound;
}

/** --------- TTS ducking --------- */
let ttsActiveUntil = 0;

/**
 * Call this right before starting TTS.
 * Keep a short window because TTS start is async.
 */
export function notifyTtsStart(windowMs = 1100) {
  ttsActiveUntil = Math.max(ttsActiveUntil, Date.now() + windowMs);
}

/** Call when TTS stops / is cancelled */
export function notifyTtsStop() {
  ttsActiveUntil = 0;
}

function isTtsActive() {
  return Date.now() < ttsActiveUntil;
}
/** -------------------------------- */

export function playFx(event: FxEvent): void {
  const { fxEnabled } = getAudioSettings();
  if (!fxEnabled) return;

  // ✅ critical: don't mix tap FX with spoken word
  if (event === 'tap' && isTtsActive()) return;

  void (async () => {
    try {
      const sound = await getSound(event);
      if (!sound) return;

      await sound.setPositionAsync(0);

      // Softer tap; keep others stronger
      const volume = event === 'tap' ? 0.28 : 0.7;
      await sound.setVolumeAsync(volume);

      await sound.playAsync();
    } catch {
      // ignore
    }
  })();
}

export async function unloadAllFx(): Promise<void> {
  const sounds = [...cache.values()];
  cache.clear();

  await Promise.all(
    sounds.map(async (s) => {
      try {
        await s.unloadAsync();
      } catch {}
    })
  );
}
