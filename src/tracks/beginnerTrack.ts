// src/tracks/beginnerTrack.ts
import type { ContentItem, UnitPolicyMeta } from '../content/types';
import { isBeginnerBridgePack, listBuiltInPacks } from '../content/registry';
import { bridgePackToBeginnerTrack } from '../content/adapters/beginnerTrackAdapter';

/**
 * Beginner Track v2
 * -----------------
 * יש "נושאים" (Groups) ובתוכם "יחידות" (Units).
 */

export type UnitGroupId = string;
export type UnitId = string;

export type UnitStatus = 'locked' | 'learn' | 'quiz' | 'completed';

export type UnitGroupDef = {
  id: UnitGroupId;

  /** legacy/fallback */
  title: string;

  /** ✅ i18n (optional) */
  titleKey?: string;

  emoji: string;

  /** legacy/fallback */
  description?: string;

  /** ✅ i18n (optional) */
  descriptionKey?: string;

  prereqGroupIds?: UnitGroupId[];
};

export type UnitDef = {
  id: UnitId;
  groupId: UnitGroupId;

  /** V7: optional layer gating metadata */
  policy?: UnitPolicyMeta;

  /** legacy/fallback */
  title: string;

  /** ✅ i18n (optional) */
  titleKey?: string;

  prereqUnitIds: UnitId[];
  itemIds: string[];
};

/** ✅ Progress per unit */
export type UnitProgress = {
  unitId: UnitId;

  /** Learn */
  seenItemIds: string[];
  masteredItemIds: string[];

  /** Quiz */
  lastQuizScore?: number; // 0..100
  bestQuizScore?: number; // 0..100

  /** dateId (YYYY-MM-DD) of the current attempts counter */
  attemptsDateId?: string;

  /** attempts count for that date */
  attemptsToday?: number; // 0..3

  /** which itemIds were answered wrong today (for practice) */
  failedItemIdsToday?: string[];
};

export type TrackProgress = {
  units: Record<UnitId, UnitProgress>;
};

export const QUIZ_PASS_SCORE = 80;

export const BEGINNER_GROUPS: UnitGroupDef[] = [
  {
    id: 'numbers',
    title: 'Numbers',
    titleKey: 'beginner.group.numbers.title',
    emoji: '🔢',
    description: 'Learn to say and recognize numbers (sound → symbol).',
    descriptionKey: 'beginner.group.numbers.desc',
  },
  {
    id: 'letters',
    title: 'Letters',
    titleKey: 'beginner.group.letters.title',
    emoji: '🔤',
    description: 'Learn to recognize letters (sound → symbol).',
    descriptionKey: 'beginner.group.letters.desc',
  },
];

export const BEGINNER_UNITS: UnitDef[] = [];

/**
 * Bridge: Content Packs -> beginnerTrack (opt-in)
 * -----------------------------------------------
 * מחבר Packs מתוך src/content/registry למסלול Beginner, בלי לשנות את Learn Flow.
 *
 * ✅ NOTE:
 * adapter uses pack.groups -> beginner units (one unit per group)
 */
(function wireBridgedPacksIntoBeginnerTrack() {
  const packs = listBuiltInPacks().filter(isBeginnerBridgePack);

  for (const p of packs) {
    const bridged = bridgePackToBeginnerTrack(p);

    // Group (topic per pack)
    if (!BEGINNER_GROUPS.some((g) => g.id === bridged.group.id)) {
      BEGINNER_GROUPS.push(bridged.group);
    }

    // Units (one per pack.group)
    for (const u of bridged.units) {
      if (!BEGINNER_UNITS.some((x) => x.id === u.id)) {
        BEGINNER_UNITS.push(u);
      }
    }
  }
})();

