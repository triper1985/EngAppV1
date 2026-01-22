import { Audio } from 'expo-av';
import { getAudioSettings } from './settings';

/**
 * FX semantics (product spec)
 * --------------------------------
 * tap      = next button click
 * success  = correct answer (quiz / retry)
 * error    = wrong answer (quiz / retry)
 * fail     = quiz end fail (gentle)
 * complete = end-of-unit success (learn/practice/quiz)
 */
export type FxEvent =
  | 'tap'
  | 'success'
  | 'error'
  | 'fail'
  | 'complete'
  // legacy aliases kept for existing callers
  | 'learn_complete'
  | 'quiz_success'
  | 'quiz_fail'
  | 'quiz_retry_success';

const FX_SOURCES: Record<FxEvent, any> = {
  tap: require('../../assets/fx/tap.mp3'),

  // correct answer
  success: require('../../assets/fx/success.mp3'),
  quiz_success: require('../../assets/fx/success.mp3'),
  quiz_retry_success: require('../../assets/fx/success.mp3'),

  // wrong answer
  error: require('../../assets/fx/error.mp3'),

  // quiz end fail (gentle)
  fail: require('../../assets/fx/fail.mp3'),
  quiz_fail: require('../../assets/fx/fail.mp3'),

  // end-of-unit success
  complete: require('../../assets/fx/complete.mp3'),
  learn_complete: require('../../assets/fx/complete.mp3'),
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

// ---- overlap protection / serialization ----
let queue: Promise<void> = Promise.resolve();
let lastTapAt = 0;

/** Stop any currently playing FX immediately (used before navigation). */
export function stopAllFx(): void {
  queue = queue
    .then(() => stopAllPlaying())
    .catch(() => {
      // ignore
    });
}

/** Preload all FX so the first play has no delay. */
export async function preloadFx(): Promise<void> {
  try {
    // Object.keys returns string[], so we narrow to the exact keys of FX_SOURCES.
    const events = Object.keys(FX_SOURCES) as Array<keyof typeof FX_SOURCES>;
    await Promise.all(events.map((e) => getSound(e)));
  } catch {
    // ignore
  }
}


async function stopAllPlaying(): Promise<void> {
  await Promise.all(
    [...cache.values()].map(async (s) => {
      try {
        const status = await s.getStatusAsync();
        if ((status as any)?.isLoaded && (status as any)?.isPlaying) {
          await s.stopAsync();
        }
      } catch {
        // ignore
      }
    })
  );
}

async function playInternal(event: FxEvent): Promise<void> {
  const { fxEnabled } = getAudioSettings();
  if (!fxEnabled) return;

  // don't mix tap FX with spoken word
  if (event === 'tap' && isTtsActive()) return;

  // throttle tap spam (double clicks etc.)
  if (event === 'tap') {
    const now = Date.now();
    if (now - lastTapAt < 250) return;
    lastTapAt = now;
  }

  const sound = await getSound(event);
  if (!sound) return;

  // serialize + prevent overlap
  await stopAllPlaying();
  await sound.setPositionAsync(0);

  // Softer tap; keep others stronger
  const volume = event === 'tap' ? 0.28 : 0.7;
  await sound.setVolumeAsync(volume);

  await sound.playAsync();
}

/** Fire-and-forget */
export function playFx(event: FxEvent): void {
  queue = queue
    .then(() => playInternal(event))
    .catch(() => {
      // ignore
    });
}

/** Awaitable (use for Next button so the card advances AFTER tap finishes) */
export function playFxAndWait(event: FxEvent): Promise<void> {
  queue = queue
    .then(() => playInternal(event))
    .catch(() => {
      // ignore
    });
  return queue;
}

export async function unloadAllFx(): Promise<void> {
  const sounds = [...cache.values()];
  cache.clear();

  await Promise.all(
    sounds.map(async (s) => {
      try {
        await s.unloadAsync();
      } catch {
        // ignore
      }
    })
  );
}
