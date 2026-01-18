// src/content/validate.ts
import type {
  ContentPack,
  ContentPackId,
  ContentItem,
  ContentItemId,
  PackGroup,
  UnitDef,
  UnitId,
  VisualSpec,
} from './types';

import { listBuiltInPacks } from './registry';

export type ValidationLevel = 'error' | 'warn';

export type ValidationIssue = {
  level: ValidationLevel;
  code: string;
  message: string;
  packId?: ContentPackId;
  unitId?: UnitId;
  path?: string;
};

export type ValidateOptions = {
  /** Hook אופציונלי לקטלוג חיצוני (אם יש). */
  itemExists?: (itemId: string) => boolean;

  disallowDuplicateItemIdsInGroup?: boolean;
  disallowDuplicateItemIdsInUnitLegacy?: boolean;
};

const DEFAULT_OPTS: Required<
  Pick<
    ValidateOptions,
    'disallowDuplicateItemIdsInGroup' | 'disallowDuplicateItemIdsInUnitLegacy'
  >
> = {
  disallowDuplicateItemIdsInGroup: true,
  disallowDuplicateItemIdsInUnitLegacy: true,
};

function issue(
  level: ValidationLevel,
  code: string,
  message: string,
  extras?: Omit<ValidationIssue, 'level' | 'code' | 'message'>
): ValidationIssue {
  return { level, code, message, ...extras };
}

function nonEmptyStr(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0;
}

function isHexColor(s: string): boolean {
  // allow #RGB or #RRGGBB
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s);
}

function validateVisual(
  visual: VisualSpec,
  packId?: string,
  itemId?: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (visual.kind === 'color') {
    if (!nonEmptyStr(visual.hex) || !isHexColor(visual.hex)) {
      issues.push(
        issue(
          'error',
          'ITEM_VISUAL_COLOR_INVALID',
          `Item visual.color hex "${String(
            visual.hex
          )}" is invalid. Expected "#RGB" or "#RRGGBB".`,
          { packId, path: `items[${itemId}].visual.hex` }
        )
      );
    }
  } else if (visual.kind === 'image') {
    if (!nonEmptyStr(visual.assetId)) {
      issues.push(
        issue(
          'error',
          'ITEM_VISUAL_IMAGE_ASSETID_EMPTY',
          'Item visual.image.assetId must be a non-empty string.',
          { packId, path: `items[${itemId}].visual.assetId` }
        )
      );
    }
  } else if (visual.kind === 'text') {
    if (!nonEmptyStr(visual.he)) {
      issues.push(
        issue(
          'error',
          'ITEM_VISUAL_TEXT_HE_EMPTY',
          'Item visual.text.he must be a non-empty string.',
          { packId, path: `items[${itemId}].visual.he` }
        )
      );
    }
  } else {
    issues.push(
      issue('error', 'ITEM_VISUAL_KIND_UNKNOWN', `Unknown visual kind.`, {
        packId,
        path: `items[${itemId}].visual`,
      })
    );
  }
  return issues;
}

export function validateItem(
  item: ContentItem,
  packCtx: { packId: ContentPackId; itemIdSet: Set<ContentItemId> }
): ValidationIssue[] {
  const { packId, itemIdSet } = packCtx;
  const issues: ValidationIssue[] = [];

  if (!nonEmptyStr(item.id)) {
    issues.push(
      issue('error', 'ITEM_ID_EMPTY', 'Item id must be a non-empty string.', {
        packId,
        path: `items[].id`,
      })
    );
  } else if (itemIdSet.has(item.id)) {
    issues.push(
      issue(
        'error',
        'ITEM_ID_DUPLICATE',
        `Duplicate item id "${item.id}" within the same pack.`,
        { packId, path: `items[${item.id}].id` }
      )
    );
  } else {
    itemIdSet.add(item.id);
  }

  if (!nonEmptyStr(item.en)) {
    issues.push(
      issue(
        'error',
        'ITEM_EN_EMPTY',
        'Item.en must be a non-empty string (the spoken English word).',
        { packId, path: `items[${item.id}].en` }
      )
    );
  }

  issues.push(...validateVisual(item.visual, packId, item.id));

  return issues;
}

