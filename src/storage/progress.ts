// src/storage/progress.ts
import { db } from './db';
import { getDeviceId } from './device';

export type ProgressRecord = {
  id: string;
  child_id: string;
  pack_id?: string | null;
  track_id?: string | null;
  lesson_id?: string | null;
  status?: string | null;
  score?: number | null;
  attempts?: number | null;
  duration_sec?: number | null;
  updated_at: number;
  synced: number;
};

/**
 * Insert or update progress (offline-first)
 */
export async function upsertProgress(
    
  record: Omit<ProgressRecord, 'synced' | 'updated_at'>
) {
  const now = Date.now();
  const deviceId = await getDeviceId();

  await db.runAsync(
    `
    INSERT INTO progress (
      id,
      child_id,
      pack_id,
      track_id,
      lesson_id,
      status,
      score,
      attempts,
      duration_sec,
      updated_at,
      synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      score = excluded.score,
      attempts = excluded.attempts,
      duration_sec = excluded.duration_sec,
      updated_at = ?,
      synced = 0
    `,
    [
      record.id,
      record.child_id,
      record.pack_id ?? null,
      record.track_id ?? null,
      record.lesson_id ?? null,
      record.status ?? null,
      record.score ?? null,
      record.attempts ?? null,
      record.duration_sec ?? null,
      now,
      now,
    ]
  );
}

/**
 * Get all progress for a child
 */
export async function getProgressByChild(childId: string) {
  const rows = await db.getAllAsync<ProgressRecord>(
    `SELECT * FROM progress WHERE child_id = ? ORDER BY updated_at DESC`,
    [childId]
  );
  return rows;
}

/**
 * Get all unsynced progress rows
 */
export async function getUnsyncedProgress() {
  return db.getAllAsync<ProgressRecord>(
    `SELECT * FROM progress WHERE synced = 0`
  );
}

/**
 * Mark progress rows as synced
 */
export async function markProgressSynced(ids: string[]) {
  if (!ids.length) return;

  const placeholders = ids.map(() => '?').join(',');
  await db.runAsync(
    `UPDATE progress SET synced = 1 WHERE id IN (${placeholders})`,
    ids
  );
}
export async function clearAllProgress() {
  await db.runAsync(`DELETE FROM progress`);
  console.log('[PROGRESS] local progress cleared');
}
