//src/data/sync/childIdMap.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../supabase/client';

const KEY = 'child_id_map_v1';

/**
 * local_child_id -> remote_child_id
 */
type ChildIdMap = Record<string, string>;

/* ---------------------------------- */
/* internal helpers                    */
/* ---------------------------------- */

async function loadMap(): Promise<ChildIdMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ChildIdMap;
  } catch {
    return {};
  }
}
export async function clearRemoteChildId(localChildId: string) {
  const map = await loadMap();      // whatever internal helper you use
  if (!(localChildId in map)) return;

  delete map[localChildId];
  await saveMap(map);
}
async function saveMap(map: ChildIdMap): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // ignore (best effort)
  }
}

/* ---------------------------------- */
/* public API                          */
/* ---------------------------------- */

/**
 * Get remote child id for a local child id (if exists)
 */
export async function getRemoteChildId(
  localChildId: string
): Promise<string | null> {
  const map = await loadMap();
  return map[localChildId] ?? null;
}

/**
 * Save mapping local -> remote
 */
export async function setRemoteChildId(
  localChildId: string,
  remoteChildId: string
): Promise<void> {
  const map = await loadMap();
  map[localChildId] = remoteChildId;
  await saveMap(map);
}

/**
 * Ensure a remote child exists for this local child.
 * If not exists → create it in Supabase and store mapping.
 */
export async function ensureRemoteChild(opts: {
  localChildId: string;
  parentId: string;
}): Promise<string | null> {
  const { localChildId, parentId } = opts;

  // 1️⃣ check existing mapping
  const existing = await getRemoteChildId(localChildId);
  if (existing) return existing;

  // 2️⃣ create child in Supabase
  const { data, error } = await supabase
    .from('children')
    .insert({
      parent_id: parentId,
      local_child_id: localChildId,
      name: localChildId, // זמני, אפשר לשפר בעתיד
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    console.error('[SYNC][CHILD] failed to create remote child', {
      localChildId,
      error,
    });
    return null;
  }

  // 3️⃣ persist mapping
  await setRemoteChildId(localChildId, data.id);

  console.log('[SYNC][CHILD] mapped', {
    localChildId,
    remoteChildId: data.id,
  });

  return data.id;
}

/**
 * DEV / safety: clear all mappings (used on parent/device reset)
 */
export async function clearChildIdMap(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}
