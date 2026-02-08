// src/storage/childIdMap.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'english_child_id_map_v1';

/**
 * local_child_id -> remote_child_id
 */
type ChildIdMap = Record<string, string>;

async function load(): Promise<ChildIdMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function save(map: ChildIdMap) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(map));
  } catch {}
}

export async function getRemoteChildId(
  localChildId: string
): Promise<string | null> {
  const map = await load();
  return map[localChildId] ?? null;
}

export async function setChildIdMapping(
  localChildId: string,
  remoteChildId: string
): Promise<void> {
  const map = await load();
  map[localChildId] = remoteChildId;
  await save(map);
}

export async function clearChildIdMap(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}
