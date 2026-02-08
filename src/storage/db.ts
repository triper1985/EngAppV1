// src/storage/db.ts
import * as SQLite from 'expo-sqlite';

export let db: SQLite.SQLiteDatabase;

/**
 * Initialize local SQLite DB (offline-first)
 */
export async function initDb(): Promise<void> {
  db = await SQLite.openDatabaseAsync('engapp.db');

  // Progress (offline-first)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY NOT NULL,
      child_id TEXT NOT NULL,
      pack_id TEXT,
      track_id TEXT,
      lesson_id TEXT,
      status TEXT,
      score INTEGER,
      attempts INTEGER,
      duration_sec INTEGER,
      updated_at INTEGER,
      synced INTEGER DEFAULT 0
    );
  `);

  // Events (analytics)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      child_id TEXT,
      event_type TEXT NOT NULL,
      payload TEXT,
      created_at INTEGER,
      synced INTEGER DEFAULT 0
    );
  `);
}
