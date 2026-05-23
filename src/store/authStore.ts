import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { clearAuthToken, getAuthToken, setAuthToken } from '../lib/storage';

type AuthState = {
  user: User | null;
  backendToken: string | null;
  setUser: (user: User | null) => void;
  setBackendToken: (token: string | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  backendToken: getAuthToken(),
  setUser: (user: User | null): void => {
    set({ user });
  },
  setBackendToken: (token: string | null): void => {
    if (token) {
      setAuthToken(token);
    } else {
      clearAuthToken();
    }

    set({ backendToken: token });
  },
  clear: (): void => {
    clearAuthToken();
    set({ user: null, backendToken: null });
  },
}));
