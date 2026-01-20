// src/parentPin.ts
// RN-safe Parent PIN store with a sync API (ParentGate-friendly).
// Uses AsyncStorage if available; falls back to in-memory cache (no crash).

const LS_KEY = 'english_parent_pin_v1';
const DEFAULT_PIN = '1234';

type Store = {
  version: 1;
  pin: string; // digits only
};

// ---- Storage bridge (AsyncStorage if present) ----
let AsyncStorage: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorage = require('@react-native-async-storage/async-storage')?.default ?? null;
} catch {
  AsyncStorage = null;
}

function hasWebLocalStorage(): boolean {
  try {
    // @ts-expect-error - global may exist on web only
    return typeof localStorage !== 'undefined' && !!localStorage?.getItem;
  } catch {
    return false;
  }
}

// ---- In-memory cache (sync reads) ----
let cache: Store = { version: 1, pin: DEFAULT_PIN };
let hydrated = false;
let hydrating = false;

function normalizePin(pin: string): string {
  return String(pin).replace(/\D/g, '').slice(0, 8); // digits only, max 8
}

function parseStore(raw: string | null): Store {
  if (!raw) return { version: 1, pin: DEFAULT_PIN };
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && typeof parsed.pin === 'string') {
      return { version: 1, pin: normalizePin(String(parsed.pin)) || DEFAULT_PIN };
    }
    return { version: 1, pin: DEFAULT_PIN };
  } catch {
    return { version: 1, pin: DEFAULT_PIN };
  }
}

function scheduleHydrateIfNeeded() {
  if (hydrated || hydrating) return;
  hydrating = true;

  // Web: localStorage sync
  if (hasWebLocalStorage()) {
    try {
      // @ts-expect-error - web only
      const raw = localStorage.getItem(LS_KEY);
      cache = parseStore(raw);
    } catch {
      // ignore
    } finally {
      hydrated = true;
      hydrating = false;
    }
    return;
  }

  // RN: AsyncStorage async -> hydrate cache when ready
  if (AsyncStorage?.getItem) {
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(LS_KEY);
        cache = parseStore(raw);
      } catch {
        // ignore
      } finally {
        hydrated = true;
        hydrating = false;
      }
    })();
    return;
  }

  // No storage available: just mark hydrated (keep default in memory)
  hydrated = true;
  hydrating = false;
}

function persist(store: Store) {
  cache = store;

  // Web
  if (hasWebLocalStorage()) {
    try {
      // @ts-expect-error - web only
      localStorage.setItem(LS_KEY, JSON.stringify(store));
    } catch {
      // ignore
    }
    return;
  }

  // RN
  if (AsyncStorage?.setItem) {
    void (async () => {
      try {
        await AsyncStorage.setItem(LS_KEY, JSON.stringify(store));
      } catch {
        // ignore
      }
    })();
  }
}

function readStoreSync(): Store {
  scheduleHydrateIfNeeded();
  return cache;
}

// ---- Public API (what screens / gate use) ----

/** Does a pin exist (>= 4 digits)? */
export function hasParentPin(): boolean {
  const s = readStoreSync();
  return normalizePin(s.pin).length >= 4;
}

/** For ParentGate / verification */
export function verifyParentPin(input: string): boolean {
  const s = readStoreSync();
  return normalizePin(input) === normalizePin(s.pin);
}

/** Back-compat: some older code used checkParentPin */
export function checkParentPin(input: string): boolean {
  return verifyParentPin(input);
}

/** Get current pin (for display if needed) */
export function getParentPin(): string {
  return readStoreSync().pin;
}

/** Set new pin (min 4 digits). Returns true on success. */
export function setParentPin(newPin: string): boolean {
  const pin = normalizePin(newPin);
  if (pin.length < 4) return false;

  persist({ version: 1, pin });
  return true;
}

/** Clear pin (we reset to default to keep app behavior stable). */
export function clearParentPin() {
  persist({ version: 1, pin: DEFAULT_PIN });
}

/** Back-compat: older name */
export function resetParentPin() {
  clearParentPin();
}
