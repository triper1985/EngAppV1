// src/content/utils/definePack.ts
import type {
  ContentPack,
  PackGroup,
  PackPolicyMeta,
  PackGroupPolicyMeta,
  LevelLayer,
  LevelTag,
  PackType,
} from '../types';

/**
 * Small helpers to reduce boilerplate and prevent common mistakes when adding new packs.
 *
 * These are intentionally "thin" wrappers so they don't change runtime behavior —
 * they only improve type inference and provide convenient constructors.
 */

export function definePack(pack: ContentPack): ContentPack {
  return pack;
}

export function defineGroup(group: PackGroup): PackGroup {
  return group;
}

export function policyForPack(params: PackPolicyMeta): PackPolicyMeta {
  return params;
}

export function policyForGroup(
  params: PackGroupPolicyMeta
): PackGroupPolicyMeta {
  return params;
}

export function corePackA(
  minLayer: LevelLayer,
  opts?: Partial<Omit<PackPolicyMeta, 'packType' | 'levelTag' | 'minLayer'>>
): PackPolicyMeta {
  return {
    packType: 'core' as PackType,
    levelTag: 'A' as LevelTag,
    minLayer,
    ...opts,
  };
}

export function interestPackA(
  minLayer: LevelLayer,
  opts?: Partial<Omit<PackPolicyMeta, 'packType' | 'levelTag' | 'minLayer'>>
): PackPolicyMeta {
  return {
    packType: 'interest' as PackType,
    levelTag: 'A' as LevelTag,
    minLayer,
    ...opts,
  };
}
