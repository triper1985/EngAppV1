// src/parent/parentDeleteChild.ts
import { ChildrenStore } from '../storage/childrenStore';
import { ParentReport } from '../parentReport';
import { clearRemoteChildId } from '../data/sync/childIdMap';

export function parentDeleteChild(localChildId: string) {
  // 1. reset all local progress/events
  ParentReport.resetAllForChild(localChildId);

  // 2. remove child locally
  ChildrenStore.remove(localChildId);

  // 3. 🔥 CRITICAL: clear mapping to cloud
  clearRemoteChildId(localChildId);
}