export function validateGroup(
  group: PackGroup,
  packCtx: {
    packId: ContentPackId;
    itemIdSet: Set<ContentItemId>;
    groupIdSet: Set<string>;
  },
  opts?: ValidateOptions
): ValidationIssue[] {
  const o = { ...DEFAULT_OPTS, ...(opts ?? {}) };
  const { packId, itemIdSet, groupIdSet } = packCtx;
  const issues: ValidationIssue[] = [];

  if (!nonEmptyStr(group.id)) {
    issues.push(
      issue('error', 'GROUP_ID_EMPTY', 'Group id must be a non-empty string.', {
        packId,
        path: `groups[].id`,
      })
    );
  } else if (groupIdSet.has(group.id)) {
    issues.push(
      issue(
        'error',
        'GROUP_ID_DUPLICATE',
        `Duplicate group id "${group.id}" within the same pack.`,
        { packId, path: `groups[${group.id}].id` }
      )
    );
  } else {
    groupIdSet.add(group.id);
  }

  if (!nonEmptyStr(group.title)) {
    issues.push(
      issue('error', 'GROUP_TITLE_EMPTY', 'Group title must be non-empty.', {
        packId,
        path: `groups[${group.id}].title`,
      })
    );
  }

  if (!Array.isArray(group.itemIds) || group.itemIds.length === 0) {
    issues.push(
      issue(
        'warn',
        'GROUP_ITEMIDS_EMPTY',
        'Group has no itemIds. Learn/Quiz may be empty.',
        { packId, path: `groups[${group.id}].itemIds` }
      )
    );
    return issues;
  }

  // existence check: group items must exist in pack.items
  for (let i = 0; i < group.itemIds.length; i++) {
    const id = group.itemIds[i];
    if (!nonEmptyStr(id)) {
      issues.push(
        issue('error', 'GROUP_ITEMID_EMPTY', 'Group contains empty itemId.', {
          packId,
          path: `groups[${group.id}].itemIds[${i}]`,
        })
      );
      continue;
    }
    if (!itemIdSet.has(id)) {
      issues.push(
        issue(
          'error',
          'GROUP_ITEMID_NOT_IN_PACK',
          `Group references itemId "${id}" but it does not exist in pack.items.`,
          { packId, path: `groups[${group.id}].itemIds` }
        )
      );
    }
  }

  if (o.disallowDuplicateItemIdsInGroup) {
    const seen = new Set<string>();
    const dups = new Set<string>();
    for (const id of group.itemIds) {
      if (seen.has(id)) dups.add(id);
      seen.add(id);
    }
    if (dups.size > 0) {
      issues.push(
        issue(
          'warn',
          'GROUP_ITEMIDS_DUPLICATE',
          `Group has duplicate itemIds: ${Array.from(dups).join(', ')}`,
          { packId, path: `groups[${group.id}].itemIds` }
        )
      );
    }
  }

  return issues;
}

