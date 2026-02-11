//src/data/sync/syncPushNewChildren.ts
import { ChildrenStore } from '../../storage/childrenStore';
import { ensureRemoteChild, getRemoteChildId } from './childIdMap';
import { supabase } from '../../supabase/client';

export async function syncPushNewChildren(opts: {
  parentId: string;
}) {
  const { parentId } = opts;
    const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== parentId) {
    console.warn('[SYNC][PUSH][CHILDREN] skip – no valid session', {
      parentId,
    });
    return { pushed: 0 };
  }
    let pushed = 0;

  for (const child of ChildrenStore.list()) {
    console.log('[SYNC][PUSH][CHILDREN] local child snapshot', {
      parentId,
      localChildId: child.id,
      localName: child.name,
    });

    const remoteId = await getRemoteChildId(child.id);

    if (remoteId) {
      console.log('[SYNC][PUSH][CHILDREN] skip – already mapped', {
        parentId,
        localChildId: child.id,
        remoteChildId: remoteId,
      });
      continue; // כבר קיים בענן
    }

    console.log('[SYNC][PUSH][CHILDREN] creating remote child', {
      parentId,
      localChildId: child.id,
      localName: child.name,
      source: 'syncPushNewChildren',
    });

console.log('[SYNC][PUSH][CHILDREN] creating remote child', {
  parentId,
  localChildId: child.id,
  localName: child.name,
  source: 'syncPushNewChildren',
});

  const created = await ensureRemoteChild({
    localChildId: child.id,
    parentId,
    displayName: child.name, // ✅ חדש
  });

  if (created) {
    console.log('[SYNC][PUSH][CHILDREN] remote child created', {
      parentId,
      localChildId: child.id,
      remoteChildId: created,
    });
    pushed++;
  }

  }

  if (pushed > 0) {

    console.log('[SYNC][PUSH][CHILDREN] pushed', pushed);
  }

  return { pushed };
}
