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

function loadStore(): Store {
  const raw = localStorage.getItem(LS_KEY);
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
  localStorage.setItem(LS_KEY, JSON.stringify(s));
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
