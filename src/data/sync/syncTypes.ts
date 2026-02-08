// src/data/sync/syncTypes.ts

export type SyncResult =
  | { success: true; syncedCount: number }
  | { success: false; error: unknown };

export interface ProgressRow {
  id: string;
  child_id: string;
  pack_id?: string;
  track_id?: string;
  lesson_id?: string;
  status: string;
  score?: number;
  attempts?: number;
  duration_sec?: number;
  updated_at?: number;
  synced: number;
}

export interface EventRow {
  id: string;
  child_id?: string;
  event_type: string;
  payload: string;
  created_at: number;
  synced: number;
}
