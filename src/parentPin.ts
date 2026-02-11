// src/parentPin.ts
// Parent PIN store – per parentId
// Stored locally (AsyncStorage), reset only per parent

import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_PIN = '1234';
const KEY_PREFIX = 'english_parent_pin_v1';

const pinKey = (parentId: string) => `${KEY_PREFIX}:${parentId}`;

function normalizePin(pin: string): string {
  return String(pin).replace(/\D/g, '').slice(0, 8);
}

/**
 * Does a PIN exist for this parent (>= 4 digits and not default)?
 */
export async function hasParentPin(parentId: string): Promise<boolean> {
  if (!parentId) return false;

  const raw = await AsyncStorage.getItem(pinKey(parentId));
  const pin = normalizePin(raw ?? '');
  return pin.length >= 4 && pin !== DEFAULT_PIN;
}

/**
 * Verify PIN for ParentGate
 */
export async function verifyParentPin(
  parentId: string,
  input: string
): Promise<boolean> {
  if (!parentId) return false;

  const raw = await AsyncStorage.getItem(pinKey(parentId));
  const saved = normalizePin(raw ?? DEFAULT_PIN);
  return normalizePin(input) === saved;
}

/**
 * Backwards compatibility
 */
export async function checkParentPin(
  parentId: string,
  input: string
): Promise<boolean> {
  return verifyParentPin(parentId, input);
}

/**
 * Set / change PIN (min 4 digits)
 */
export async function setParentPin(
  parentId: string,
  newPin: string
): Promise<boolean> {
  if (!parentId) return false;

  const pin = normalizePin(newPin);
  if (pin.length < 4) return false;

  await AsyncStorage.setItem(pinKey(parentId), pin);
  return true;
}

/**
 * Reset PIN for this parent only
 */
export async function resetParentPin(parentId: string): Promise<void> {
  if (!parentId) return;
  await AsyncStorage.removeItem(pinKey(parentId));
}