export function validateUnit(
  unit: UnitDef,
  packCtx: {
    packId: ContentPackId;
    groupIdSet: Set<string>;
    itemIdSet: Set<ContentItemId>;
  },
  opts?: ValidateOptions
): ValidationIssue[] {
  const o = { ...DEFAULT_OPTS, ...(opts ?? {}) };
  const { packId, groupIdSet, itemIdSet } = packCtx;

  const issues: ValidationIssue[] = [];

  if (!nonEmptyStr(unit.id)) {
    issues.push(
      issue('error', 'UNIT_ID_EMPTY', 'Unit id must be a non-empty string.', {
        packId,
        path: `units[].id`,
      })
    );
  }

  if (!nonEmptyStr(unit.title)) {
    issues.push(
      issue(
        'error',
        'UNIT_TITLE_EMPTY',
        'Unit title must be a non-empty string.',
        {
          packId,
          unitId: unit.id,
          path: `units[${unit.id}].title`,
        }
      )
    );
  }

  if (!['learn', 'quiz', 'practice'].includes(unit.kind)) {
    issues.push(
      issue(
        'error',
        'UNIT_KIND_INVALID',
        `Unit kind "${String(
          unit.kind
        )}" is invalid. Expected: learn | quiz | practice.`,
        { packId, unitId: unit.id, path: `units[${unit.id}].kind` }
      )
    );
  }

  const hasGroupId = nonEmptyStr(unit.groupId);
  const hasLegacyItems = Array.isArray(unit.itemIds) && unit.itemIds.length > 0;

  if (!hasGroupId && !hasLegacyItems) {
    issues.push(
      issue(
        'error',
        'UNIT_TARGET_MISSING',
        'Unit must have either groupId (V2) or itemIds (legacy).',
        { packId, unitId: unit.id, path: `units[${unit.id}]` }
      )
    );
  }

  if (hasGroupId && hasLegacyItems) {
    issues.push(
      issue(
        'warn',
        'UNIT_TARGET_BOTH',
        'Unit has both groupId and legacy itemIds. Prefer groupId only.',
        { packId, unitId: unit.id, path: `units[${unit.id}]` }
      )
    );
  }

  if (hasGroupId && unit.groupId && !groupIdSet.has(unit.groupId)) {
    issues.push(
      issue(
        'error',
        'UNIT_GROUP_NOT_FOUND',
        `Unit references groupId "${unit.groupId}" but it does not exist in pack.groups.`,
        { packId, unitId: unit.id, path: `units[${unit.id}].groupId` }
      )
    );
  }

  // legacy itemIds validation (if used)
  if (hasLegacyItems && unit.itemIds) {
    for (let i = 0; i < unit.itemIds.length; i++) {
      const id = unit.itemIds[i];
      if (!nonEmptyStr(id)) {
        issues.push(
          issue('error', 'UNIT_ITEMID_EMPTY', 'Unit has empty itemId.', {
            packId,
            unitId: unit.id,
            path: `units[${unit.id}].itemIds[${i}]`,
          })
        );
        continue;
      }
      if (!itemIdSet.has(id)) {
        issues.push(
          issue(
            'warn',
            'UNIT_ITEMID_NOT_IN_PACK',
            `Legacy unit references itemId "${id}" not found in pack.items.`,
            { packId, unitId: unit.id, path: `units[${unit.id}].itemIds` }
          )
        );
      }
      if (opts?.itemExists && !opts.itemExists(id)) {
        issues.push(
          issue(
            'warn',
            'UNIT_ITEMID_UNKNOWN_IN_CATALOG',
            `itemId "${id}" not found in provided item catalog.`,
            { packId, unitId: unit.id, path: `units[${unit.id}].itemIds` }
          )
        );
      }
    }

    if (o.disallowDuplicateItemIdsInUnitLegacy) {
      const seen = new Set<string>();
      const dups = new Set<string>();
      for (const id of unit.itemIds) {
        if (seen.has(id)) dups.add(id);
        seen.add(id);
      }
      if (dups.size > 0) {
        issues.push(
          issue(
            'warn',
            'UNIT_ITEMIDS_DUPLICATE',
            `Legacy unit has duplicate itemIds: ${Array.from(dups).join(', ')}`,
            { packId, unitId: unit.id, path: `units[${unit.id}].itemIds` }
          )
        );
      }
    }
  }

  // prereq validation
  const prereq = unit.prereq;
  if (prereq?.requiresUnitIds) {
    for (let i = 0; i < prereq.requiresUnitIds.length; i++) {
      const req = prereq.requiresUnitIds[i];
      if (!nonEmptyStr(req)) {
        issues.push(
          issue(
            'error',
            'UNIT_PREREQ_EMPTY',
            'prereq.requiresUnitIds contains an empty value.',
            {
              packId,
              unitId: unit.id,
              path: `units[${unit.id}].prereq.requiresUnitIds[${i}]`,
            }
          )
        );
      }
    }
  }
  if (typeof prereq?.minCoins === 'number' && prereq.minCoins < 0) {
    issues.push(
      issue(
        'error',
        'UNIT_PREREQ_MINCOINS_NEGATIVE',
        'prereq.minCoins must be >= 0.',
        { packId, unitId: unit.id, path: `units[${unit.id}].prereq.minCoins` }
      )
    );
  }

  return issues;
}

