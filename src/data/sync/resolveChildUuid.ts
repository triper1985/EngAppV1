// src/data/sync/resolveChildUuid.ts
import { supabase } from '../../supabase/client';

export async function resolveChildUuid(
  localChildId: string,
  parentUuid: string
): Promise<string> {
    console.log('[SYNC][RESOLVE][CHILD] start', {
    source: 'resolveChildUuid',
    parentUuid,
    localChildId,
  });
  const { data, error } = await supabase
    .from('children')
    .select('id')
    .eq('local_child_id', localChildId)
    .eq('parent_id', parentUuid)
    .single();

if (error || !data) {
  console.error('[SYNC][RESOLVE][CHILD] failed', {
    source: 'resolveChildUuid',
    parentUuid,
    localChildId,
    error,
  });
  throw new Error(`Child not found for local_child_id=${localChildId}`);
}

console.log('[SYNC][RESOLVE][CHILD] resolved', {
  source: 'resolveChildUuid',
  parentUuid,
  localChildId,
  remoteChildId: data.id,
});

  return data.id;
}
