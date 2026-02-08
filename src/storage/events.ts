//src/storage/events.ts
import { db } from './db';
import { getDeviceId } from './device';

export type EventRecord = {
  id: string;
  device_id: string;
  child_id?: string | null;
  event_type: string;
  payload?: Record<string, any> | null;
  created_at: number;
  synced: number;
};

/**
 * Track analytics event (offline-first)
 */
export async function trackEvent(

  eventType: string,
  options?: {
    childId?: string;
    payload?: Record<string, any>;
  }
) {
  const deviceId = await getDeviceId();
  const now = Date.now();

  console.log('[EVENT] tracked', eventType, options);

  await db.runAsync(
    `
    INSERT INTO events (
      id,
      child_id,
      event_type,
      payload,
      created_at,
      synced
    )
    VALUES (?, ?, ?, ?, ?, 0)
    `,
    [
      `${eventType}_${now}_${Math.random().toString(36).slice(2)}`,
      options?.childId ?? null,
      eventType,
      options?.payload ? JSON.stringify(options.payload) : null,
      now,
    ]
  );
}
export async function clearAllEvents() {
  await db.runAsync(`DELETE FROM events`);
  console.log('[EVENTS] local events cleared');
}
