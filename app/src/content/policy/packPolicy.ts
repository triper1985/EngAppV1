// src/content/policy/packPolicy.ts
import type { ChildProfile } from '../../types';
import type { ContentPack } from '../types';

/**
 * Pack Policy (Opt-in)
 * --------------------
 * תשתית חוקים טהורה (pure functions) לבחירת Packs עבור ילד:
 * - Eligible packs לפי levelId (סקלבילי לרמות)
 * - Normalize: enabled / favorite / active כך שתמיד יהיו תקינים מול packs registry
 *
 * בלי UI, בלי תלות ב־LearnFlow, בלי כתיבה ל-storage.
 */

export type PackSelection = {
  eligiblePackIds: string[];
  enabledPackIds: string[];
  favoritePackIds: string[];
  activePackId: string | null;
};

type LevelRank = 0 | 1 | 2;

function levelRank(levelId: ChildProfile['levelId'] | undefined): LevelRank {
  switch (levelId) {
    case 'hero':
      return 2;
    case 'explorer':
      return 1;
    case 'beginner':
    default:
      return 0;
  }
}

function packMinRank(pack: ContentPack): LevelRank {
  // pack.meta.levelId הוא "מינימום" מומלץ לתוכן (אופציונלי)
  const lvl = pack.meta?.levelId;
  if (lvl === 'hero') return 2;
  if (lvl === 'explorer') return 1;
  // default: beginner / undefined
  return 0;
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function intersect(a: string[], allowedSet: Set<string>): string[] {
  return a.filter((x) => allowedSet.has(x));
}

export function getEligiblePacksForChild(
  child: ChildProfile,
  packs: readonly ContentPack[]
): ContentPack[] {
  const childRank = levelRank(child.levelId);
  return packs.filter((p) => packMinRank(p) <= childRank);
}

/**
 * מחשב בחירה תקינה (enabled/favorite/active) מול packs registry.
 * לא משנה את הילד בפועל.
 */
export function computePackSelection(
  child: ChildProfile,
  packs: readonly ContentPack[]
): PackSelection {
  const eligible = getEligiblePacksForChild(child, packs);
  const eligibleIds = eligible.map((p) => p.id);
  const eligibleSet = new Set<string>(eligibleIds);

  // enabled: child.selectedPackIds ∩ eligible (עם fallback)
  const rawEnabled = Array.isArray(child.selectedPackIds)
    ? child.selectedPackIds
    : [];

  let enabled = unique(intersect(rawEnabled, eligibleSet));

  // fallback: אם אין enabled, בחר ראשון eligible
  if (enabled.length === 0) {
    enabled = eligibleIds.length > 0 ? [eligibleIds[0]] : [];
  }

  // favorite: subset של enabled
  const rawFav = Array.isArray((child as any).favoritePackIds)
    ? ((child as any).favoritePackIds as string[])
    : [];
  const enabledSet = new Set(enabled);
  const favorites = unique(rawFav.filter((id) => enabledSet.has(id)));

  // active: חייב להיות בתוך enabled
  const rawActive =
    typeof (child as any).activePackId === 'string'
      ? ((child as any).activePackId as string)
      : null;

  const active =
    rawActive && enabledSet.has(rawActive) ? rawActive : enabled[0] ?? null;

  return {
    eligiblePackIds: eligibleIds,
    enabledPackIds: enabled,
    favoritePackIds: favorites,
    activePackId: active,
  };
}

/**
 * מחזיר ChildProfile "מיושר" עם בחירה תקינה.
 * שימושי ל־migration/cleanup, אבל לא חובה לחבר כרגע.
 */
export function normalizeChildPackSelection(
  child: ChildProfile,
  packs: readonly ContentPack[]
): ChildProfile {
  const sel = computePackSelection(child, packs);

  return {
    ...child,
    selectedPackIds: sel.enabledPackIds,
    favoritePackIds: sel.favoritePackIds,
    activePackId: sel.activePackId ?? undefined,
  } as ChildProfile;
}
