// src/data/sync/syncProgress.ts
import { supabase, getParentUuid } from '../../supabase/client';
import { db } from '../../storage/db';
import { ProgressRow, SyncResult } from './syncTypes';
import { ensureRemoteChild } from './childIdMap';

export async function syncPendingProgress(): Promise<SyncResult> {
  try {
    const { data } = await supabase.auth.getUser();
console.log('[AUTH]', data?.user?.id);

    const parentUuid = await getParentUuid();

    const rows = await db.getAllAsync<ProgressRow>(
      `SELECT * FROM progress WHERE synced = 0`
    );

    if (!rows.length) {
      return { success: true, syncedCount: 0 };
    }

    let syncedCount = 0;

for (const row of rows) {
  if (!row.child_id) {
    console.warn('[SYNC][progress] missing local child id', row);
    continue;
  }

  const childUuid = await ensureRemoteChild({
    localChildId: row.child_id,
    parentId: parentUuid,
  });

  if (!childUuid) {
    console.warn('[SYNC][progress] child mapping failed', {
      localChildId: row.child_id,
    });
    continue;
  }

      const { error } = await supabase
        .from('progress')
        .upsert({
          id: row.id, 
          parent_id: parentUuid,
          child_id: childUuid,
          pack_id: row.pack_id,
          track_id: row.track_id,
          lesson_id: row.lesson_id,
          status: row.status,
          score: row.score,
          attempts: row.attempts,
          duration_sec: row.duration_sec,
          updated_at: new Date(row.updated_at ?? Date.now()).toISOString(),
        });


      if (error) {
        throw error;
      }

      await db.runAsync(
        `UPDATE progress SET synced = 1 WHERE id = ?`,
        [row.id]
      );

      syncedCount++;
    }

    return { success: true, syncedCount };
  } catch (error) {
    return { success: false, error };
  }
}
