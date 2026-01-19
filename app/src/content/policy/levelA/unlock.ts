// src/content/policy/levelA/unlock.ts
import type { ChildProfile } from '../../../types';
import type { ContentPack, LevelLayer, LevelTag } from '../../types';
import { inferCurrentLayer } from './recommendation';

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

/**
 * Derived "what is currently unlocked" snapshot for Level A.
 * In DEV on web, you can override via localStorage key:
 *   localStorage.setItem('dev.levelA.unlockedLayer', '4')
 *
 * On React Native, this override is disabled (no localStorage).
 */
export function getUnlockedLayerSnapshotA(
  child: ChildProfile,
  levelTag: LevelTag = 'A'
): UnlockSnapshot {
  const dev = getDevUnlockedLayer();
  if (dev !== null) {
    return { levelTag, unlockedLayer: dev };
  }

  return {
    levelTag,
    unlockedLayer: inferCurrentLayer(child, levelTag),
  };
}

export function isPackUnlockedForChildA(
  child: ChildProfile,
  pack: ContentPack,
  levelTag: LevelTag = 'A'
): { unlocked: boolean; requiredLayer: LevelLayer } {
  const requiredLayer = (pack.policy?.minLayer ?? 0) as LevelLayer;

  const dev = getDevUnlockedLayer();
  const unlockedLayer = dev !== null ? dev : inferCurrentLayer(child, levelTag);

  return {
    requiredLayer,
    unlocked: unlockedLayer >= requiredLayer,
  };
}
