export type PackType = 'basic' | 'interest';

export interface ContentPack {
  id: string;
  type: PackType;
  title: string;
  icon: string;
  isBuiltIn: boolean;
  items: ContentItem[];
}

export interface ContentItem {
  id: string;
  packId: string;

  audioText: string;

  assist?: {
    hebrewHint?: string;
    slowRepeat?: boolean;
  };

  display: {
    type: 'icon';
    value: string;
  };

  difficulty: 1 | 2 | 3;
}

// -------------------------
// Legacy types (for older modules)
// -------------------------
// These are intentionally minimal: the current app logic uses ChildProfile and
// beginnerProgress in src/types.ts + tracks/*.
export type ChildUser = {
  id: string;
  name: string;
};

export type GameSession = {
  sessionId: string;
  userId: string;
  itemIds: string[];
  index: number;
  startedAt: number;
};

export type ProgressState = {
  // placeholder
  [key: string]: unknown;
};
