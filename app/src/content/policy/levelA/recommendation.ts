// src/content/policy/levelA/recommendation.ts
import type { ChildProfile } from '../../../types';
import type { ContentPack, LevelLayer, LevelTag } from '../../types';
import { listPacksForLevel, listPacksUpToLayer } from '../../selectors';
import { getLayerMasterySnapshot } from './mastery';

export type LevelRecommendation = {
  levelTag: LevelTag;
  currentLayer: LevelLayer;
  suggestedNextLayer: LevelLayer | null;
  /** Human readable explanation for parent UI (no i18n yet) */
  reason: string;
  /** When not ready, which packs to focus on */
  focusPackIds?: string[];
};

function clampLayer(n: number): LevelLayer {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  return 4;
}

function getCorePacksUpToLayer(
  levelTag: LevelTag,
  layer: LevelLayer
): ContentPack[] {
  const packs = listPacksUpToLayer(levelTag, layer);
  return packs.filter((p) => p.policy?.packType === 'core');
}

function getCorePacksForLayer(
  levelTag: LevelTag,
  layer: LevelLayer
): ContentPack[] {
  const packs = listPacksForLevel(levelTag);
  return packs.filter(
    (p) => p.policy?.packType === 'core' && (p.policy?.minLayer ?? 0) === layer
  );
}

/**
 * Infers the current completed layer from progress.
 * This does NOT store anything; it is a derived snapshot.
 */
export function inferCurrentLayer(
  child: ChildProfile,
  levelTag: LevelTag = 'A'
): LevelLayer {
  let current: LevelLayer = 0;

  for (let l = 0; l <= 4; l++) {
    const layer = clampLayer(l);
    const required = getCorePacksUpToLayer(levelTag, layer);
    if (required.length === 0) {
      current = layer;
      continue;
    }

    const snap = getLayerMasterySnapshot({
      child,
      levelTag,
      layer,
      requiredPacks: required,
    });

    if (snap.isCompleted) current = layer;
    else break;
  }

  return current;
}

export function getLevelARecommendation(
  child: ChildProfile
): LevelRecommendation {
  const levelTag: LevelTag = 'A';
  const currentLayer = inferCurrentLayer(child, levelTag);

  if (currentLayer >= 4) {
    return {
      levelTag,
      currentLayer,
      suggestedNextLayer: null,
      reason: 'Great job — Level A is complete (layers 0–4).',
    };
  }

  const nextLayer = clampLayer((currentLayer as number) + 1);

  // Are we ready to move past currentLayer? (i.e. complete all core packs up to current)
  const requiredNow = getCorePacksUpToLayer(levelTag, currentLayer);
  const snap = getLayerMasterySnapshot({
    child,
    levelTag,
    layer: currentLayer,
    requiredPacks: requiredNow,
  });

  if (snap.isCompleted) {
    const entering = getCorePacksForLayer(levelTag, nextLayer);
    const hint = entering.length
      ? `Next focus: ${entering.map((p) => p.title).join(', ')}.`
      : 'Next focus: new content will unlock gradually.';

    return {
      levelTag,
      currentLayer,
      suggestedNextLayer: nextLayer,
      reason: `Child is ready to move to layer ${nextLayer}. ${hint}`,
    };
  }

  // Not ready: focus on the weakest packs
  const sorted = [...snap.packs].sort((a, b) => {
    const aScore = a.masteredRatio * 0.7 + a.seenRatio * 0.3;
    const bScore = b.masteredRatio * 0.7 + b.seenRatio * 0.3;
    return aScore - bScore;
  });

  const focusPackIds = sorted.slice(0, 2).map((x) => x.packId);
  return {
    levelTag,
    currentLayer,
    suggestedNextLayer: null,
    focusPackIds,
    reason: `Keep practicing core packs in layer ${currentLayer} before moving on.`,
  };
}
