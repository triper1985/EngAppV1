// src/rewards/coins.ts
import type { ChildProfile } from '../types';
import type { UnitId } from '../tracks/beginnerTrack';

/**
 * Coin Economy (Beginner v1)
 * -------------------------
 * Goal: first icon purchase within ~1 day of normal use.
 *
 * We intentionally reward on session completion (not per-question),
 * and keep repeat rewards lower to avoid farming.
 */

export type GameSessionResult = {
  /** true if the child completed with no mistakes (or you define "perfect" per game). */
  perfect?: boolean;
};

// --- Unit rewards ---

export function coinsRewardForUnitLearn(_child: ChildProfile) {
  return 5;
}

export function coinsRewardForUnitPractice(_child: ChildProfile, opts?: { perfect?: boolean }) {
  return opts?.perfect ? 6 : 4;
}

/**
 * Quiz pass reward depends on whether this is the first ever pass for the unit.
 * The caller should decide "firstPass" using its own unit progress/best score.
 */
export function coinsRewardForQuizPass(_child: ChildProfile, opts: { firstPass: boolean }) {
  return opts.firstPass ? 10 : 5;
}

// --- Game rewards ---

export function coinsRewardForGameSession(_child: ChildProfile, result?: GameSessionResult) {
  return result?.perfect ? 5 : 3;
}

// --- Backward-compatible exports (older screens) ---
// Keep these so older code compiles if it still imports them.
// Prefer using the new functions above in new code.

export function coinsBonusForUnitLearn(child: ChildProfile) {
  return coinsRewardForUnitLearn(child);
}

export function coinsBonusForQuizPass(child: ChildProfile) {
  // old API had no "firstPass" info; treat as repeat/small reward
  return coinsRewardForQuizPass(child, { firstPass: false });
}
