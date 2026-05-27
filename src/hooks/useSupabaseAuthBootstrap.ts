import { useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';

import {
  exchangeSupabaseToken,
  getSupabaseSession,
  onSupabaseAuthStateChange,
} from '../api/auth';
import { useAuthStore } from '../store/authStore';

export function useSupabaseAuthBootstrap(): void {
  const lastSyncedAccessToken = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async (session: Session | null): Promise<void> => {
      if (!isMounted) {
        return;
      }

      if (!session) {
        lastSyncedAccessToken.current = null;
        useAuthStore.getState().clear();
        return;
      }

      if (lastSyncedAccessToken.current === session.access_token) {
        return;
      }

      lastSyncedAccessToken.current = session.access_token;

      try {
        const exchanged = await exchangeSupabaseToken(session.access_token);

        if (!isMounted) {
          return;
        }

        const { setBackendToken, setUser } = useAuthStore.getState();
        setBackendToken(exchanged.token);
        setUser(session.user);
      } catch {
        if (!isMounted) {
          return;
        }

        lastSyncedAccessToken.current = null;
        useAuthStore.getState().clear();
      }
    };

    getSupabaseSession()
      .then(syncSession)
      .catch(() => {
        if (isMounted) {
          useAuthStore.getState().clear();
        }
      });

    const { data } = onSupabaseAuthStateChange((_event, session) => {
      syncSession(session).catch(() => {
        if (isMounted) {
          useAuthStore.getState().clear();
        }
      });
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);
}
