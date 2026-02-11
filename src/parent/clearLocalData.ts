// src/parent/clearLocalData.ts
import { ChildrenStore } from '../storage/childrenStore';
import { clearAllReports } from '../storage/parentReportStore';
import { clearChildIdMap } from '../data/sync/childIdMap';
import { clearAllEvents } from '../storage/events';
import { clearAllProgress } from '../storage/progress';
import { clearDeletedChildIds } from '../data/sync/deletedChildIds';

let isClearing = false;

export async function clearLocalDataForParentSwitch(parentId?: string) {
  if (isClearing) {
    console.log('[PARENT SWITCH] skip – already clearing');
    return;
  }

  isClearing = true;

  console.log('[PARENT SWITCH] clearing all local data');

  // children
  await ChildrenStore.clear();


  // parent reports (progress summaries)
  clearAllReports();

  // sqlite
  await clearAllEvents();
  await clearAllProgress();

  // childIdMap
  await clearChildIdMap();

  // 🪦 tombstones (per parent)
  if (parentId) {
    await clearDeletedChildIds(parentId);
  }

  isClearing = false;
}
