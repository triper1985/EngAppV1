//src/screens/auth/AuthProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../supabase/client';
import { getDeviceParentId, setDeviceParentId } from '../../storage/parentOwner';
import { clearLocalDataForParentSwitch } from '../../parent/clearLocalData';

type AuthState = {
  isReady: boolean;
  session: Session | null;
  user: User | null;
};

const AuthContext = createContext<AuthState>({
  isReady: false,
  session: null,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setIsReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setIsReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
  if (!isReady) return;

  const currentParentId = session?.user?.id ?? null;

  if (!currentParentId) return;

  let cancelled = false;

  (async () => {
    const lastParentId = await getDeviceParentId();

    if (cancelled) return;

    if (lastParentId !== currentParentId) {
      console.log('[PARENT SWITCH]', lastParentId, '→', currentParentId);
      await clearLocalDataForParentSwitch();
      await setDeviceParentId(currentParentId);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [isReady, session?.user?.id]);


  const value = useMemo(
    () => ({ isReady, session, user: session?.user ?? null }),
    [isReady, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
