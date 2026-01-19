// src/i18n/i18n.ts
import type { Locale, TranslateFn, TranslateParams } from './types';
import { DICT_EN } from './dict.en';
import { DICT_HE } from './dict.he';

const DICTS: Record<Locale, Record<string, string>> = {
  en: DICT_EN,
  he: DICT_HE,
};

function format(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = params[key];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });
}

export function makeT(locale: Locale): TranslateFn {
  const dict = DICTS[locale] ?? DICTS.en;
  return (key: string, params?: TranslateParams) => {
    const raw = dict[key] ?? DICTS.en[key] ?? key;
    return format(raw, params);
  };
}
