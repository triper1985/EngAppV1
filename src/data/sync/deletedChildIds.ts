// src/data/sync/deletedChildIds.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = (parentId: string) => `deleted_child_ids:${parentId}`;

export async function getDeletedChildIds(parentId: string): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(KEY(parentId));
    if (!raw) {
      const set = new Set<string>();

      console.log('[SYNC][DELETE][TOMBSTONES] loaded', {
        parentId,
        count: 0,
        ids: [],
      });

      return set;
    }

    const arr = JSON.parse(raw);
    const set = Array.isArray(arr) ? new Set<string>(arr) : new Set<string>();

    console.log('[SYNC][DELETE][TOMBSTONES] loaded', {
      parentId,
      count: set.size,
      ids: Array.from(set),
    });

    return set;
  } catch (error) {
    console.warn('[SYNC][DELETE][TOMBSTONES] load failed', {
      parentId,
      error,
    });

    return new Set<string>();
  }
}


export async function markChildDeleted(parentId: string, childId: string) {
    console.log('[SYNC][DELETE][TOMBSTONES] mark', {
    parentId,
    childId,
    source: 'markChildDeleted',
  });
  const set = await getDeletedChildIds(parentId);
  set.add(childId);
  await AsyncStorage.setItem(KEY(parentId), JSON.stringify(Array.from(set)));
}

export async function clearDeletedChildIds(parentId: string) {
    console.log('[SYNC][DELETE][TOMBSTONES] clear all', {
    parentId,
    source: 'clearDeletedChildIds',
  });
  await AsyncStorage.removeItem(KEY(parentId));
}
