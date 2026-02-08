// src/data/sync/syncAllSafe.ts
import { supabase } from '../../supabase/client';
import { syncAll } from './index';

export async function syncAllSafe(
  source: 'startup' | 'manual' | 'after_login' = 'manual'
) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log('[SYNC][SKIP] no session', source);
      return;
    }

    console.log('[SYNC][START]', source);
    const result = await syncAll();
    console.log('[SYNC][DONE]', {
        source,
        success: result?.success,
      });

  } catch (err) {
    console.error('[SYNC][FAILED]', source, err);
  }
}
