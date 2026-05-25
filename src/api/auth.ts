import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

import http from '../lib/http';
import { supabase } from '../lib/supabase';
import type { UserInfo } from './user';

export type SupabaseCredentials = {
  email: string;
  password: string;
};

export type SupabaseAuthResult = {
  user: User;
  session: Session;
};

export type ExchangeSupabaseTokenRequest = {
  supabase_token: string;
};

export type ExchangeSupabaseTokenResponse = {
  token: string;
  user_info: UserInfo;
};

export async function signInWithEmail(
  credentials: SupabaseCredentials,
): Promise<SupabaseAuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    throw error;
  }

  if (!data.user || !data.session) {
    throw new Error('Supabase did not return an authenticated session');
  }

  return {
    user: data.user,
    session: data.session,
  };
}

export async function signUpWithEmail(
  credentials: SupabaseCredentials,
): Promise<SupabaseAuthResult> {
  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    throw error;
  }

  if (!data.user || !data.session) {
    throw new Error('Supabase sign-up requires email confirmation');
  }

  return {
    user: data.user,
    session: data.session,
  };
}

export async function getSupabaseSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function exchangeSupabaseToken(
  supabaseToken: string,
): Promise<ExchangeSupabaseTokenResponse> {
  return http.post<unknown, ExchangeSupabaseTokenResponse>('/v1/email/auth', {
    supabase_token: supabaseToken,
  } satisfies ExchangeSupabaseTokenRequest);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export function onSupabaseAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return supabase.auth.onAuthStateChange(callback);
}
