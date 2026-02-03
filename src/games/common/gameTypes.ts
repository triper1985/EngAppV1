// src/games/common/gameTypes.ts
export type GameItem = {
  id: string;

  /** Text shown to the child (already localized). */
  label: string;

  /** Text to speak (already localized). If omitted we speak `label`. */
  ttsText?: string;

  /** Visual id used by itemVisualRegistry (e.g. 'apple', 'dog'). */
  visualId?: string;
};

export type GameMode = 'word-to-image' | 'sound-to-image';
