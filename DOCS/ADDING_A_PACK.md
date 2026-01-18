# Adding a Content Pack (Checklist)

This project uses a **Content Layer** (`src/content`) so new learning content can be added without rewriting UI.

## 1) Create the pack file

- Core packs: `src/content/packs/core/<yourPack>.ts`
- Interest packs: `src/content/packs/interest/<yourPack>.ts`

The pack should export `const <name>Pack: ContentPack`.

## 2) Required metadata/policy

In the exported pack object, set:

- `policy.packType`: `'core' | 'interest'`
- `policy.levelTag`: currently `'A'`
- `policy.minLayer`: `0..4`
- (optional) `policy.maxLayer`

Also set `meta.tags`:

- include `'core'` or `'interest'`
- include `'beginnerBridge'` if you want the pack to appear in the Beginner/Learn flow (via bridging)

## 3) Items

Add `items: ContentItem[]` with stable `id` values.

Tip: **Do not rename existing item ids** after release—progress is keyed by ids.

## 4) Groups (recommended)

Prefer splitting packs into **groups** (each group becomes a Unit in the Beginner track).

For each group:

- `id`: stable unit id (e.g. `numbers_1_10`)
- `itemIds`: subset of pack item ids
- (optional but recommended) `policy.minLayer` to unlock sub-units later
- `titleKey`: point to an i18n key (reuse existing `beginner.unit.*.title` keys where possible)

If you do not need sub-unlock, you can keep a single group with all items.

## 5) Register the pack

Add it to:

- `src/content/registry.ts` → `BUILT_IN_PACKS`

## 6) i18n keys

If you introduced new `titleKey` / `descriptionKey`, add them to:

- `src/i18n/dict.en.ts`
- `src/i18n/dict.he.ts`

## 7) Sanity checks (manual)

After adding a pack, verify:

- Learn groups order looks correct (sorted by layer)
- Locked/unlocked states behave as expected (layer gating)
- Games gating still works (allowed game types per layer)

## Notes

- **Source of truth** should be Content Packs.
- `src/tracks/beginnerTrack.ts` should ideally stay thin and rely on bridging for pack-derived units.
