// src/supabase/ensureParent.ts
import { supabase } from './client';
import { getDeviceParentId, setDeviceParentId } from '../storage/parentOwner';
import { clearLocalDataForParentSwitch } from '../parent/clearLocalData';

export async function ensureParentExists() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('[PARENT] session error', sessionError);
    return;
  }

  const user = session?.user;
  if (!user) return;

  const currentParentId = user.id;
  const lastParentId = await getDeviceParentId();

  // 🔥 THIS IS THE FIX
  if (lastParentId && lastParentId !== currentParentId) {
    console.log('[PARENT SWITCH]', lastParentId, '→', currentParentId);
    await clearLocalDataForParentSwitch();
  }

  // תמיד מעדכנים מי ההורה על המכשיר
  await setDeviceParentId(currentParentId);

  const { error } = await supabase
    .from('parents')
    .insert({ id: currentParentId });

  if (error) {
    if (error.code === '23505') {
      console.log('[PARENT] already exists', currentParentId);
      return;
    }

    console.error('[PARENT] ensure failed', error);
  } else {
    console.log('[PARENT] ensured', currentParentId);
  }
}
