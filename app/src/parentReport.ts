import { ParentReportStore, getDateIdLocal } from './storage/parentReportStore';
import type { DailyListenStats } from './storage/parentReportStore';

export type { DailyListenStats };

export const ParentReport = {
  listDays(childId: string) {
    return ParentReportStore.listDays(childId);
  },

  getDay(childId: string, dateId: string): DailyListenStats {
    return ParentReportStore.getDay(childId, dateId);
  },

  getToday(childId: string): DailyListenStats {
    const id = getDateIdLocal(new Date());
    return ParentReportStore.getDay(childId, id);
  },

  resetDay(childId: string, dateId?: string) {
    const id = dateId ?? getDateIdLocal(new Date());
    ParentReportStore.resetDay(childId, id);
  },

  resetAllForChild(childId: string) {
    ParentReportStore.resetAllForChild(childId);
  },
};
