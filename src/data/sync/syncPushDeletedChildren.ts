// src/data/sync/syncPushDeletedChildren.ts
import { supabase } from '../../supabase/client';
import { getAllChildIdMappings, clearRemoteChildId } from './childIdMap';
import { getDeletedChildIds, clearDeletedChildIds } from './deletedChildIds';

export async function syncPushDeletedChildren(opts: {
  parentId: string;
}) {
  const { parentId } = opts;
  console.log('[SYNC][DELETE][CHILDREN] start', {
    parentId,
    source: 'syncPushDeletedChildren',
  });
  // 1️⃣ בדיקת session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== parentId) {
    console.warn('[SYNC][DELETE][CHILDREN] skip – no valid session', {
      parentId,
    });
    return;
  }

  // 2️⃣ tombstones – כוונת מחיקה
  const deletedChildIds = await getDeletedChildIds(parentId);
  
console.log('[SYNC][DELETE][CHILDREN] tombstones loaded', {
  parentId,
  count: deletedChildIds.size,
  ids: Array.from(deletedChildIds),
});
  if (deletedChildIds.size === 0) {
    console.log('[SYNC][DELETE][CHILDREN] nothing to push');
    return; // אין מה לדחוף
  }

  const pushed: string[] = [];

  // 3️⃣ מיפויים קיימים local → remote
  const mappings = await getAllChildIdMappings();

  console.log('[SYNC][DELETE][CHILDREN] mappings loaded', {
  parentId,
  count: mappings.length,
  mappings,
});

  // 4️⃣ דחיפת soft delete לענן רק לפי tombstones
  for (const { localChildId, remoteChildId } of mappings) {
    if (!deletedChildIds.has(localChildId)) continue;

      console.log('[SYNC][DELETE][CHILDREN] pushing delete', {
    parentId,
    localChildId,
    remoteChildId,
  });

    const { error } = await supabase
      .from('children')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', remoteChildId)
      .eq('parent_id', parentId);

    if (error) {
      console.error('[SYNC][DELETE][CHILDREN] failed', {
        parentId,
        localChildId,
        error,
      });
      continue; // לא מנקים tombstone במקרה של כשל
    }

    // 5️⃣ ניתוק mapping
    await clearRemoteChildId(localChildId);
console.log('[SYNC][DELETE][CHILDREN] delete pushed successfully', {
  parentId,
  localChildId,
  remoteChildId,
});
    pushed.push(localChildId);
    console.log('[SYNC][DELETE][CHILDREN] completed', {
  parentId,
  pushedCount: pushed.length,
  pushed,
});
  }

  // 6️⃣ ניקוי tombstones שנדחפו בהצלחה
  if (pushed.length > 0) {
    console.log('[SYNC][DELETE][CHILDREN] cleanup tombstones', {
      parentId,
      count: pushed.length,
    });

    for (const localChildId of pushed) {
      deletedChildIds.delete(localChildId);
    }

    await clearDeletedChildIds(parentId);
    if (deletedChildIds.size > 0) {
      // משחזר רק אם נשארו כאלה (בטיחות)
      await Promise.all(
        Array.from(deletedChildIds).map((id) =>
          // reuse API הקיים
          (async () => {
            // re-mark remaining tombstones
            // (simple + explicit, avoids partial state)
            const set = await getDeletedChildIds(parentId);
            set.add(id);
          })()
        )
      );
    }
  }
}
