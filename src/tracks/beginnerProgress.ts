// src/tracks/beginnerProgress.ts
import type { ChildProfile } from '../types';
import type { TrackProgress, UnitId } from './beginnerTrack';
import { makeEmptyBeginnerProgress } from './beginnerTrack';

function getDateIdLocal(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function ensureUnit(prog: TrackProgress, unitId: UnitId) {
  const up = prog.units[unitId];
  if (up) return up;

  // fallback safety
  prog.units[unitId] = {
    unitId,
    seenItemIds: [],
    masteredItemIds: [],
    attemptsToday: 0,
    failedItemIdsToday: [],
  } as any;
  return prog.units[unitId];
}

export function getBeginnerProgress(child: ChildProfile): TrackProgress {
  const bp = child.beginnerProgress;
  if (bp && (bp as any).units) return bp as TrackProgress;
  return makeEmptyBeginnerProgress();
}

export function setBestQuizScore(
  child: ChildProfile,
  unitId: UnitId,
  score: number
): ChildProfile {
  const prog = getBeginnerProgress(child);
  const up = ensureUnit(prog, unitId);

  const best = Math.max(up.bestQuizScore ?? 0, score);

  const nextProg: TrackProgress = {
    ...prog,
    units: {
      ...prog.units,
      [unitId]: {
        ...up,
        lastQuizScore: score,
        bestQuizScore: best,
      },
    },
  };

  return {
    ...child,
    beginnerProgress: nextProg as any,
  };
}

export function getQuizAttemptsToday(
  child: ChildProfile,
  unitId: UnitId
): number {
  const prog = getBeginnerProgress(child);
  const up = ensureUnit(prog, unitId);

  const today = getDateIdLocal();
  if (up.attemptsDateId !== today) return 0;
  return up.attemptsToday ?? 0;
}

export function isQuizLockedToday(
  child: ChildProfile,
  unitId: UnitId
): boolean {
  return getQuizAttemptsToday(child, unitId) >= 3;
}

export function getFailedIdsToday(
  child: ChildProfile,
  unitId: UnitId
): string[] {
  const prog = getBeginnerProgress(child);
  const up = ensureUnit(prog, unitId);

  const today = getDateIdLocal();
  if (up.attemptsDateId !== today) return [];
  return up.failedItemIdsToday ?? [];
}

// ✅ unlock quiz for today (parent override)
export function parentUnlockQuizToday(
  child: ChildProfile,
  unitId: UnitId
): ChildProfile {
  const next = structuredClone(child) as ChildProfile;

  const prog = (next as any).beginnerProgress;
  if (!prog?.units?.[unitId]) return next;

  const u = prog.units[unitId];

  // remove "locked today" state + reset attempts today
  u.quizLockedDate = undefined;
  u.quizAttempts = undefined;
  u.failedIdsToday = [];
  u.failedDate = undefined;

  return next;
}

// ✅ parent reset attempts only (keep failed ids if you want)
export function parentResetQuizAttemptsToday(
  child: ChildProfile,
  unitId: UnitId
): ChildProfile {
  const next = structuredClone(child) as ChildProfile;

  const prog = (next as any).beginnerProgress;
  if (!prog?.units?.[unitId]) return next;

  const u = prog.units[unitId];
  u.quizLockedDate = undefined;
  u.quizAttempts = undefined;

  return next;
}

/**
 * Record a failed quiz attempt:
 * - increments attemptsToday for today
 * - stores failed itemIds for practice
 */
export function recordQuizFailAttempt(
  child: ChildProfile,
  unitId: UnitId,
  failedItemIds: string[]
): ChildProfile {
  const prog = getBeginnerProgress(child);
  const up = ensureUnit(prog, unitId);

  const today = getDateIdLocal();
  const prevAttempts = up.attemptsDateId === today ? up.attemptsToday ?? 0 : 0;
  const nextAttempts = Math.min(3, prevAttempts + 1);

  const prevFailed =
    up.attemptsDateId === today ? up.failedItemIdsToday ?? [] : [];
  const merged = new Set<string>([...prevFailed, ...failedItemIds]);

  const nextProg: TrackProgress = {
    ...prog,
    units: {
      ...prog.units,
      [unitId]: {
        ...up,
        attemptsDateId: today,
        attemptsToday: nextAttempts,
        failedItemIdsToday: Array.from(merged.values()),
      },
    },
  };

  return { ...child, beginnerProgress: nextProg as any };
}

/**
 * On PASS:
 * - reset attempts today to 0
 * - clear failed ids today
 */
export function resetQuizDailyStateOnPass(
  child: ChildProfile,
  unitId: UnitId
): ChildProfile {
  const prog = getBeginnerProgress(child);
  const up = ensureUnit(prog, unitId);

  const today = getDateIdLocal();

  const nextProg: TrackProgress = {
    ...prog,
    units: {
      ...prog.units,
      [unitId]: {
        ...up,
        attemptsDateId: today,
        attemptsToday: 0,
        failedItemIdsToday: [],
      },
    },
  };

  return { ...child, beginnerProgress: nextProg as any };
}
