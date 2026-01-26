// src/i18n/i18n.ts
import type { Locale, TranslateFn, TranslateParams } from './types';
import { DICT_EN } from './dict.en';
import { DICT_HE } from './dict.he';
import { DICT_HE_NIQQUD } from './dict.heNiqqud';

const DICTS: Record<Locale, Record<string, string>> = {
  en: DICT_EN,
  he: DICT_HE,
};

type MakeTOptions = {
  /** Use Hebrew-with-Niqqud dictionary (child UI only) */
  niqqud?: boolean;
};

function format(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = params[key];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });
}

/**
 * Create translator for a locale.
 *
 * Behavior:
 * - Returns the key itself when missing (so callers can detect fallback needs).
 * - When niqqud is enabled and locale==='he', tries DICT_HE_NIQQUD first,
 *   then falls back to DICT_HE, then DICT_EN.
 */
export function makeT(locale: Locale, opts?: MakeTOptions): TranslateFn {
  const useNiqqud = locale === 'he' && !!opts?.niqqud;

  const dictPrimary = useNiqqud ? DICT_HE_NIQQUD : (DICTS[locale] ?? DICTS.en);

  return (key: string, params?: TranslateParams) => {
    const raw =
      dictPrimary[key] ??
      (useNiqqud ? DICT_HE[key] : undefined) ??
      DICTS.en[key] ??
      key;

    return format(raw, params);
  };
}
