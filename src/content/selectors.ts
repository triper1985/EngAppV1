// src/content/selectors.ts
import type { ChildProfile } from '../types';
import type {
  ContentItem,
  ContentPack,
  ContentPackId,
  LevelLayer,
  LevelTag,
} from './types';

import {
  listCorePacks,
  listBuiltInPacks,
  isInterestPack,
  getPackById,
} from './registry';

/** Dedupe items by id */
function uniqItems(items: ContentItem[]): ContentItem[] {
  const map = new Map<string, ContentItem>();
  for (const it of items) map.set(it.id, it);
  return Array.from(map.values());
}

/** Core vocabulary is always included */
export function getCoreVocabulary(): ContentItem[] {
  return uniqItems(listCorePacks().flatMap((p) => p.items));
}

/**
 * Interest vocabulary = only packs selected by parent for this child
 * (and only if they are interest packs)
 */
export function getInterestVocabularyForChild(
  child: ChildProfile
): ContentItem[] {
  const selected = (child.selectedPackIds ?? []) as string[];

  const items: ContentItem[] = [];

  for (const id of selected) {
    const p = getPackById(id as ContentPackId);
    if (!p) continue;
    if (!isInterestPack(p)) continue; // ignore core/unknown here
    items.push(...p.items);
  }

  return uniqItems(items);
}

/**
 * ✅ Single source of truth: vocabulary available to a child right now
 * = core + selected interest
 */
export function getVocabularyForChild(child: ChildProfile): ContentItem[] {
  return uniqItems([
    ...getCoreVocabulary(),
    ...getInterestVocabularyForChild(child),
  ]);
}

/**
 * Helper: visible interest packs (available for selection)
 * (useful for Parent UI; not required by Learn flow)
 */
export function listSelectableInterestPacks() {
  return listBuiltInPacks().filter((p) => isInterestPack(p));
}

/** V7: list packs filtered by level tag */
export function listPacksForLevel(levelTag: LevelTag): ContentPack[] {
  return listBuiltInPacks().filter(
    (p) => (p.policy?.levelTag ?? ('A' as LevelTag)) === levelTag
  );
}

/** V7: list packs available up to a given layer (minLayer <= layer) */
export function listPacksUpToLayer(
  levelTag: LevelTag,
  layer: LevelLayer
): ContentPack[] {
  return listPacksForLevel(levelTag).filter(
    (p) => (p.policy?.minLayer ?? 0) <= layer
  );
}

/** V7: list interest packs unlocked up to a given layer */
export function listInterestPacksUpToLayer(
  levelTag: LevelTag,
  layer: LevelLayer
): ContentPack[] {
  return listPacksUpToLayer(levelTag, layer).filter((p) => isInterestPack(p));
}
