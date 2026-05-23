import { createClient } from '@supabase/supabase-js';
import { NativeModules } from 'react-native';

import { getString, removeValue, setString } from './storage';

type NativeConfig = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

type SupabaseStorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const nativeConfig = NativeModules.RNCConfig as NativeConfig | undefined;

function getRequiredConfigValue(key: keyof NativeConfig): string {
  const value = nativeConfig?.[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

const supabaseStorage: SupabaseStorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    return getString(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    setString(key, value);
  },
  async removeItem(key: string): Promise<void> {
    removeValue(key);
  },
};

export const supabase = createClient(
  getRequiredConfigValue('SUPABASE_URL'),
  getRequiredConfigValue('SUPABASE_ANON_KEY'),
  {
    auth: {
      storage: supabaseStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
