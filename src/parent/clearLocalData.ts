// src/parent/clearLocalData.ts

import { ChildrenStore } from '../storage/childrenStore';
import { clearAllReports } from '../storage/parentReportStore';
import { clearChildIdMap } from '../data/sync/childIdMap';
import { clearAllEvents } from '../storage/events';
import { clearAllProgress } from '../storage/progress';

export async function clearLocalDataForParentSwitch() {
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
}
