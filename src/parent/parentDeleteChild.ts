// src/parent/parentDeleteChild.ts
import { ChildrenStore } from '../storage/childrenStore';
import { ParentReport } from '../parentReport';
import { clearRemoteChildId } from '../data/sync/childIdMap';
import { getDeviceParentId } from '../storage/parentOwner';
import { markChildDeleted } from '../data/sync/deletedChildIds';

export async function parentDeleteChild(localChildId: string) {
  // 1. reset all local progress/events
  ParentReport.resetAllForChild(localChildId);

  // 2. remove child locally
  ChildrenStore.remove(localChildId);

  // 3. 🔥 clear mapping to cloud
  await clearRemoteChildId(localChildId);

  // 4. 🪦 record deletion intent (tombstone)
  const parentId = await getDeviceParentId();
  if (parentId) {
    await markChildDeleted(parentId, localChildId);
  }
}