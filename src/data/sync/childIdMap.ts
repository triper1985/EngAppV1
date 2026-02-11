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

    if (!raw) {
      console.log('[SYNC][CHILD][MAP] loadMap – empty');
      return {};
    }

    const parsed = JSON.parse(raw) as ChildIdMap;

    console.log('[SYNC][CHILD][MAP] loadMap', {
      count: Object.keys(parsed).length,
      keys: Object.keys(parsed),
    });

    return parsed;

  } catch {
    return {};
  }
}
export async function clearRemoteChildId(localChildId: string) {
  const map = await loadMap();

  if (!(localChildId in map)) {
    console.log('[SYNC][CHILD][MAP] clearRemoteChildId – not found', {
      localChildId,
    });
    return;
  }

  console.log('[SYNC][CHILD][MAP] clearRemoteChildId', {
    localChildId,
    remoteChildId: map[localChildId],
  });

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
  const remote = map[localChildId] ?? null;

  console.log('[SYNC][CHILD][MAP] getRemoteChildId', {
    localChildId,
    remoteChildId: remote,
  });

  return remote;
}


/**
 * Save mapping local -> remote
 */
export async function setRemoteChildId(
  localChildId: string,
  remoteChildId: string
): Promise<void> {
  const map = await loadMap();

  console.log('[SYNC][CHILD][MAP] setRemoteChildId', {
    localChildId,
    remoteChildId,
    existedBefore: !!map[localChildId],
  });

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
  displayName: string; // ✅ חדש
}): Promise<string | null> {
  const { localChildId, parentId, displayName } = opts;

  console.log('[SYNC][CHILD][ENSURE] called', {
    source: 'ensureRemoteChild',
    parentId,
    localChildId,
    displayName,
  });


  console.log('[SYNC][CHILD][ENSURE] called', {
    source: 'ensureRemoteChild',
    parentId,
    localChildId,
  });

  // 1️⃣ check existing mapping
  const existing = await getRemoteChildId(localChildId);

  if (existing) {
    console.log('[SYNC][CHILD][ENSURE] existing mapping found', {
      parentId,
      localChildId,
      remoteChildId: existing,
    });
    return existing;
  }



  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== parentId) {
    console.warn('[SYNC][CHILD] skip create – no valid session', {
      localChildId,
      parentId,
    });
    return null;
  }


  // 2️⃣ create child in Supabase
    console.log('[SYNC][CHILD][ENSURE] creating remote child', {
  parentId,
  localChildId,
  nameSentToCloud: displayName,
});

const { data, error } = await supabase
  .from('children')
  .insert({
    parent_id: parentId,
    local_child_id: localChildId,
    name: displayName, // ✅ עכשיו שולחים את השם האמיתי
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

  console.log('[SYNC][CHILD][ENSURE] mapped new child', {
    parentId,
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
/**
 * Get all local -> remote child id mappings
 */
export async function getAllChildIdMappings(): Promise<
  { localChildId: string; remoteChildId: string }[]
> {
  const map = await loadMap();

  return Object.entries(map).map(([localChildId, remoteChildId]) => ({
    localChildId,
    remoteChildId,
  }));
}
