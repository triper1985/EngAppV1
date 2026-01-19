// src/storage/audioSettingsStore.ts
import type { AudioSettings } from '../audio/settings';

const LS_KEY = 'english_audio_settings_v1';

type Store = {
  version: 1;
  settings: AudioSettings;
};

export function loadAudioSettings(defaults: AudioSettings): AudioSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw) as Partial<Store> | null;
    if (!parsed || parsed.version !== 1 || !parsed.settings) return defaults;

    // Merge defensively so we can add fields later without breaking old saves
    return { ...defaults, ...parsed.settings };
  } catch {
    return defaults;
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  try {
    const payload: Store = { version: 1, settings };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    // ignore (quota / private mode)
  }
}
