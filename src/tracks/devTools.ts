// src/tracks/devTools.ts
import {
  BEGINNER_UNITS,
  QUIZ_PASS_SCORE,
  type TrackProgress,
} from './beginnerTrack';

function getDateIdLocal(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * DEV helper:
 * Mark ALL beginner units as completed:
 * - seenItemIds = all items
 * - masteredItemIds = all items
 * - bestQuizScore = 100 (>= pass)
 */
export function makeDevMaxBeginnerProgress(): TrackProgress {
  const today = getDateIdLocal();

  const units: TrackProgress['units'] = {};
  for (const u of BEGINNER_UNITS) {
    const all = [...u.itemIds];
    units[u.id] = {
      unitId: u.id,
      seenItemIds: all,
      masteredItemIds: all,
      lastQuizScore: 100,
      bestQuizScore: Math.max(100, QUIZ_PASS_SCORE),
      attemptsDateId: today,
      attemptsToday: 0,
      failedItemIdsToday: [],
    };
  }

  return { units };
}
