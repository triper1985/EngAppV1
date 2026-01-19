// src/audio/settings.ts

import {
  loadAudioSettings,
  saveAudioSettings,
} from '../storage/audioSettingsStore';

import type { ChildProfile } from '../types';

export type TTSSpeed = 'slow' | 'normal';
export type VoiceId = string;

export type AudioSettings = {
  ttsEnabled: boolean;
  ttsSpeed: TTSSpeed;
  voiceId?: VoiceId; // if unset, auto-pick by language
  fxEnabled: boolean;
};

const DEFAULT_SETTINGS: AudioSettings = {
  ttsEnabled: true,
  ttsSpeed: 'slow',
  voiceId: undefined,
  fxEnabled: true,
};

let settings: AudioSettings = loadAudioSettings({ ...DEFAULT_SETTINGS });

export function getAudioSettings(): AudioSettings {
  return { ...settings };
}

export function setAudioSettings(patch: Partial<AudioSettings>): AudioSettings {
  settings = { ...settings, ...patch };
  saveAudioSettings(settings);
  return getAudioSettings();
}

/**
 * ✅ V11.4
 * Compute the effective settings for a specific child.
 * - If child has no audioProfile or mode='global' => use global parent settings
 * - If mode='override' => merge global + child.override
 */
export function getEffectiveAudioSettings(
  child?: ChildProfile | null
): AudioSettings {
  const global = getAudioSettings();
  const ap = child?.audioProfile;
  if (!ap || ap.mode === 'global') return global;
  return { ...global, ...(ap.override ?? {}) };
}

/**
 * Mapping to concrete synthesis parameters.
 * V10 used: rate=0.65, pitch=1.2 (kid-friendly).
 */
export function getTtsRate(speed: TTSSpeed): number {
  return speed === 'slow' ? 0.65 : 0.85;
}

export function getTtsPitch(): number {
  return 1.2;
}
