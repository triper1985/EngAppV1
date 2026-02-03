// src/games/common/gamePool.ts
import type { ChildProfile } from '../../types';
import type { ContentItem, ContentPackId } from '../../content/types';
import { getBeginnerProgress } from '../../tracks/beginnerProgress';
import { BEGINNER_UNITS, getUnitStatus } from '../../tracks/beginnerTrack';
import { getVocabularyForChild } from '../../content/selectors';
import { getItemVisualImage } from '../../visuals/itemVisualRegistry';
import { getPackById, isInterestPack } from '../../content/registry';
import type { GameItem } from './gameTypes';

export type GameId = 'listen_choose' | 'memory_pairs' | 'tap_match' | 'phonics_match';

const RECENT_LIMIT = 20;

/** Title-case a simple english word/phrase ("dog" -> "Dog") */
function titleCase(s: string): string {
  const t = (s ?? '').trim();
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function getRecentIds(child: ChildProfile, gameId: GameId): string[] {
  const rec = (child as any).gameRecents?.[gameId];
  return Array.isArray(rec) ? (rec as string[]) : [];
}

export function updateRecentIds(
  child: ChildProfile,
  gameId: GameId,
  usedIds: string[]
): ChildProfile {
  const prev = getRecentIds(child, gameId);
  const next = [...prev];

  for (const id of usedIds) {
    if (!id) continue;
    const idx = next.indexOf(id);
    if (idx >= 0) next.splice(idx, 1);
    next.unshift(id);
  }

  const trimmed = next.slice(0, RECENT_LIMIT);

  return {
    ...child,
    gameRecents: {
      ...((child as any).gameRecents ?? {}),
      [gameId]: trimmed,
    },
  } as any;
}

/** Game pool inclusion rules, based on Kobi's spec */
function isUnitEligibleForGames(args: {
  child: ChildProfile;
  unitId: string;
  packId: ContentPackId;
  minLayer: number;
}): boolean {
  const { child, packId, minLayer } = args;

  const pack = getPackById(packId as any);

  // Interest packs: only if selected by parent (and then completion decides)
  if (pack && isInterestPack(pack)) {
    const selected = (child.selectedPackIds ?? []) as string[];
    return selected.includes(packId as any);
  }

  // Core packs:
  // Layer 0-2: all eligible (visual filter is applied later)
  if (minLayer <= 2) return true;

  // Layer 3: exclude everything from games (letters/numbers/etc)
  if (minLayer === 3) return false;

  // Layer 4: include only specific packs/units
  // ✅ include: shapes, emotions, symbols
  if (packId === 'l4_shape_circle') return true;
  if (packId === 'l4_emotion_happy') return true;
  if (packId === 'l4_symbol_check') return true;

  // ✅ directions: only basics (up/down/left/right). Diagonals excluded.
  if (packId === 'l4_dir_up') return args.unitId === 'l4_directions_basic';

  // ❌ exclude: spatial relations, patterns, early recognition
  if (packId === 'l4_spatial_in') return false;
  if (packId === 'l4_pattern_ab') return false;
  if (packId === 'dir_up') return false; // earlyRecognitionPack id

  // default: conservative
  return false;
}

/**
 * Build the game pool from what the child has COMPLETED.
 *
 * Rules:
 * - completed unit (seen all + quiz pass) contributes its items
 * - Interest packs only contribute if selected by parent
 * - Layer 3 contributes nothing
 * - Layer 4 contributes only: Shapes, Emotions, Symbols, and Directions (basic only)
 * - only items with a real visual IMAGE (image in registry) are eligible
 * - items must have english text
 */
export function getGamePoolItems(child: ChildProfile): GameItem[] {
  const prog = getBeginnerProgress(child);
  const vocab = getVocabularyForChild(child);
  const byId = new Map<string, ContentItem>(vocab.map((it) => [it.id, it]));

  const contributedItemIds: string[] = [];

  for (const u of BEGINNER_UNITS) {
    const status = getUnitStatus(u, prog).status;
    if (status !== 'completed') continue;

    const packId = u.groupId as any as ContentPackId;
    const minLayer = (u.policy?.minLayer as number | undefined) ?? 0;

    // per-unit explicit opt-out
    if (u.policy?.gamePoolContribution === false) continue;

    if (!isUnitEligibleForGames({ child, unitId: u.id, packId, minLayer })) continue;

    contributedItemIds.push(...u.itemIds);
  }

  if (contributedItemIds.length === 0) return [];

  const items: GameItem[] = [];
  for (const id of contributedItemIds) {
    const it = byId.get(id);
    if (!it) continue;

    const en = (it.en ?? '').trim();
    if (!en) continue;

    // ✅ visuals: require image asset (keeps games fun + avoids text-only packs)
    if (!getItemVisualImage(it.id)) continue;

    items.push({
      id: it.id,
      label: titleCase(en),
      ttsText: titleCase(en),
      visualId: it.id,
    });
  }

  // dedupe by id
  const map = new Map<string, GameItem>();
  for (const gi of items) map.set(gi.id, gi);
  return Array.from(map.values());
}

/**
 * Pick `count` distinct items, preferring to avoid recently used ids for this game.
 */
export function pickRandomItemsForGame(args: {
  child: ChildProfile;
  gameId: GameId;
  pool: GameItem[];
  count: number;
}): { picked: GameItem[]; usedIds: string[] } {
  const { child, gameId, pool, count } = args;
  if (!pool.length) return { picked: [], usedIds: [] };

  const recent = new Set(getRecentIds(child, gameId));
  const fresh = pool.filter((x) => !recent.has(x.id));
  const source = fresh.length >= count ? fresh : pool;

  // shuffle
  const a = [...source];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  const picked = a.slice(0, Math.min(count, a.length));
  return { picked, usedIds: picked.map((x) => x.id) };
}
