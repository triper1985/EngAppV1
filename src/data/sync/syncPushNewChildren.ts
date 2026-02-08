import { ChildrenStore } from '../../storage/childrenStore';
import { ensureRemoteChild, getRemoteChildId } from './childIdMap';

export async function syncPushNewChildren(opts: {
  parentId: string;
}) {
  const { parentId } = opts;

  let pushed = 0;

  for (const child of ChildrenStore.list()) {
    const remoteId = await getRemoteChildId(child.id);

    if (remoteId) continue; // כבר קיים בענן

    const created = await ensureRemoteChild({
      localChildId: child.id,
      parentId,
    });

    if (created) {
      pushed++;
    }
  }

  if (pushed > 0) {
    console.log('[SYNC][PUSH][CHILDREN] pushed', pushed);
  }

  return { pushed };
}
