// src/data/sync/syncPullChildren.ts
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../supabase/client';
import { ChildrenStore } from '../../storage/childrenStore';
import { clearChildIdMap, setRemoteChildId } from './childIdMap';

type PullResult =
  | { ok: true; source: 'cloud'; count: number }
  | { ok: false; reason: 'no-internet' | 'not-authorized' | 'push-not-confirmed' };

export async function syncPullChildren(opts: {
  parentId: string;
  requirePushSuccess: boolean;
}): Promise<PullResult> {
  const { parentId } = opts;

  // 1️⃣ בדיקת אינטרנט
  const net = await NetInfo.fetch();
  if (!net.isConnected) {
    return { ok: false, reason: 'no-internet' };
  }

  // 2️⃣ בדיקת session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== parentId) {
    return { ok: false, reason: 'not-authorized' };
  }

  // 3️⃣ שליפת ילדים מהענן
  const { data, error } = await supabase
    .from('children')
    .select('id, local_child_id, name')
    .eq('parent_id', parentId);

  if (error) {
    console.error('[SYNC][PULL][CHILDREN] failed', error);
    throw error;
  }

  // 4️⃣ מחיקה מוחלטת של local children + mapping
  await ChildrenStore.clear();
  await clearChildIdMap();

  // 5️⃣ בנייה מחדש
  for (const row of data ?? []) {
    const localId = row.local_child_id;

    // יצירת ילד מקומי (id יציב = local_child_id)
    const child = ChildrenStore.add(row.name);

    if (child && localId) {
      // שמירה של mapping local <-> remote
      await setRemoteChildId(child.id, row.id);
    }
  }

  console.log('[SYNC][PULL][CHILDREN] completed', {
    parentId,
    count: data?.length ?? 0,
  });

  return {
    ok: true,
    source: 'cloud',
    count: data?.length ?? 0,
  };
}
