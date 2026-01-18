// src/i18n/localeResolver.ts
import type {
  ChildOrNull,
  Direction,
  Locale,
  LocaleContextValue,
} from './types';
import type { LevelId } from '../types';

function normalizeLevelId(levelId: unknown): LevelId {
  if (levelId === 'beginner' || levelId === 'explorer' || levelId === 'hero') {
    return levelId;
  }
  // V5 choice: safe default for kids
  return 'beginner';
}

export function resolveLocaleContext(child: ChildOrNull): LocaleContextValue {
  const levelId = normalizeLevelId(child?.levelId);

  // Policy: level -> locale/dir
  const locale: Locale = levelId === 'beginner' ? 'he' : 'en';
  const dir: Direction = locale === 'he' ? 'rtl' : 'ltr';

  return { locale, dir, levelId };
}
