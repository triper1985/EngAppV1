// src/i18n/types.ts
import type { ChildProfile, LevelId } from '../types';

export type Locale = 'he' | 'en';
export type Direction = 'rtl' | 'ltr';

export type LocaleContextValue = {
  locale: Locale;
  dir: Direction;
  levelId: LevelId;
};

export type TranslateParams = Record<string, string | number>;

export type TranslateFn = (key: string, params?: TranslateParams) => string;

export type ChildOrNull = ChildProfile | null;
