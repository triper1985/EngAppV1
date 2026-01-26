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
  /** When set, overrides locale/dir (used for Parent Mode UI) */
  forcedLocale?: Locale;
  children: React.ReactNode;
}) {
  const baseCtx = useMemo(() => resolveLocaleContext(child), [child]);

  const ctx: LocaleContextValue = useMemo(() => {
    if (!forcedLocale) return baseCtx;
    return {
      ...baseCtx,
      locale: forcedLocale,
      dir: defaultDir(forcedLocale),
    };
  }, [baseCtx, forcedLocale]);

  // ✅ Child UI only: Niqqud ON. Parent Mode (forcedLocale) => Niqqud OFF.
  const useNiqqud = !forcedLocale;

  const tPrimary = useMemo(
    () => makeT(ctx.locale, { niqqud: useNiqqud }),
    [ctx.locale, useNiqqud]
  );

  // Hebrew fallback should follow the same Niqqud rule (child screens get niqqud)
  const tHeFallback = useMemo(
    () => makeT('he', { niqqud: useNiqqud }),
    [useNiqqud]
  );

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

  const value: I18nValue = useMemo(() => ({ ...ctx, t }), [ctx, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const v = useContext(I18nContext);
  if (v) return v;

  // Safe fallback (should not happen): assume child-like defaults (niqqud ON)
  const fallback = resolveLocaleContext(null);
  const tPrimary = makeT(fallback.locale, { niqqud: true });
  const tHeFallback = makeT('he', { niqqud: true });

  const t: TranslateFn = (key, vars) => {
    const primary = tPrimary(key, vars);
    if (primary === key && fallback.locale !== 'he') {
      return tHeFallback(key, vars);
    }
    return primary;
  };

  return { ...fallback, t };
}
