// src/audio/index.ts

export type { TTSSpeed, VoiceId, AudioSettings } from './settings';
export { getAudioSettings, setAudioSettings, getEffectiveAudioSettings } from './settings';

export type { SpeakContext, SpeakItemLike } from './tts';
export {
  speakText,
  speakHebrewText,
  speakItem,
  speakContentItem,
  speakItemOnce,
  stopTTS,
} from './tts';

export type { FxEvent } from './fx';
export {
  playFx,
  playFxAndWait,
  stopAllFx,
  preloadFx,
  notifyTtsStart,
  notifyTtsStop,
  unloadAllFx,
} from './fx';

export { resetOnceScope } from './once';
