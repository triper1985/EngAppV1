// Game Engine Core
// Logic-only, UI-agnostic

import type {
  ChildUser,
  ContentItem,
  GameSession,
  ProgressState,
} from './schema';

export type GameResult = 'success' | 'mistake' | 'skip';

export interface GameEvent {
  itemId: string;
  result: GameResult;
}

export interface GameEngine {
  startSession(user: ChildUser, items: ContentItem[]): GameSession;

  getCurrentItem(session: GameSession): ContentItem;

  reportEvent(
    session: GameSession,
    event: GameEvent
  ): {
    updatedSession: GameSession;
    progressUpdate?: Partial<ProgressState>;
    shouldEndSession: boolean;
  };
}
