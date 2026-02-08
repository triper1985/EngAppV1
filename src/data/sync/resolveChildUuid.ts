// src/data/sync/resolveChildUuid.ts
import { supabase } from '../../supabase/client';

export async function resolveChildUuid(
  localChildId: string,
  parentUuid: string
): Promise<string> {
  const { data, error } = await supabase
    .from('children')
    .select('id')
    .eq('local_child_id', localChildId)
    .eq('parent_id', parentUuid)
    .single();

  if (error || !data) {
    throw new Error(`Child not found for local_child_id=${localChildId}`);
  }

  return data.id;
}