// ------------------------------------------------------------
// ✅ Cross-pack gating for bridged packs
// If you finish pack A, pack B unlocks (based on registry order).
// Works with multi-group packs (colors_basics -> colors_neutrals, etc.).
// ------------------------------------------------------------
(function chainBridgedPacks() {
  const packs = listBuiltInPacks().filter(isBeginnerBridgePack);

  let prevLastUnitId: UnitId | null = null;

  for (const p of packs) {
    const gs = (p.groups ?? []).map((g) => g.id);
    const effectiveGroupIds = gs.length > 0 ? gs : [p.id];

    const firstUnitId = effectiveGroupIds[0];
    const lastUnitId = effectiveGroupIds[effectiveGroupIds.length - 1];

    if (prevLastUnitId) {
      const firstUnit = BEGINNER_UNITS.find((u) => u.id === firstUnitId);
      if (firstUnit) {
        // Only add if not already present (preserve in-pack prereqs)
        if (!firstUnit.prereqUnitIds.includes(prevLastUnitId)) {
          firstUnit.prereqUnitIds = [prevLastUnitId, ...firstUnit.prereqUnitIds];
        }
      }
    }

    prevLastUnitId = lastUnitId;
  }
})();

// ------------------------------------------------------------
// ✅ Group ordering (source of truth)
// Order = bridged packs in registry order, then built-in groups
// ------------------------------------------------------------
(function orderBeginnerGroups() {
  const bridgedPackIds = listBuiltInPacks()
    .filter(isBeginnerBridgePack)
    .map((p) => p.id);

  // built-in groups should come after core packs
  const tailGroupIds: UnitGroupId[] = ['numbers', 'letters'];

  const orderedIds = [...bridgedPackIds, ...tailGroupIds];

  const idx = new Map<string, number>();
  orderedIds.forEach((id, i) => idx.set(id, i));

  BEGINNER_GROUPS.sort((a, b) => {
    const ai = idx.get(a.id) ?? 9999;
    const bi = idx.get(b.id) ?? 9999;
    return ai - bi;
  });
})();

export function getUnitsByGroup(groupId: UnitGroupId): UnitDef[] {
  return BEGINNER_UNITS.filter((u) => u.groupId === groupId);
}

export function makeEmptyBeginnerProgress(): TrackProgress {
  const units = {} as Record<UnitId, UnitProgress>;
  for (const u of BEGINNER_UNITS) {
    units[u.id] = {
      unitId: u.id,
      seenItemIds: [],
      masteredItemIds: [],
      lastQuizScore: undefined,
      bestQuizScore: undefined,
      attemptsDateId: undefined,
      attemptsToday: 0,
      failedItemIdsToday: [],
    };
  }
  return { units };
}

export function getUnitStatus(
  unit: UnitDef,
  progress: TrackProgress
): {
  status: UnitStatus;
  seenCount: number;
  totalCount: number;
  bestQuizScore?: number;
} {
  const totalCount = unit.itemIds.length;

  for (const preId of unit.prereqUnitIds) {
    const preUnit = BEGINNER_UNITS.find((x) => x.id === preId);
    const preProg = progress.units[preId];

    const preTotal = preUnit?.itemIds.length ?? 0;
    const preSeenAll = (preProg?.seenItemIds?.length ?? 0) >= preTotal;
    const prePassed = (preProg?.bestQuizScore ?? 0) >= QUIZ_PASS_SCORE;

    if (!(preSeenAll && prePassed)) {
      return {
        status: 'locked',
        seenCount: 0,
        totalCount,
        bestQuizScore: progress.units[unit.id]?.bestQuizScore,
      };
    }
  }

  const up = progress.units[unit.id];
  const seenCount = up?.seenItemIds?.length ?? 0;
  const bestQuizScore = up?.bestQuizScore;

  if (seenCount < totalCount) {
    return { status: 'learn', seenCount, totalCount, bestQuizScore };
  }

  if ((bestQuizScore ?? 0) >= QUIZ_PASS_SCORE) {
    return { status: 'completed', seenCount, totalCount, bestQuizScore };
  }

  return { status: 'quiz', seenCount, totalCount, bestQuizScore };
}

export function resolveUnitItems(
  unit: UnitDef,
  catalog: ContentItem[]
): ContentItem[] {
  const byId = new Map(catalog.map((it) => [it.id, it]));
  return unit.itemIds
    .map((id) => byId.get(id))
    .filter(Boolean) as ContentItem[];
}
