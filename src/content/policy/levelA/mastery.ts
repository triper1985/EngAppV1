// src/content/policy/levelA/mastery.ts
import type { ChildProfile } from '../../../types';
import type { ContentPack, LevelLayer, LevelTag } from '../../types';

export type MasteryThresholds = {
  /** Ratio of items the child has at least *seen* in Learn */
  minSeenRatio: number;
  /** Ratio of items the child has *mastered* (when available) */
  minMasteredRatio: number;
  /** Best quiz score threshold (0–100). Optional because some packs may not use quiz yet. */
  minBestQuizScore?: number;
};

export type PackMasterySnapshot = {
  packId: string;
  seenRatio: number;
  masteredRatio: number;
  bestQuizScore: number;
  isMastered: boolean;
};

export type LayerMasterySnapshot = {
  levelTag: LevelTag;
  layer: LevelLayer;
  requiredPackIds: string[];
  packs: PackMasterySnapshot[];
  isCompleted: boolean;
};

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function safeRatio(num: number, den: number): number {
  if (!den || den <= 0) return 0;
  return clamp01(num / den);
}

/**
 * Layer thresholds are intentionally simple and conservative.
 * We can tune these later without changing any stored data.
 */
export function getThresholdsForLayer(layer: LevelLayer): MasteryThresholds {
  // Layer 0: very light “onboarding” – we want kids to exit this quickly.
  if (layer === 0) return { minSeenRatio: 0.25, minMasteredRatio: 0.15 };

  // Layer 1: foundations – “seen enough” is usually enough.
  if (layer === 1) return { minSeenRatio: 0.5, minMasteredRatio: 0.3 };

  // Layer 2: vocabulary expansion
  if (layer === 2)
    return { minSeenRatio: 0.7, minMasteredRatio: 0.6, minBestQuizScore: 60 };

  // Layer 3: letter↔sound begins
  if (layer === 3)
    return { minSeenRatio: 0.75, minMasteredRatio: 0.7, minBestQuizScore: 70 };

  // Layer 4: early recognition / sight words
  return { minSeenRatio: 0.8, minMasteredRatio: 0.75, minBestQuizScore: 80 };
}

function getUnitProgress(child: ChildProfile, unitId: string) {
  const p = child.beginnerProgress;
  const u = p?.units?.[unitId];
  if (!u) return null;
  return u;
}

/**
 * Computes mastery for a pack using its groups (which are bridged into beginner units).
 * If a pack has no groups, it falls back to using the packId as a unitId.
 */
export function getPackMastery(
  child: ChildProfile,
  pack: ContentPack,
  thresholds: MasteryThresholds
): PackMasterySnapshot {
  const groups = pack.groups?.length
    ? pack.groups
    : [{ id: pack.id, itemIds: pack.items.map((x) => x.id) } as any];

  let totalItems = 0;
  let seenItems = 0;
  let masteredItems = 0;
  let bestQuizScore = 0;

  for (const g of groups) {
    const unitId = g.id;
    const total = g.itemIds?.length ?? 0;
    totalItems += total;

    const up = getUnitProgress(child, unitId);
    if (!up) continue;

    const seen = up.seenItemIds?.length ?? 0;
    const mastered = (up.masteredItemIds?.length ?? 0) || 0;

    // Some flows might not fill masteredItemIds yet.
    // When it's empty, we treat “seen” as the best proxy.
    const effectiveMastered = mastered > 0 ? mastered : seen;

    seenItems += Math.min(seen, total);
    masteredItems += Math.min(effectiveMastered, total);

    bestQuizScore = Math.max(bestQuizScore, up.bestQuizScore ?? 0);
  }

  const seenRatio = safeRatio(seenItems, totalItems);
  const masteredRatio = safeRatio(masteredItems, totalItems);

  const quizOk =
    typeof thresholds.minBestQuizScore === 'number'
      ? bestQuizScore >= thresholds.minBestQuizScore
      : true;

  const isMastered =
    seenRatio >= thresholds.minSeenRatio &&
    masteredRatio >= thresholds.minMasteredRatio &&
    quizOk;

  return {
    packId: pack.id,
    seenRatio,
    masteredRatio,
    bestQuizScore,
    isMastered,
  };
}

/**
 * Computes whether a layer is completed for Level A.
 * By default we only require CORE packs for progression.
 */
export function getLayerMasterySnapshot(args: {
  child: ChildProfile;
  levelTag: LevelTag;
  layer: LevelLayer;
  requiredPacks: ContentPack[];
}): LayerMasterySnapshot {
  const { child, levelTag, layer, requiredPacks } = args;
  const thresholds = getThresholdsForLayer(layer);

  const packs = requiredPacks.map((p) => getPackMastery(child, p, thresholds));
  const isCompleted = packs.every((p) => p.isMastered);

  return {
    levelTag,
    layer,
    requiredPackIds: requiredPacks.map((p) => p.id),
    packs,
    isCompleted,
  };
}
