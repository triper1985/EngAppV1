// src/content/policy/levelA/gameGating.ts

import type { LevelLayer, LevelTag } from '../../types';

/**
 * V7 (Level A): Game gating by layer.
 *
 * Note:
 * - Currently GamesHubScreen is placeholder and doesn't consume this yet.
 * - This file is a single source of truth for "which game families are allowed" per layer.
 */
export type GameType =
  | 'tap_match' // tap the correct visual
  | 'listen_choose' // listen -> choose from visuals
  | 'memory_pairs' // simple memory game
  | 'odd_one_out' // pick the item that doesn't belong
  | 'phonics_match' // letter↔sound matching
  | 'sight_word_flash'; // sight word recognition (visual only)

export function getAllowedGameTypesForLevelLayer(
  levelTag: LevelTag,
  layer: LevelLayer
): readonly GameType[] {
  // For now, we only define Level A; other levels can plug in later.
  if (levelTag !== 'A') return [];

  // Planned Level A layers (0–4):
  // 0: Orientation + Emotions
  // 1: Listening & Sounds
  // 2: Core Vocabulary + Interest pool
  // 3: Letter↔Sound (gentle)
  // 4: Early recognition (Sight words; no free writing)

  if (layer <= 0) {
    return ['tap_match', 'listen_choose'];
  }

  if (layer === 1) {
    return ['tap_match', 'listen_choose', 'memory_pairs'];
  }

  if (layer === 2) {
    return ['tap_match', 'listen_choose', 'memory_pairs', 'odd_one_out'];
  }

  if (layer === 3) {
    return [
      'tap_match',
      'listen_choose',
      'memory_pairs',
      'odd_one_out',
      'phonics_match',
    ];
  }

  // layer >= 4
  return [
    'tap_match',
    'listen_choose',
    'memory_pairs',
    'odd_one_out',
    'phonics_match',
    'sight_word_flash',
  ];
}
