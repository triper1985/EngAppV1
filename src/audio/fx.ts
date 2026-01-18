// src/audio/fx.ts

import { getAudioSettings } from './settings';

export type FxEvent = 'tap' | 'success' | 'error' | 'complete';

/**
 * V11.1: we start with a stub.
 * Later we can back this with:
 * - new Audio('/assets/fx/success.mp3')
 * - or expo-av (if you move to native)
 */
export function playFx(_event: FxEvent): void {
  const { fxEnabled } = getAudioSettings();
  if (!fxEnabled) return;

  // no-op for now
  // (keeping the API lets us wire screens now without committing to assets yet)
}
