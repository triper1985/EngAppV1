// src/i18n/I18nContext.tsx
import { createContext, useContext, useMemo } from 'react';
import type {
  ChildOrNull,
  Direction,
  Locale,
  LocaleContextValue,
  TranslateFn,
} from './types';
import { resolveLocaleContext } from './localeResolver';
import { makeT } from './i18n';

export type I18nValue = LocaleContextValue & {
  t: TranslateFn;
};

const I18nContext = createContext<I18nValue | null>(null);

function defaultDir(locale: Locale): Direction {
  return locale === 'he' ? 'rtl' : 'ltr';
}

export function I18nProvider({
  child,
  forcedLocale,
  children,
}: {
  child: ChildOrNull;
  /**
   * When set, overrides locale/dir (used for Parent Mode UI)
   */
  forcedLocale?: Locale;
  children: React.ReactNode;
}) {
  // ✅ include full child in deps to match usage inside resolveLocaleContext(child)
  const baseCtx = useMemo(() => resolveLocaleContext(child), [child]);

  const ctx: LocaleContextValue = useMemo(() => {
    if (!forcedLocale) return baseCtx;
    return {
      ...baseCtx,
      locale: forcedLocale,
      dir: defaultDir(forcedLocale),
    };
  }, [baseCtx, forcedLocale]);

  const tPrimary = useMemo(() => makeT(ctx.locale), [ctx.locale]);
  const tHeFallback = useMemo(() => makeT('he'), []);

  const t: TranslateFn = useMemo(() => {
    return (key, vars) => {
      const primary = tPrimary(key, vars);

      // Convention: if missing, makeT returns the key itself.
      if (primary === key && ctx.locale !== 'he') {
        const fallback = tHeFallback(key, vars);
        return fallback;
      }
      return primary;
    };
  }, [tPrimary, tHeFallback, ctx.locale]);

  // ✅ depend on ctx object itself (fixes missing dep warning for ctx)
  const value: I18nValue = useMemo(() => ({ ...ctx, t }), [ctx, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const v = useContext(I18nContext);
  if (!v) {
    // Safe fallback (should not happen): English LTR + HE fallback protection
    const fallback = resolveLocaleContext(null);
    const tPrimary = makeT(fallback.locale);
    const tHeFallback = makeT('he');
    const t: TranslateFn = (key, vars) => {
      const primary = tPrimary(key, vars);
      if (primary === key && fallback.locale !== 'he') {
        return tHeFallback(key, vars);
      }
      return primary;
    };
    return { ...fallback, t };
  }
  return v;
}
