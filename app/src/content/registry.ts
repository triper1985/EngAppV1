// src/content/registry.ts
import type { ContentPack, ContentPackId } from './types';

import { foundationsPack } from './packs/core/foundationsPack';
import { listeningPack } from './packs/core/listeningPack';

import { numbersPack } from './packs/core/numbersPack';
import { lettersPack } from './packs/core/lettersPack';
import { colorsPack } from './packs/core/colorsPack';

import { spacePack } from './packs/interest/spacePack';
import { animalsPack } from './packs/interest/animalsPack';

export const BUILT_IN_PACKS: readonly ContentPack[] = [
  foundationsPack,
  listeningPack,
  numbersPack,
  lettersPack,
  colorsPack,
  spacePack,
  animalsPack,
] as const;

const packsById = new Map<ContentPackId, ContentPack>();
for (const p of BUILT_IN_PACKS) {
  packsById.set(p.id, p);
}

export function getPackById(id: ContentPackId): ContentPack | undefined {
  return packsById.get(id);
}

export function listBuiltInPacks(): readonly ContentPack[] {
  return BUILT_IN_PACKS;
}

function tagsOf(p: ContentPack): string[] {
  return p.meta?.tags ?? [];
}

function packTypeOf(p: ContentPack): 'core' | 'interest' | undefined {
  return (
    p.policy?.packType ??
    (tagsOf(p).includes('core')
      ? 'core'
      : tagsOf(p).includes('interest')
      ? 'interest'
      : undefined)
  );
}

export function isCorePack(p: ContentPack): boolean {
  return packTypeOf(p) === 'core';
}

export function isInterestPack(p: ContentPack): boolean {
  return packTypeOf(p) === 'interest';
}

export function isHiddenPack(p: ContentPack): boolean {
  return tagsOf(p).includes('hidden');
}

export function isBeginnerBridgePack(p: ContentPack): boolean {
  return tagsOf(p).includes('beginnerBridge');
}

export function listCorePacks(): readonly ContentPack[] {
  return BUILT_IN_PACKS.filter(isCorePack);
}

export function listInterestPacks(): readonly ContentPack[] {
  return BUILT_IN_PACKS.filter(isInterestPack);
}

export function listVisibleInterestPacks(): readonly ContentPack[] {
  return BUILT_IN_PACKS.filter((p) => isInterestPack(p) && !isHiddenPack(p));
}

export function listBeginnerBridgePacks(): readonly ContentPack[] {
  return BUILT_IN_PACKS.filter(isBeginnerBridgePack);
}
