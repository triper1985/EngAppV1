// src/screens/learn/learnNavigationA.ts
import type { ChildProfile } from '../../types';

import {
  BEGINNER_GROUPS,
  getUnitsByGroup,
  getUnitStatus,
  type UnitGroupDef,
  type UnitGroupId,
} from '../../tracks/beginnerTrack';
import { getBeginnerProgress } from '../../tracks/beginnerProgress';

import { getPackById } from '../../content/registry';
import { getUnlockedLayerSnapshotA } from '../../content/policy/levelA/unlock';

export type LayerCardVM = {
  layerId: number;
  isLocked: boolean;
  isCurrent: boolean;
  isDone: boolean;
  progressPct: number;
};

export type GroupCardVM = {
  group: UnitGroupDef;
  groupId: UnitGroupId;
  requiredLayer: number;

  isLocked: boolean;
  isDone: boolean;
  isCurrentLayer: boolean;

  completed: number;
  total: number;
  progressPct: number;

  lockedSuffixKey?: string;
  lockedSuffixVars?: Record<string, string>;
};

function clampPct(x: number) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}

function getRequiredLayerForGroup(g: UnitGroupDef): number {
  const pack = getPackById(g.id as any);
  return (pack?.policy?.minLayer as number | undefined) ?? 0;
}

function summarizeGroup(child: ChildProfile, groupId: UnitGroupId) {
  const prog = getBeginnerProgress(child);
  const units = getUnitsByGroup(groupId);

  if (units.length === 0) {
    return { total: 0, completed: 0, anyOpen: false } as const;
  }

  let completed = 0;
  let anyOpen = false;

  for (const u of units) {
    const s = getUnitStatus(u, prog).status; // 'locked' | 'learn' | 'quiz' | 'completed'
    if (s === 'completed') completed++;
    if (s !== 'locked') anyOpen = true;
  }

  return { total: units.length, completed, anyOpen } as const;
}

function calcLayerProgressPct(child: ChildProfile, layerId: number) {
  const groupsInLayer = BEGINNER_GROUPS.filter(
    (g) => getRequiredLayerForGroup(g) === layerId
  );
  if (groupsInLayer.length === 0) return 0;

  let sumPct = 0;
  for (const g of groupsInLayer) {
    const s = summarizeGroup(child, g.id);
    const pct = s.total === 0 ? 0 : (s.completed / s.total) * 100;
    sumPct += pct;
  }
  return clampPct(sumPct / groupsInLayer.length);
}

export function getLearnHomeVM_A(args: {
  child: ChildProfile;
  maxLayer?: number; // default 4
}) {
  const { child, maxLayer = 4 } = args;
  const { unlockedLayer } = getUnlockedLayerSnapshotA(child, 'A');
  const unlocked = unlockedLayer as number;

  const layers: LayerCardVM[] = [];
  for (let layerId = 0; layerId <= maxLayer; layerId += 1) {
    layers.push({
      layerId,
      isLocked: unlocked < layerId,
      isCurrent: unlocked === layerId,
      isDone: unlocked > layerId,
      progressPct: calcLayerProgressPct(child, layerId),
    });
  }

  return {
    unlockedLayer: unlocked,
    layers,
  };
}

/**
 * Layer 3 pedagogical order:
 * - letters
 * - numbers
 * - letter_words
 *
 * Only affects layerId === 3.
 * All other layers keep their original BEGINNER_GROUPS idx order.
 */
const LAYER3_GROUP_ORDER: Record<string, number> = {
  letters: 10,
  numbers: 20,
  letter_words: 30,
};

export function getLearnLayerVM_A(args: {
  child: ChildProfile;
  layerId: number;
}) {
  const { child, layerId } = args;
  const { unlockedLayer } = getUnlockedLayerSnapshotA(child, 'A');
  const unlocked = unlockedLayer as number;

  const groupsInLayer = BEGINNER_GROUPS.map((g, idx) => {
    const requiredLayer = getRequiredLayerForGroup(g);
    return { g, idx, requiredLayer };
  })
    .filter((x) => x.requiredLayer === layerId)
    .sort((a, b) => {
      // ✅ Special sort only for Layer 3
      if (layerId === 3) {
        const ao = LAYER3_GROUP_ORDER[a.g.id] ?? 999;
        const bo = LAYER3_GROUP_ORDER[b.g.id] ?? 999;
        if (ao !== bo) return ao - bo;
        // fallback stable ordering
        return a.idx - b.idx;
      }

      // default: keep original order
      return a.idx - b.idx;
    });

  const groupVMs: GroupCardVM[] = groupsInLayer.map(({ g, requiredLayer }) => {
    const s = summarizeGroup(child, g.id);

    const lockedByLayer = unlocked < requiredLayer;
    const lockedByPrereq = s.total > 0 ? !s.anyOpen : true; // אם אין יחידות בכלל -> "נעול" בפועל (אין מה להיכנס)
    const isLocked = lockedByLayer || lockedByPrereq;

    const isDone = s.total > 0 && s.completed === s.total;
    const isCurrentLayer = unlocked === requiredLayer;

    let lockedSuffixKey: string | undefined;
    let lockedSuffixVars: Record<string, string> | undefined;

    if (lockedByLayer) {
      lockedSuffixKey = 'learn.groups.locked.layer';
      lockedSuffixVars = { layer: String(requiredLayer) };
    } else if (lockedByPrereq) {
      lockedSuffixKey =
        s.total === 0
          ? 'learn.groups.locked.noUnits'
          : 'learn.groups.locked.prereq';
    }

    const progressPct =
      s.total === 0 ? 0 : clampPct((s.completed / s.total) * 100);

    return {
      group: g,
      groupId: g.id,
      requiredLayer,
      isLocked,
      isDone,
      isCurrentLayer,
      completed: s.completed,
      total: s.total,
      progressPct,
      lockedSuffixKey,
      lockedSuffixVars,
    };
  });

  return {
    unlockedLayer: unlocked,
    layerId,
    groups: groupVMs,
    hasAnyGroups: groupVMs.length > 0,
  };
}
