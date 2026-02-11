// src/data/sync/syncEvents.ts
import { supabase, getParentUuid } from '../../supabase/client';
import { db } from '../../storage/db';
import { EventRow, SyncResult } from './syncTypes';
import { ensureRemoteChild } from './childIdMap';

export async function syncPendingEvents(): Promise<SyncResult> {
  try {
    const parentUuid = await getParentUuid();
    console.log('[SYNC][EVENTS] start', {
      parentUuid,
      source: 'syncPendingEvents',
    });
    const rows = await db.getAllAsync<EventRow>(
      `SELECT * FROM events WHERE synced = 0`
    );
console.log('[SYNC][EVENTS] pending rows fetched', {
  parentUuid,
  count: rows.length,
});
    if (!rows.length) {
      return { success: true, syncedCount: 0 };
    }

    let syncedCount = 0;

      for (const row of rows) {
        let childUuid: string | null = null;
  console.log('[SYNC][EVENT] process row', {
    eventId: row.id,
    localChildId: row.child_id ?? null,
    eventType: row.event_type,
  });
        if (row.child_id) {
          childUuid = await ensureRemoteChild({
            localChildId: row.child_id,
            parentId: parentUuid,
          });

          if (!childUuid) {
            console.warn('[SYNC][EVENT] skip – child unresolved', {
              localChildId: row.child_id,
              eventId: row.id,
            });
            continue;
          }
          console.log('[SYNC][EVENT] child resolved', {
            eventId: row.id,
            localChildId: row.child_id,
            remoteChildId: childUuid,
          });
        }

console.log('[SYNC][EVENT] pushing to cloud', {
  eventId: row.id,
  parentUuid,
  remoteChildId: childUuid,
  eventType: row.event_type,
});
      const { error } = await supabase
        .from('events')
        .insert({
          parent_id: parentUuid,
          child_id: childUuid,
          event_type: row.event_type,
          payload: JSON.parse(row.payload ?? '{}'),
          created_at: new Date(
            row.created_at ?? Date.now()
          ).toISOString(),
        });

      if (error) {
        throw error;
      }

      await db.runAsync(
        `UPDATE events SET synced = 1 WHERE id = ?`,
        [row.id]
      );

      syncedCount++;
      console.log('[SYNC][EVENT] synced locally', {
  eventId: row.id,
});
    }
console.log('[SYNC][EVENTS] done', {
  parentUuid,
  syncedCount,
});
    return { success: true, syncedCount };
  } catch (error) {
    return { success: false, error };
  }
}
