// src/data/sync/syncPullChildren.ts
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../supabase/client';
import { ChildrenStore } from '../../storage/childrenStore';
import { setRemoteChildId } from './childIdMap';
import { getDeletedChildIds } from './deletedChildIds';

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

  // 🪦 tombstones – ילדים שנמחקו מקומית ואסור להחזיר
  const deletedChildIds = await getDeletedChildIds(parentId);

  // 3️⃣ שליפת ילדים מהענן
    const { data, error } = await supabase
    .from('children')
    .select('id, local_child_id, name')
    .eq('parent_id', parentId)
    .is('deleted_at', null);

  if (error) {
    console.error('[SYNC][PULL][CHILDREN] failed', error);
    throw error;
  }

  console.log('[SYNC][PULL][CHILDREN] fetched from cloud', {
    parentId,
    count: data?.length ?? 0,
    children: (data ?? []).map(r => ({
      localChildId: r.local_child_id,
      name: r.name,
      remoteChildId: r.id,
    })),
  });


  // 4️⃣ merge בלבד – אין clear, אין overwrite
    const localChildren = ChildrenStore.list();
    const localChildIds = new Set(localChildren.map(child => child.id));

 // 5️⃣ בנייה מחדש (authoritative, לפי local_child_id)
for (const row of data ?? []) {
  if (!row.local_child_id) continue;

    console.log('[SYNC][PULL][CHILDREN] processing row', {
    parentId,
    localChildId: row.local_child_id,
    remoteChildId: row.id,
    nameFromCloud: row.name,
  });

  // 🪦 אם הילד נמחק מקומית בעבר – מדלגים ולא מחיים
  if (deletedChildIds.has(row.local_child_id)) {
    console.log('[SYNC][PULL][CHILDREN] skip deleted child', {
      parentId,
      localChildId: row.local_child_id,
      remoteChildId: row.id,
      reason: 'tombstone',
    });
    continue;
  }



  if (localChildIds.has(row.local_child_id)) {
    console.log('[SYNC][PULL][CHILDREN] child exists locally – mapping only', {
      parentId,
      localChildId: row.local_child_id,
      remoteChildId: row.id,
    });

    await setRemoteChildId(row.local_child_id, row.id);
    continue;
  }
  console.log('[SYNC][PULL][CHILDREN] adding new local child from cloud', {
    parentId,
    localChildId: row.local_child_id,
    nameFromCloud: row.name,
    source: 'syncPullChildren',
  });

    // 🧠 ילד חדש למכשיר הזה – bootstrap חד־פעמי בלבד
    ChildrenStore.upsert({
      id: row.local_child_id,
      name: row.name,
      iconId: undefined,
      selectedPackIds: undefined,
      favoritePackIds: undefined,
      activePackId: undefined,
      coins: undefined,
      levelId: undefined,
      beginnerProgress: undefined,
      unlockedIconIds: undefined,
    } as any);

  await setRemoteChildId(row.local_child_id, row.id);
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
