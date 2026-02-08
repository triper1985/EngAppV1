// src/storage/childrenStore.ts
import type { ChildProfile, LevelId } from '../types';
import { makeEmptyBeginnerProgress } from '../tracks/beginnerTrack';
import {
  FREE_DEFAULT_ICON_IDS,
  getIconPrice,
  isIconFree,
} from '../data/iconShop';

import { listBuiltInPacks } from '../content/registry';
import { makeDevMaxBeginnerProgress } from '../tracks/devTools';

// NOTE: On Web we can use localStorage (sync). On React Native, we persist to
// AsyncStorage (async). To keep the rest of the app simple, we keep a cached
// in-memory store and write-through in the background.
//
// Install (recommended):
//   npx expo install @react-native-async-storage/async-storage

type SyncStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

type AsyncStorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

const memoryStorage = (() => {
  const mem: Record<string, string> = {};
  const api: SyncStorage = {
    getItem: (k) =>
      Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null,
    setItem: (k, v) => {
      mem[k] = v;
    },
    removeItem: (k) => {
      delete mem[k];
    },
  };
  return api;
})();

const webLocalStorage: SyncStorage | null = (globalThis as any)?.localStorage
  ? ((globalThis as any).localStorage as SyncStorage)
  : null;

let asyncStorage: AsyncStorageLike | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  asyncStorage = require('@react-native-async-storage/async-storage').default as AsyncStorageLike;
} catch {
  asyncStorage = null;
}

const storage: SyncStorage = webLocalStorage ?? memoryStorage;

const LS_KEY = 'english_children_v1';

type Store = {
  version: 1;
  children: ChildProfile[];
};

let cachedStore: Store | null = null;
let hasHydrated = false;
let hydratePromise: Promise<void> | null = null;

async function hydrateFromAsyncStorage(): Promise<void> {
  if (!asyncStorage) return;
  if (hasHydrated) return;
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    try {
      const raw = await asyncStorage!.getItem(LS_KEY);
      if (!raw) {
        cachedStore = { version: 1, children: [] };
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && Array.isArray(parsed.children)) {
        cachedStore = parsed as Store;
      } else {
        cachedStore = { version: 1, children: [] };
      }
    } catch {
      cachedStore = { version: 1, children: [] };
    } finally {
      hasHydrated = true;
    }
  })();

  return hydratePromise;
}

function loadStore(): Store {
  // If we already have an in-memory cache (native or after first save), use it.
  if (cachedStore) return cachedStore;

  const raw = storage.getItem(LS_KEY);
  if (!raw) return { version: 1, children: [] };

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && Array.isArray(parsed.children))
      return parsed as Store;
    return { version: 1, children: [] };
  } catch {
    return { version: 1, children: [] };
  }
}

function saveStore(store: Store) {
  cachedStore = store;

  // Web: sync localStorage
  if (webLocalStorage) {
    webLocalStorage.setItem(LS_KEY, JSON.stringify(store));
    return;
  }

  // Native: async write-through (best effort)
  if (asyncStorage) {
    void asyncStorage.setItem(LS_KEY, JSON.stringify(store));
    return;
  }

  // Fallback: in-memory only
  storage.setItem(LS_KEY, JSON.stringify(store));
}

function ensureUnlockedIcons(child: ChildProfile): ChildProfile {
  const set = new Set<string>(child.unlockedIconIds ?? []);

  // add free defaults
  for (const id of FREE_DEFAULT_ICON_IDS) set.add(String(id));

  // ensure selected icon is also unlocked
  const iconId =
    typeof child.iconId === 'string' && child.iconId.trim()
      ? child.iconId
      : FREE_DEFAULT_ICON_IDS[0];
  set.add(String(iconId));

  return {
    ...child,
    iconId,
    unlockedIconIds: Array.from(set.values()),
  };
}

function getChildIndex(store: Store, id: string) {
  return store.children.findIndex((c) => c.id === id);
}

function getChildOrNull(store: Store, id: string): ChildProfile | null {
  return store.children.find((c) => c.id === id) ?? null;
}

function upsertInStore(store: Store, child: ChildProfile) {
  const fixed = ensureUnlockedIcons(child);
  const idx = getChildIndex(store, fixed.id);
  if (idx >= 0) store.children[idx] = fixed;
  else store.children.push(fixed);
  return fixed;
}

function updateChild(
  store: Store,
  id: string,
  fn: (c: ChildProfile) => ChildProfile
): ChildProfile | null {
  const idx = getChildIndex(store, id);
  if (idx < 0) return null;
  const next = fn(store.children[idx]);
  store.children[idx] = next;
  return next;
}

