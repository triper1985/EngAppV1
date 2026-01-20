// src/ui/useToast.ts
import { useCallback, useEffect, useRef, useState } from 'react';

type ToastApi = {
  toast: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
};

/**
 * Native-safe toast hook (simple text message).
 * Kept compatible with previous usage patterns:
 * - const { toast, showToast } = useToast(1800)
 */
export function useToast(durationMs = 1800): ToastApi {
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setToast(null);
  }, []);

  const showToast = useCallback(
    (msg: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast(msg);
      timerRef.current = setTimeout(() => setToast(null), durationMs);
    },
    [durationMs]
  );

  useEffect(() => () => clearToast(), [clearToast]);

  return { toast, showToast, clearToast };
}
