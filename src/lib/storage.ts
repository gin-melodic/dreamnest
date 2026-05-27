import { createMMKV } from 'react-native-mmkv';

export const AUTH_TOKEN_KEY = 'auth_token';
export const DREAM_CACHE_KEY = 'dream_result_cache';

export const storage = createMMKV({
  id: 'dreamnest',
});

export function getString(key: string): string | null {
  return storage.getString(key) ?? null;
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function removeValue(key: string): void {
  storage.remove(key);
}

export function getAuthToken(): string | null {
  return getString(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  setString(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  removeValue(AUTH_TOKEN_KEY);
}
