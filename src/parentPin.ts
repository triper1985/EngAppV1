const LS_KEY = 'english_parent_pin_v1';

type Store = {
  version: 1;
  pin: string; // digits only
};

function loadStore(): Store {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return { version: 1, pin: '1234' }; // default pin

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && typeof parsed.pin === 'string') {
      return { version: 1, pin: String(parsed.pin) };
    }
    return { version: 1, pin: '1234' };
  } catch {
    return { version: 1, pin: '1234' };
  }
}

function saveStore(store: Store) {
  localStorage.setItem(LS_KEY, JSON.stringify(store));
}

function normalizePin(pin: string): string {
  return String(pin).replace(/\D/g, '').slice(0, 8); // digits only, max 8
}

/**
 * ✅ what ParentGate uses:
 * checkParentPin(input) -> true/false
 */
export function checkParentPin(input: string): boolean {
  const store = loadStore();
  return normalizePin(input) === normalizePin(store.pin);
}

/**
 * Get current pin (for parent dashboard display if needed)
 */
export function getParentPin(): string {
  return loadStore().pin;
}

/**
 * Set new pin
 */
export function setParentPin(newPin: string): boolean {
  const pin = normalizePin(newPin);
  if (pin.length < 4) return false; // minimum 4 digits

  const store = loadStore();
  store.pin = pin;
  saveStore(store);
  return true;
}

/**
 * Reset to default
 */
export function resetParentPin() {
  saveStore({ version: 1, pin: '1234' });
}