function ensureChildDefaults(c: any): { next: ChildProfile; changed: boolean } {
  let changed = false;
  const next: any = { ...c };

  // selected packs: must exist and include 'basic'
  if (
    !Array.isArray(next.selectedPackIds) ||
    next.selectedPackIds.length === 0
  ) {
    next.selectedPackIds = ['basic'];
    changed = true;
  } else {
    const set = new Set(next.selectedPackIds);
    if (!set.has('basic')) {
      set.add('basic');
      next.selectedPackIds = Array.from(set.values());
      changed = true;
    }
  }

  // pack favorites (optional)
  if (!Array.isArray(next.favoritePackIds)) {
    next.favoritePackIds = [];
    changed = true;
  }

  // active pack (optional): must be enabled
  const enabled = Array.isArray(next.selectedPackIds)
    ? next.selectedPackIds
    : [];
  if (
    typeof next.activePackId !== 'string' ||
    !enabled.includes(next.activePackId)
  ) {
    next.activePackId = enabled[0] ?? 'basic';
    changed = true;
  }

  // coins
  if (typeof next.coins !== 'number') {
    next.coins = 0;
    changed = true;
  }

  // level
  if (!next.levelId) {
    next.levelId = 'beginner';
    changed = true;
  }

  // beginnerProgress
  if (!next.beginnerProgress || !next.beginnerProgress.units) {
    next.beginnerProgress = makeEmptyBeginnerProgress();
    changed = true;
  }

  // ✅ V11.4 per-child audio
  if (
    !next.audioProfile ||
    (next.audioProfile.mode !== 'global' &&
      next.audioProfile.mode !== 'override')
  ) {
    next.audioProfile = { mode: 'global' };
    changed = true;
  }

  const fixed = ensureUnlockedIcons(next as ChildProfile);

  // keep favorites subset of enabled (safety/migration)
  const enabledSet = new Set<string>(fixed.selectedPackIds ?? []);
  const fav = new Set<string>(fixed.favoritePackIds ?? []);
  let favChanged = false;
  for (const id of Array.from(fav.values())) {
    if (!enabledSet.has(id)) {
      fav.delete(id);
      favChanged = true;
    }
  }
  if (favChanged) {
    changed = true;
    (fixed as any).favoritePackIds = Array.from(fav.values());
  }

  // ensure active is enabled (safety/migration)
  if (
    typeof fixed.activePackId !== 'string' ||
    !enabledSet.has(fixed.activePackId)
  ) {
    changed = true;
    (fixed as any).activePackId = (fixed.selectedPackIds ?? [])[0] ?? 'basic';
  }

  return { next: fixed, changed };
}

async function clearStore(): Promise<void> {
  try {
    // ניקוי persistence
    if (asyncStorage) {
      await asyncStorage.removeItem(LS_KEY);
    } else {
      storage.removeItem(LS_KEY);
    }

    // ניקוי cache בזיכרון
    cachedStore = { version: 1, children: [] };

    // איפוס מצב hydrate (כאילו התקנה חדשה)
    hasHydrated = false;
    hydratePromise = null;
  } catch (e) {
    console.warn('[ChildrenStore] clear failed', e);
  }
}



