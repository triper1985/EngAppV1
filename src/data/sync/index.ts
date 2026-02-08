// src/data/sync/index.ts
import { syncPendingProgress } from './syncProgress';
import { syncPendingEvents } from './syncEvents';
import { supabase } from '../../supabase/client';

export async function syncAll() {
  const { data } = await supabase.auth.getUser();

  console.log('[SYNC] start', {
    userId: data?.user?.id,
    time: new Date().toISOString(),
  });

  const progressResult = await syncPendingProgress();

  if (!progressResult.success) {
    console.warn('[SYNC] progress failed', progressResult);
    return progressResult;
  }

  const eventsResult = await syncPendingEvents();

  if (!eventsResult.success) {
    console.warn('[SYNC] events failed', eventsResult);
    return eventsResult;
  }

  console.log('[SYNC] done');
  return eventsResult;
}
