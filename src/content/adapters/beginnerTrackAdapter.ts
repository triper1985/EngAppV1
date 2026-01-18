// src/content/adapters/beginnerTrackAdapter.ts
import type { ContentPack } from '../types';
import type {
  UnitDef as BeginnerUnitDef,
  UnitGroupDef,
} from '../../tracks/beginnerTrack';

function packKey(packId: string) {
  return `content.pack.${packId}`;
}

function groupKey(groupId: string) {
  return `content.group.${groupId}`;
}

/**
 * Bridge a ContentPack into beginnerTrack defs.
 *
 * ✅ Uses pack.groups as the source of "units"
 * - ONE beginner unit per PackGroup (Basics/Neutrals/Fun)
 * - Quiz is derived from the SAME unitId (your Learn UI shows both buttons)
 * - prereqUnitIds follow the order of pack.groups (group[0] -> group[1] -> ...)
 */
export function bridgePackToBeginnerTrack(pack: ContentPack): {
  group: UnitGroupDef;
  units: BeginnerUnitDef[];
} {
  const group: UnitGroupDef = {
    id: pack.id,
    title: pack.title,
    titleKey: pack.titleKey ?? `${packKey(pack.id)}.title`,
    emoji: pack.emoji ?? '📦',
    description: pack.description,
    descriptionKey: pack.descriptionKey ?? `${packKey(pack.id)}.desc`,
  };

  const gs = pack.groups ?? [];

  const effective =
    gs.length > 0
      ? gs
      : [
          {
            id: pack.id,
            title: pack.title,
            titleKey: `${groupKey(pack.id)}.title`,
            itemIds: pack.items.map((it) => it.id),
          },
        ];

  const units: BeginnerUnitDef[] = [];

  const levelTag = pack.policy?.levelTag ?? 'A';
  const packMin = pack.policy?.minLayer;
  const packMax = pack.policy?.maxLayer;

  for (let i = 0; i < effective.length; i++) {
    const g = effective[i];
    const prevId = i > 0 ? effective[i - 1].id : null;

    units.push({
      id: g.id,
      groupId: group.id,
      policy:
        g.policy || pack.policy
          ? {
              levelTag,
              minLayer: (g.policy?.minLayer ?? packMin ?? 0) as any,
              maxLayer: (g.policy?.maxLayer ?? packMax) as any,
              skills: g.policy?.skills,
              gamePoolContribution: g.policy?.gamePoolContribution,
            }
          : undefined,
      title: g.title,
      titleKey: g.titleKey ?? `${groupKey(g.id)}.title`,
      prereqUnitIds: prevId ? [prevId] : [],
      itemIds: g.itemIds,
    });
  }

  return { group, units };
}
