//src/types.ts
export type Screen =
  | 'home'
  | 'childHub'
  | 'game'
  | 'parent'
  | 'learnUnits'
  | 'unitLearn'
  | 'unitQuiz';

export type LevelId = 'beginner' | 'explorer' | 'hero';

export type ChildProfile = {
  id: string;
  name: string;
  iconId?: string;

  // ✅ V11.4 — per-child audio (optional override on top of global parent settings)
  audioProfile?: {
    mode: 'global' | 'override';
    override?: {
      ttsEnabled?: boolean;
      ttsSpeed?: 'slow' | 'normal';
      voiceId?: string;
      fxEnabled?: boolean;
    };
  };

  /**
   * Packs שהילד "בחר"/הפעיל (Enabled).
   * NOTE: נשמר בשם הזה כדי לא לשבור קוד קיים.
   */
  selectedPackIds?: string[];

  /**
   * Packs מועדפים (Favorite) — תמיד subset של enabled.
   * (תשתיתי בלבד; בלי UI)
   */
  favoritePackIds?: string[];

  /**
   * Pack פעיל (Active) — חייב להיות enabled.
   * (תשתיתי בלבד; בלי UI)
   */
  activePackId?: string;

  coins?: number;
  levelId?: LevelId;
  unlockedIconIds?: string[];

  // optional legacy (icon shop)
  ownedIconIds?: string[];

  beginnerProgress?: {
    units: Record<
      string,
      {
        unitId?: string;
        seenItemIds: string[];
        masteredItemIds?: string[];
        lastQuizScore?: number;
        bestQuizScore?: number;
        quizAttemptsToday?: number;
        quizLockedUntilDateId?: string; // "YYYY-MM-DD"
      }
    >;
  };
};
