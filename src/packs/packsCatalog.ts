// src/packs/packsCatalog.ts
/**
 * Packs catalog (Beginner Learn Flow)
 * ----------------------------------
 * IMPORTANT:
 * - Learn/Quiz/Practice screens use ContentItem from src/content/types.
 * - Games engine uses legacy types in src/schema.ts.
 *
 * This file intentionally exposes *only* V2 content items for learning.
 */

import { basicPack } from './basicPack';

import type { ContentItem as LegacyItem } from '../schema';
import { listBuiltInPacks } from '../content/registry';
import type { ContentItem, ContentPack } from '../content/types';

/**
 * V10 Product Policy (Beginner):
 * - Core packs must always be available in Learn Flow (even if not selected):
 *   basic + numbers + letters (+ colors if you want it core)
 * - Interest packs are opt-in via child.selectedPackIds
 * - Some packs can be hidden from selection/UI (animals etc.)
 */
export const REQUIRED_PACK_IDS = new Set<string>([
  'basic',
  'numbers',
  'letters',
  'colors',
  'listening',
  'foundations',
  // ✅ core vocab pack (bridged into beginner track)
  'animals',
]);

// Packs can be hidden from the *selection UI* later, but they must still be
// available to the Learn/Quiz/Practice flows if they exist in beginnerTrack.
// (So we no longer filter them out of the learning catalog.)
export const HIDDEN_PACK_IDS = new Set<string>([]);

export type PackDef = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  items: ContentItem[];
  required?: boolean;
};

function legacyItemToContentItem(it: LegacyItem): ContentItem {
  // Legacy items are already “audioText + display”.
  // We map them into V2 ContentItem so Learn Flow can use a single type.
  return {
    id: it.id,
    en: it.audioText,
    he: it.assist?.hebrewHint,
    visual: { kind: 'text', he: it.display.value },
    tags: [],
  };
}

function contentPackToPackDef(p: ContentPack): PackDef {
  return {
    id: p.id,
    title: p.title,
    emoji: p.emoji ?? '📦',
    description: p.description ?? '',
    items: p.items,
    required: REQUIRED_PACK_IDS.has(p.id),
  };
}

// -------------------------
// Catalog
// -------------------------
const BUILT_IN_CONTENT_PACKS: PackDef[] = listBuiltInPacks()
  .map(contentPackToPackDef);

export const packsCatalog: PackDef[] = [
  {
    id: 'basic',
    title: 'Basic',
    emoji: '📘',
    description: 'Core beginner words (offline).',
    items: basicPack.items.map(legacyItemToContentItem),
    required: true,
  },
  ...BUILT_IN_CONTENT_PACKS,
];

export function getItemsForPackIds(packIds: string[]): ContentItem[] {
  const ids = new Set(packIds);
  const items = packsCatalog
    .filter((p) => ids.has(p.id))
    .flatMap((p) => p.items);

  // de-dup by id
  const map = new Map(items.map((it) => [it.id, it]));
  return Array.from(map.values());
}

export function ensureRequiredSelected(packIds?: string[]) {
  const set = new Set(packIds ?? []);
  for (const id of REQUIRED_PACK_IDS) set.add(id);
  return Array.from(set.values());
}
