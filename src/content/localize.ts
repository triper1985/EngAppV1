// src/content/localize.ts
import type { ContentPack, PackGroup, UnitDef } from './types';
import type { TranslateFn } from '../i18n/types';

export function getPackTitle(pack: ContentPack, t: TranslateFn): string {
  return pack.titleKey ? t(pack.titleKey) : pack.title;
}

export function getPackDescription(
  pack: ContentPack,
  t: TranslateFn
): string | null {
  if (pack.descriptionKey) return t(pack.descriptionKey);
  return typeof pack.description === 'string' && pack.description.trim()
    ? pack.description
    : null;
}

export function getGroupTitle(group: PackGroup, t: TranslateFn): string {
  return group.titleKey ? t(group.titleKey) : group.title;
}

export function getUnitTitle(unit: UnitDef, t: TranslateFn): string {
  return unit.titleKey ? t(unit.titleKey) : unit.title;
}
