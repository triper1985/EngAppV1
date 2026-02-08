
// src/storage/parentReportStore.ts
export type SessionEntry = {
  sessionId: string;
  startedAt: number;
  endedAt?: number;
};

export type DailyListenStats = {
  dateId: string;
  hearCountByItemId: Record<string, number>;
  nextCountByItemId: Record<string, number>;
  skippedHearByItemId: Record<string, number>;
  totalHearClicks: number;
  totalNextClicks: number;
  sessions: SessionEntry[];
};

type Store = {
  version: 1;
  byChildId: Record<string, Record<string, DailyListenStats>>; // childId -> dateId -> stats
};

const LS_KEY = 'english_parent_report_v1';

// ✅ RN fallback (no localStorage)
let memStore: Store | null = null;

function hasLocalStorage(): boolean {
  try {
    const ls = (globalThis as any)?.localStorage;
    return !!ls && typeof ls.getItem === 'function' && typeof ls.setItem === 'function';
  } catch {
    return false;
  }
}

function readRaw(): string | null {
  if (!hasLocalStorage()) return null;
  try {
    return (globalThis as any).localStorage.getItem(LS_KEY);
  } catch {
    return null;
  }
}

function writeRaw(value: string) {
  if (!hasLocalStorage()) return;
  try {
    (globalThis as any).localStorage.setItem(LS_KEY, value);
  } catch {
    // ignore
  }
}

function loadStore(): Store {
  // ✅ RN: keep in memory (prevents crashes)
  if (!hasLocalStorage()) {
    if (!memStore) memStore = { version: 1, byChildId: {} };
    return memStore;
  }

  const raw = readRaw();
  if (!raw) return { version: 1, byChildId: {} };

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && parsed?.byChildId) return parsed as Store;
    return { version: 1, byChildId: {} };
  } catch {
    return { version: 1, byChildId: {} };
  }
}

function saveStore(s: Store) {
  // ✅ RN: update memory only
  if (!hasLocalStorage()) {
    memStore = s;
    return;
  }

  writeRaw(JSON.stringify(s));
}

export function getDateIdLocal(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function emptyDaily(dateId: string): DailyListenStats {
  return {
    dateId,
    hearCountByItemId: {},
    nextCountByItemId: {},
    skippedHearByItemId: {},
    totalHearClicks: 0,
    totalNextClicks: 0,
    sessions: [],
  };
}

export const ParentReportStore = {
  listDays(childId: string): string[] {
    const store = loadStore();
    const days = Object.keys(store.byChildId?.[childId] ?? {});
    return days.sort().reverse();
  },

  getDay(childId: string, dateId: string): DailyListenStats {
    const store = loadStore();
    const c = store.byChildId[childId] ?? {};
    return c[dateId] ?? emptyDaily(dateId);
  },

  upsertDay(childId: string, day: DailyListenStats) {
    const store = loadStore();
    store.byChildId[childId] = store.byChildId[childId] ?? {};
    store.byChildId[childId][day.dateId] = day;
    saveStore(store);
  },

  resetDay(childId: string, dateId: string) {
    const store = loadStore();
    store.byChildId[childId] = store.byChildId[childId] ?? {};
    store.byChildId[childId][dateId] = emptyDaily(dateId);
    saveStore(store);
  },

  resetAllForChild(childId: string) {
    const store = loadStore();
    delete store.byChildId[childId];
    saveStore(store);
  },
};
export function clearAllReports() {
  const store = loadStore();
  store.byChildId = {};
  saveStore(store);
}