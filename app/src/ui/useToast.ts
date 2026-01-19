// src/ui/useToast.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast(defaultDurationMs = 1800) {
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (msg: string, durationMs?: number) => {
      setToast(msg);

      if (timerRef.current) clearTimeout(timerRef.current);

      const ms =
        typeof durationMs === 'number' ? durationMs : defaultDurationMs;
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, ms);
    },
    [defaultDurationMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast, clearToast };
}
