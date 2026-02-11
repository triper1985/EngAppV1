// src/data/sync/index.ts
import { syncPendingProgress } from './syncProgress';
import { syncPendingEvents } from './syncEvents';
import { supabase } from '../../supabase/client';

export async function syncAll() {
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id ?? null;

  console.log('[SYNC][ALL] start', {
    userId,
    time: new Date().toISOString(),
    source: 'syncAll',
  });

  console.log('[SYNC][ALL] step: progress → start', { userId });

  const progressResult = await syncPendingProgress();

  console.log('[SYNC][ALL] step: progress → result', {
    userId,
    success: progressResult.success,
    syncedCount: progressResult.success
      ? progressResult.syncedCount
      : undefined,
  });

  if (!progressResult.success) {
    console.warn('[SYNC][ALL] abort after progress failure', {
      userId,
      error: progressResult.error,
    });
    return progressResult;
  }

  console.log('[SYNC][ALL] step: events → start', { userId });

  const eventsResult = await syncPendingEvents();

  console.log('[SYNC][ALL] step: events → result', {
    userId,
    success: eventsResult.success,
    syncedCount: eventsResult.success
      ? eventsResult.syncedCount
      : undefined,
  });

  if (!eventsResult.success) {
    console.warn('[SYNC][ALL] abort after events failure', {
      userId,
      error: eventsResult.error,
    });
    return eventsResult;
  }

  console.log('[SYNC][ALL] done', {
    userId,
    time: new Date().toISOString(),
  });

  return eventsResult;
}

