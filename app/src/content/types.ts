// src/content/types.ts
/**
 * V2 Content Foundation – Types
 * -----------------------------
 * מטרת הקובץ: להגדיר חוזה תוכן סקלבילי.
 *
 * עקרון חשוב:
 * Beginner = הילד לא קורא אנגלית => תשובות Quiz חייבות להיות חזותיות (color/image),
 * וניתן fallback בעברית בלבד ברמה הזו.
 */

export type LanguageTag = 'he' | 'en' | (string & {});
export type ContentPackId = string;
export type ContentGroupId = string;
export type UnitId = string;
export type ContentItemId = string;

export type UnitKind =
  | 'learn'
  | 'quiz'
  | 'practice'; /** V7: Pack classification */
export type PackType = 'core' | 'interest';

/** V7: Level tag (currently only 'A' in this project) */
export type LevelTag = 'A' | (string & {});

/** V7: Layer within a level (0–4 planned for Level A) */
export type LevelLayer = 0 | 1 | 2 | 3 | 4 | (number & {});

/** V7: Skill tags to help gating/recommendations (optional, non-breaking) */
export type SkillTag =
  | 'orientation'
  | 'emotions'
  | 'listening'
  | 'vocab'
  | 'phonics'
  | 'recognition'
  | 'sightWords';

export interface PackPolicyMeta {
  packType: PackType;
  levelTag: LevelTag;
  minLayer: LevelLayer;
  maxLayer?: LevelLayer;

  /** Optional free-form tags for search/filters */
  tags?: string[];
}

export interface UnitPolicyMeta {
  levelTag: LevelTag;
  minLayer: LevelLayer;
  maxLayer?: LevelLayer;

  skills?: SkillTag[];

  /** Whether learned items from this unit should feed the games pool */
  gamePoolContribution?: boolean;
}

/**
 * V7: Optional policy override at the PackGroup level.
 *
 * Why:
 * - Some packs want different layer requirements per sub-group/unit
 *   (e.g. "Numbers 1–10" at layer 2, "Tens" at layer 3).
 * - We keep this separate from UnitDef.policy because the bridge can
 *   generate beginnerTrack units from PackGroups.
 */
export interface PackGroupPolicyMeta {
  minLayer: LevelLayer;
  maxLayer?: LevelLayer;
  skills?: SkillTag[];
  gamePoolContribution?: boolean;
}

/** איך מציגים תשובה בלי קריאה */
export type VisualSpec =
  | { kind: 'color'; hex: string } // e.g. "#FFD400"
  | { kind: 'image'; assetId: string } // asset lookup later
  | { kind: 'text'; he: string }; // fallback (beginner only)

export interface ContentItem {
  id: ContentItemId;

  /** מה אומרים/משמיעים לילד באנגלית ("yellow") */
  en: string;

  /** תמיכה בעברית (Beginner fallback) */
  he?: string;

  /** איך מציגים את האופציה בתשובות (לא טקסט אנגלי) */
  visual: VisualSpec;

  /** Meta אופציונלי */
  tags?: string[];
}

export interface ContentMeta {
  minAge?: number;
  maxAge?: number;
  levelId?: string; // "beginner" וכו' (policy-driven בעתיד)
  languages?: LanguageTag[];
  tags?: string[];
}

export interface UnitPrereq {
  requiresUnitIds?: UnitId[];
  minCoins?: number;
}

/**
 * יחידה:
 * - ב-V2 רצוי unit יפנה ל-groupId (כי group מחזיק את ה-items).
 * - השארנו itemIds כ-legacy/escape hatch כדי לא לשבור PoC קודם.
 */
export interface UnitDef {
  id: UnitId;
  title: string;
  titleKey?: string;
  kind: UnitKind;

  /** V7: level/layer metadata for gating (optional, non-breaking) */
  policy?: UnitPolicyMeta;

  /** V2: יחידה על קבוצה */
  groupId?: ContentGroupId;

  /** Legacy/escape hatch: יחידה מחזיקה items ישירות */
  itemIds?: ContentItemId[];

  prereq?: UnitPrereq;
  meta?: ContentMeta;
}

/** קבוצה בתוך Pack (כמו Numbers 1–10) */
export interface PackGroup {
  id: ContentGroupId;
  title: string;
  titleKey?: string;

  /** V7: optional layer override for the bridged unit */
  policy?: PackGroupPolicyMeta;

  /** items ששייכים לקבוצה */
  itemIds: ContentItemId[];

  meta?: ContentMeta;
}

export interface PackRelations {
  iconId?: string;
  favoriteable?: boolean;
  themeId?: string;
  reward?: { onCompleteCoins?: number };
}

export interface ContentPack {
  id: ContentPackId;
  title: string;
  titleKey?: string;

  emoji?: string;
  description?: string;
  descriptionKey?: string;

  /** V7: pack classification + level/layer metadata (optional, non-breaking) */
  policy?: PackPolicyMeta;

  meta?: ContentMeta;
  relations?: PackRelations;

  /** קטלוג items של ה-Pack */
  items: ContentItem[];

  /** קבוצות קטנות בתוך ה-Pack */
  groups: PackGroup[];

  /** learn/quiz/practice units שמפנות לקבוצות */
  units: UnitDef[];
}