export const ChildrenStore = {
  /**
   * ✅ Native persistence
   * Call once on app start to hydrate from AsyncStorage (RN).
   * Web does not need this.
   */
  async hydrate(): Promise<void> {
    await hydrateFromAsyncStorage();

    // After hydration, ensure defaults/migrations are applied once.
    if (cachedStore) {
      let changed = false;
      cachedStore.children = cachedStore.children.map((c) => {
        const res = ensureChildDefaults(c);
        if (res.changed) changed = true;
        return res.next;
      });
      if (changed) saveStore(cachedStore);
    }
  },

  list(): ChildProfile[] {
    // Return a new array reference so React state updates reliably
    // even when the underlying store mutates in-place.
    return [...loadStore().children];
  },

  getById(id: string): ChildProfile | null {
    return loadStore().children.find((c) => c.id === id) ?? null;
  },

  setLevelId(childId: string, levelId: LevelId): ChildProfile | null {
    const store = loadStore();
    const updated = updateChild(store, childId, (c) => ({
      ...c,
      levelId,
    }));
    if (!updated) return null;
    saveStore(store);
    return updated;
  },

  add(name: string): ChildProfile | null {
    const store = loadStore();

    const normalized = name.trim();
    if (!normalized) return null;

    const exists = store.children.some(
      (c) => String(c.name).trim().toLowerCase() === normalized.toLowerCase()
    );
    if (exists) return null;

    // id יציב-ish מהשם + הבטחת ייחודיות
    const base =
      normalized
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'child';

    let id = base;
    let n = 2;
    while (store.children.some((c) => c.id === id)) {
      id = `${base}-${n++}`;
    }

    const created = ensureUnlockedIcons({
      id,
      name: normalized,
      iconId: FREE_DEFAULT_ICON_IDS[0],
      selectedPackIds: ['basic'],
      favoritePackIds: [],
      activePackId: 'basic',
      coins: 0,
      levelId: 'beginner' as LevelId,
      beginnerProgress: makeEmptyBeginnerProgress(),
      unlockedIconIds: [...FREE_DEFAULT_ICON_IDS],
    });

    store.children.push(created);
    saveStore(store);
    return created;
  },

  /**
   * DEV: create a child that has:
   * - all built-in packs enabled
   * - max coins
   * - all beginner units completed (progress filled)
   */
  addDevAllUnlocked(): ChildProfile {
    const store = loadStore();

    const allPackIds = listBuiltInPacks().map((p) => p.id);
    const enabled = new Set<string>(allPackIds);
    enabled.add('basic'); // safety

    const base = 'dev-all';
    let id = base;
    let n = 2;
    while (store.children.some((c) => c.id === id)) {
      id = `${base}-${n++}`;
    }

    const enabledIds = Array.from(enabled.values());

    const created = ensureUnlockedIcons({
      id,
      name: `DEV All (${store.children.length + 1})`,
      iconId: FREE_DEFAULT_ICON_IDS[0],
      selectedPackIds: enabledIds,
      favoritePackIds: [],
      activePackId: enabledIds.includes('basic') ? 'basic' : enabledIds[0] ?? 'basic',
      coins: 9999,
      levelId: 'beginner' as LevelId,
      beginnerProgress: makeDevMaxBeginnerProgress(),
      unlockedIconIds: [...FREE_DEFAULT_ICON_IDS],
    });

    store.children.push(created);
    saveStore(store);
    return created;
  },

  rename(childId: string, nextName: string): boolean {
    const store = loadStore();
    const name = nextName.trim();
    if (!name) return false;

    const existsOther = store.children.some(
      (c) =>
        c.id !== childId &&
        String(c.name).trim().toLowerCase() === name.toLowerCase()
    );
    if (existsOther) return false;

    const updated = updateChild(store, childId, (c) => ({ ...c, name }));
    if (!updated) return false;

    saveStore(store);
    return true;
  },

  addCoins(childId: string, delta: number): ChildProfile | null {
    const store = loadStore();
    const d = Number(delta);
    if (!Number.isFinite(d) || d === 0) return this.getById(childId);

    const updated = updateChild(store, childId, (c) => ({
      ...c,
      coins: Math.max(0, (c.coins ?? 0) + d),
    }));
    if (!updated) return null;

    saveStore(store);
    return updated;
  },

  setActiveIcon(
    childId: string,
    iconId: string
  ): { ok: true } | { ok: false; reason: 'not_found' | 'not_unlocked' } {
    const store = loadStore();
    const child = getChildOrNull(store, childId);
    if (!child) return { ok: false, reason: 'not_found' };

    const unlocked = new Set<string>(child.unlockedIconIds ?? []);
    if (!unlocked.has(iconId) && !isIconFree(iconId))
      return { ok: false, reason: 'not_unlocked' };

    const updated = updateChild(store, childId, (c) => ({
      ...c,
      iconId,
      unlockedIconIds: Array.from(
        new Set([...(c.unlockedIconIds ?? []), iconId]).values()
      ),
    }));
    if (!updated) return { ok: false, reason: 'not_found' };

    saveStore(store);
    return { ok: true };
  },

  // Packs (enabled/favorites) – Content Foundation hooks (Opt-in)
  getEnabledPackIds(childId: string): string[] {
    const child = this.getById(childId);
    if (!child) return [];
    return Array.isArray(child.selectedPackIds) ? child.selectedPackIds : [];
  },

  getFavoritePackIds(childId: string): string[] {
    const child = this.getById(childId);
    if (!child) return [];
    return Array.isArray(child.favoritePackIds) ? child.favoritePackIds : [];
  },

  getActivePackId(childId: string): string | null {
    const child = this.getById(childId);
    if (!child) return null;
    return typeof child.activePackId === 'string' ? child.activePackId : null;
  },

  setPackEnabled(
    childId: string,
    packId: string,
    enabled: boolean
  ): ChildProfile | null {
    const store = loadStore();
    const updated = updateChild(store, childId, (c) => {
      const current = new Set<string>(c.selectedPackIds ?? []);
      // basic must always stay enabled
      if (packId === 'basic' && enabled === false) return c;

      if (enabled) current.add(packId);
      else current.delete(packId);

      const nextEnabled = Array.from(current.values());
      // always ensure basic
      if (!current.has('basic')) nextEnabled.unshift('basic');

      // adjust favorites: favorites should be subset of enabled
      const fav = new Set<string>(c.favoritePackIds ?? []);
      if (!enabled) fav.delete(packId);
      for (const f of Array.from(fav.values())) {
        if (!current.has(f)) fav.delete(f);
      }

      // adjust active pack: must be enabled
      let active = c.activePackId;
      if (typeof active !== 'string' || !current.has(active)) {
        active = nextEnabled[0] ?? 'basic';
      }

      return {
        ...c,
        selectedPackIds: nextEnabled,
        favoritePackIds: Array.from(fav.values()),
        activePackId: active,
      };
    });

    if (!updated) return null;
    saveStore(store);
    return updated;
  },

  togglePackFavorite(childId: string, packId: string): ChildProfile | null {
    const store = loadStore();
    const updated = updateChild(store, childId, (c) => {
      const enabled = new Set<string>(c.selectedPackIds ?? []);
      // only enabled packs can be favorited (keeps model simple)
      if (!enabled.has(packId)) return c;

      const fav = new Set<string>(c.favoritePackIds ?? []);
      if (fav.has(packId)) fav.delete(packId);
      else fav.add(packId);

      return {
        ...c,
        favoritePackIds: Array.from(fav.values()),
      };
    });

    if (!updated) return null;
    saveStore(store);
    return updated;
  },

  setActivePack(childId: string, packId: string): ChildProfile | null {
    const store = loadStore();
    const updated = updateChild(store, childId, (c) => {
      const enabled = new Set<string>(c.selectedPackIds ?? []);
      if (!enabled.has(packId)) return c;
      return { ...c, activePackId: packId };
    });

    if (!updated) return null;
    saveStore(store);
    return updated;
  },

  upsert(child: ChildProfile): ChildProfile {
    const store = loadStore();

    const { next, changed } = ensureChildDefaults(child);

    const saved = upsertInStore(store, next);

    // keep behavior, always persist
    if (changed) saveStore(store);
    else saveStore(store);

    return saved;
  },

  remove(id: string) {
    const store = loadStore();
    store.children = store.children.filter((c) => c.id !== id);
    saveStore(store);
  },

  ensureDefaultsForAll() {
    const store = loadStore();
    let changed = false;

    store.children = store.children.map((c) => {
      const res = ensureChildDefaults(c);
      if (res.changed) changed = true;
      return res.next;
    });

    if (changed) saveStore(store);
  },

  ensureDefaultsIfEmpty() {
  const store = loadStore();

  if (store.children.length === 0) {
    // ❌ אין יותר יצירת ילד ברירת־מחדל
    return;
  }

  this.ensureDefaultsForAll();
},


  setSelectedIcon(childId: string, iconId: string) {
    const store = loadStore();
    const child = getChildOrNull(store, childId);
    if (!child) return false;

    const unlocked = new Set<string>(child.unlockedIconIds ?? []);
    if (!unlocked.has(iconId) && !isIconFree(iconId)) return false;

    const updated = updateChild(store, childId, (c) => ({
      ...c,
      iconId,
      unlockedIconIds: Array.from(
        new Set([...(c.unlockedIconIds ?? []), iconId]).values()
      ),
    }));
    if (!updated) return false;

    saveStore(store);
    return true;
  },

  buyIcon(childId: string, iconId: string) {
    const store = loadStore();
    const child = getChildOrNull(store, childId);
    if (!child) return { ok: false as const, reason: 'not_found' as const };

    if (isIconFree(iconId)) {
      const updated = updateChild(store, childId, (c) => ({
        ...c,
        unlockedIconIds: Array.from(
          new Set([...(c.unlockedIconIds ?? []), iconId]).values()
        ),
        iconId,
      }));
      if (!updated) return { ok: false as const, reason: 'not_found' as const };
      saveStore(store);
      return { ok: true as const, child: updated, price: 0 };
    }

    const price = getIconPrice(iconId);
    const coins = child.coins ?? 0;

    if (coins < price)
      return { ok: false as const, reason: 'not_enough_coins' as const };

    const updated = updateChild(store, childId, (c) => {
      const unlocked = new Set<string>(c.unlockedIconIds ?? []);
      unlocked.add(iconId);

      return {
        ...c,
        coins: (c.coins ?? 0) - price,
        unlockedIconIds: Array.from(unlocked.values()),
        iconId, // buy = auto select
      };
    });

    if (!updated) return { ok: false as const, reason: 'not_found' as const };

    saveStore(store);
    return { ok: true as const, child: updated, price };
  },
  clear: clearStore,

};