export function validatePack(
  pack: ContentPack,
  opts?: ValidateOptions
): ValidationIssue[] {
  const packId = pack.id;
  const issues: ValidationIssue[] = [];

  if (!nonEmptyStr(pack.id)) {
    issues.push(
      issue('error', 'PACK_ID_EMPTY', 'Pack id must be a non-empty string.', {
        path: `pack.id`,
      })
    );
  }
  if (!nonEmptyStr(pack.title)) {
    issues.push(
      issue(
        'error',
        'PACK_TITLE_EMPTY',
        'Pack title must be a non-empty string.',
        { packId, path: `pack.title` }
      )
    );
  }

  if (!Array.isArray(pack.items) || pack.items.length === 0) {
    issues.push(
      issue(
        'warn',
        'PACK_ITEMS_EMPTY',
        'Pack has no items. It cannot power Learn/Quiz.',
        { packId, path: `pack.items` }
      )
    );
  }

  const itemIdSet = new Set<ContentItemId>();
  for (const it of pack.items ?? []) {
    issues.push(...validateItem(it, { packId: pack.id, itemIdSet }));
  }

  const groupIdSet = new Set<string>();
  if (!Array.isArray(pack.groups) || pack.groups.length === 0) {
    issues.push(
      issue(
        'warn',
        'PACK_GROUPS_EMPTY',
        'Pack has no groups. V2 expects groups like "1-10".',
        { packId, path: `pack.groups` }
      )
    );
  } else {
    for (const g of pack.groups) {
      issues.push(
        ...validateGroup(g, { packId: pack.id, itemIdSet, groupIdSet }, opts)
      );
    }
  }

  if (!Array.isArray(pack.units) || pack.units.length === 0) {
    issues.push(
      issue(
        'warn',
        'PACK_UNITS_EMPTY',
        'Pack has no units (learn/quiz/practice).',
        { packId, path: `pack.units` }
      )
    );
    return issues;
  }

  // unique unit ids
  const unitIdSet = new Set<UnitId>();
  const dupUnitIds = new Set<UnitId>();
  for (const u of pack.units) {
    if (unitIdSet.has(u.id)) dupUnitIds.add(u.id);
    unitIdSet.add(u.id);
  }
  if (dupUnitIds.size > 0) {
    issues.push(
      issue(
        'error',
        'PACK_UNIT_IDS_DUPLICATE',
        `Pack contains duplicate unit ids: ${Array.from(dupUnitIds).join(
          ', '
        )}`,
        { packId, path: `pack.units` }
      )
    );
  }

  // unit validation
  for (const u of pack.units) {
    issues.push(
      ...validateUnit(u, { packId: pack.id, groupIdSet, itemIdSet }, opts)
    );
  }

  // prereq references must exist within same pack
  const existingUnits = new Set<UnitId>(pack.units.map((u) => u.id));
  for (const u of pack.units) {
    const reqs = u.prereq?.requiresUnitIds ?? [];
    for (const req of reqs) {
      if (nonEmptyStr(req) && !existingUnits.has(req)) {
        issues.push(
          issue(
            'error',
            'PACK_PREREQ_UNIT_NOT_FOUND',
            `Unit "${u.id}" requires "${req}" but it does not exist in pack "${pack.id}".`,
            {
              packId: pack.id,
              unitId: u.id,
              path: `units[${u.id}].prereq.requiresUnitIds`,
            }
          )
        );
      }
    }
  }

  return issues;
}

export function validatePacks(
  packs: readonly ContentPack[],
  opts?: ValidateOptions
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const packIdSet = new Set<ContentPackId>();
  const dupPackIds = new Set<ContentPackId>();

  for (const p of packs) {
    if (packIdSet.has(p.id)) dupPackIds.add(p.id);
    packIdSet.add(p.id);
  }

  if (dupPackIds.size > 0) {
    issues.push(
      issue(
        'error',
        'PACK_IDS_DUPLICATE',
        `Duplicate pack ids found: ${Array.from(dupPackIds).join(', ')}`,
        { path: `packs[]` }
      )
    );
  }

  for (const p of packs) {
    issues.push(...validatePack(p, opts));
  }

  return issues;
}

export function validateBuiltInPacks(
  opts?: ValidateOptions
): ValidationIssue[] {
  return validatePacks(listBuiltInPacks(), opts);
}
