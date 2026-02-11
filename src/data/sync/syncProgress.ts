// src/data/sync/syncProgress.ts
import { supabase, getParentUuid } from '../../supabase/client';
import { db } from '../../storage/db';
import { ProgressRow, SyncResult } from './syncTypes';
import { ensureRemoteChild } from './childIdMap';

export async function syncPendingProgress(): Promise<SyncResult> {
  try {
    const { data } = await supabase.auth.getUser();
    console.log('[SYNC][PROGRESS] auth user', data?.user?.id);

    const parentUuid = await getParentUuid();
    console.log('[SYNC][PROGRESS] parentUuid resolved', parentUuid);


    const rows = await db.getAllAsync<ProgressRow>(
      `SELECT * FROM progress WHERE synced = 0`
    );
console.log('[SYNC][PROGRESS] pending rows', {
  count: rows.length,
  parentUuid,
});
    if (!rows.length) {
      return { success: true, syncedCount: 0 };
    }

    let syncedCount = 0;

for (const row of rows) {
  console.log('[SYNC][PROGRESS] handling row', {
    rowId: row.id,
    localChildId: row.child_id,
    packId: row.pack_id,
    lessonId: row.lesson_id,
  });

  if (!row.child_id) {
    console.warn('[SYNC][PROGRESS] missing local child id', row);
    continue;
  }


  const childUuid = await ensureRemoteChild({
  localChildId: row.child_id,
  parentId: parentUuid,
});

console.log('[SYNC][PROGRESS] child mapping result', {
  localChildId: row.child_id,
  remoteChildId: childUuid,
});

if (!childUuid) {
  console.warn('[SYNC][PROGRESS] child mapping failed', {
    localChildId: row.child_id,
  });
  continue;
}
console.log('[SYNC][PROGRESS] pushing to cloud', {
  rowId: row.id,
  parentUuid,
  childUuid,
  status: row.status,
  score: row.score,
});

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

console.log('[SYNC][PROGRESS] row synced', {
  rowId: row.id,
  localChildId: row.child_id,
});

    }
console.log('[SYNC][PROGRESS] completed', {
  parentUuid,
  syncedCount,
});
    return { success: true, syncedCount };
  } catch (error) {
    return { success: false, error };
  }
}
