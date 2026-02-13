// src/content/policy/levelA/unlock.ts
import type { ChildProfile } from '../../../types';
import type { ContentPack, LevelLayer, LevelTag } from '../../types';
import {
  BEGINNER_GROUPS,
  getUnitsByGroup,
  getUnitStatus,
} from '../../../tracks/beginnerTrack';
import { getBeginnerProgress } from '../../../tracks/beginnerProgress';
import { getPackById } from '../../registry';

export type UnlockSnapshot = {
  levelTag: LevelTag;
  unlockedLayer: LevelLayer;
};

const DEV_UNLOCK_KEY = 'dev.levelA.unlockedLayer';

function clampLayer(n: number): LevelLayer {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  return 4;
}

function getDevUnlockedLayer(): LevelLayer | null {
  // React Native / Expo dev flag (Hermes-safe)
  if (!__DEV__) return null;

  // localStorage exists only on web
  const ls: Storage | undefined = (globalThis as any)?.localStorage;
  if (!ls) return null;

  const raw = ls.getItem(DEV_UNLOCK_KEY);
  if (!raw) return null;

  const n = Number(raw);
  if (!Number.isFinite(n)) return null;

  return clampLayer(n);
}

function computeUnlockedLayer(child: ChildProfile, levelTag: LevelTag): LevelLayer {
  // Primary (deterministic) rule:
  // A layer is "completed" when ALL its groups' units are "completed"
  // according to beginnerTrack (seen all + passed quiz).
  // This matches what the Learn UI considers "done".

  const prog = getBeginnerProgress(child);

  function getRequiredLayerForGroup(groupId: string): LevelLayer {
    // IMPORTANT: must match Learn UI logic (learnNavigationA.ts)
    // which uses the pack policy minLayer (not per-unit policy).
    const pack = getPackById(groupId as any);
    return clampLayer((pack?.policy?.minLayer as number | undefined) ?? 0);
  }

  function isGroupCompleted(groupId: string): boolean {
    const units = getUnitsByGroup(groupId);
    if (units.length === 0) return false;
    return units.every((u) => getUnitStatus(u, prog).status === 'completed');
  }

  let highestCompleted = -1;

  for (let l = 0; l <= 4; l++) {
    const layer = clampLayer(l);
    const groupsInLayer = BEGINNER_GROUPS.filter((g) => {
      // ✅ Unlocking is based on CORE curriculum only.
      // Interest packs are optional and must not block progression.
      const pack = getPackById(g.id as any);
      if (pack && pack.policy?.packType && pack.policy.packType !== 'core') return false;
      return getRequiredLayerForGroup(g.id) === layer;
    });
      console.log('DEBUG LAYER CHECK', {
        layer,
        groups: groupsInLayer.map(g => g.id),
      });
    // If a layer has no groups at all, treat it as completed.
    if (groupsInLayer.length === 0) {
      highestCompleted = layer;
      continue;
    }

    const done = groupsInLayer.every((g) =>  {
  const completed = isGroupCompleted(g.id);
  console.log('GROUP STATUS', {
    layer,
    group: g.id,
    completed,
  });
  return completed;
});
    if (done) highestCompleted = layer;
    else break;
  }

  return clampLayer(Math.max(0, highestCompleted + 1));
}

/**
 * Derived "what is currently unlocked" snapshot for Level A.
 * In DEV on web, you can override via localStorage key:
 *   localStorage.setItem('dev.levelA.unlockedLayer', '4')
 */
export function getUnlockedLayerSnapshotA(
  child: ChildProfile,
  levelTag: LevelTag = 'A'
): UnlockSnapshot {
  const dev = getDevUnlockedLayer();
  if (dev !== null) return { levelTag, unlockedLayer: dev };

  return { levelTag, unlockedLayer: computeUnlockedLayer(child, levelTag) };
}

export function isPackUnlockedForChildA(
  child: ChildProfile,
  pack: ContentPack,
  levelTag: LevelTag = 'A'
): { unlocked: boolean; requiredLayer: LevelLayer } {
  const requiredLayer = (pack.policy?.minLayer ?? 0) as LevelLayer;

  const dev = getDevUnlockedLayer();
  const unlockedLayer = dev !== null ? dev : computeUnlockedLayer(child, levelTag);

  return {
    requiredLayer,
    unlocked: unlockedLayer >= requiredLayer,
  };
}
