// src/storage/parentOwner.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'english_parent_owner_v1';

export async function getDeviceParentId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export async function setDeviceParentId(parentId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, parentId);
  } catch {}
}

export async function clearDeviceParentId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}
