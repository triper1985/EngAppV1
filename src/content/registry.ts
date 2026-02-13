// src/content/registry.ts
import type { ContentPack, ContentPackId } from './types';

import { foundationsPack } from './packs/core/foundationsPack';
import { listeningPack } from './packs/core/listeningPack';

import { numbersPack } from './packs/core/numbersPack';
import { lettersPack } from './packs/core/lettersPack';
import { colorsPack } from './packs/core/colorsPack';
import { animalsPack } from './packs/core/animalsPack';
import { earlyRecognitionPack } from './packs/core/earlyRecognitionPack';
import { homePack } from './packs/core/homePack';
import { clothesPack } from './packs/core/clothesPack';
import { foodPack } from './packs/core/foodPack';
import { transportPack } from './packs/core/transportPack';
import { toysPack } from './packs/core/toysPack';
import { letterWordsPack } from './packs/core/letterWordsPack';
import { l4_shapesPack } from './packs/core/l4_shapesPack';
import { l4_directionsPack } from './packs/core/l4_directionsPack';
import { l4_spatialPack } from './packs/core/l4_spatialPack';
import { l4_emotionsPack } from './packs/core/l4_emotionsPack';
import { l4_symbolsPack } from './packs/core/l4_symbolsPack';
import { l4_patternsPack } from './packs/core/l4_patternsPack';

import { spacePack } from './packs/interest/spacePack';
import { foodFunPack } from './packs/interest/foodFunPack';
import { animalsMorePack } from './packs/interest/animalsMorePack';
import { transportMorePack } from './packs/interest/transportMorePack';
import { clothesMorePack } from './packs/interest/clothesMorePack';
import { homeMorePack } from './packs/interest/homeMorePack';
import { jobsPack } from './packs/interest/jobsPack';

export const BUILT_IN_PACKS: readonly ContentPack[] = [
  foundationsPack,
  listeningPack,
  colorsPack,
  animalsPack,
  homePack,
  clothesPack,
  foodPack,
  transportPack,
  toysPack,
  numbersPack,       
  lettersPack,       
  letterWordsPack,   
  l4_shapesPack,
  l4_directionsPack,
  l4_spatialPack,
  l4_emotionsPack,
  l4_symbolsPack,
  l4_patternsPack,
  spacePack,
  earlyRecognitionPack,
  foodFunPack,
  animalsMorePack,
  transportMorePack,
  clothesMorePack,
  homeMorePack,
  jobsPack,
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

