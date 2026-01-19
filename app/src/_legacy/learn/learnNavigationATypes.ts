/**
 * @deprecated
 * Legacy V7/V8 types. DO NOT USE.
 * Source of truth is: src/screens/learn/learnNavigationA.ts
 */

// src/screens/learn/learnNavigationATypes.ts
import type { UnitGroupId } from '../../tracks/beginnerTrack';

export type LearnCardStatus = 'locked' | 'open' | 'current' | 'done';

export type LayerCardVM = {
  id: number; // 0..4
  status: LearnCardStatus;
  progressPct: number; // 0..100
  isPressable: boolean;
};

export type GroupCardVM = {
  id: UnitGroupId;
  title: string;
  emoji?: string;
  description?: string;
  status: LearnCardStatus;
  progressLabel?: string;
  progressPct: number; // 0..100
  isPressable: boolean;
  requiredLayer: number;
  isRecommended?: boolean;
};

export type LearnHomeVM = {
  unlockedLayer: number;
  layers: LayerCardVM[];
};

export type LearnLayerVM = {
  layerId: number;
  unlockedLayer: number;
  groups: GroupCardVM[];
};
