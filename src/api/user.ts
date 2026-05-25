import http from '../lib/http';
import type { SupportedLanguage } from '../types/i18n';

export type AuthProvider = 'email' | 'wechat';

export type UserInfo = {
  id: number;
  openId?: string;
  supabaseUid?: string;
  authProvider: AuthProvider;
  email?: string;
  nickname?: string;
  avatar?: string;
  mobile?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GetUserInfoResponse = {
  user_info: UserInfo;
};

export type UpdateUserInfoRequest = {
  nickname?: string;
  avatar?: string;
  mobile?: string;
  language?: SupportedLanguage;
};

export type UpdateUserInfoResponse = {
  user_info: UserInfo;
};

export type PrivacyMode = 'private' | 'cloud_sync';

export type UserSettings = {
  language: SupportedLanguage;
  privacyMode: PrivacyMode;
  dreamReminderEnabled: boolean;
  dreamReminderTime?: string;
  storageMode: 'local_cache' | 'cloud_sync';
};

export type UpdateUserSettingsRequest = Partial<UserSettings>;

export type ArchetypeKey = 'self' | 'persona' | 'shadow' | 'anima' | 'sage';

export type ArchetypeProfileItem = {
  key: ArchetypeKey;
  title: string;
  description: string;
  ratio: number;
  color: string;
};

export type PsycheProfile = {
  integrationScore: number;
  integrationLevel: 'low' | 'moderate' | 'high';
  integrationDescription: string;
  archetypes: ArchetypeProfileItem[];
  dominantArchetype: ArchetypeKey;
  updatedAt: string;
};

export function getUserInfo(): Promise<GetUserInfoResponse> {
  return http.get<unknown, GetUserInfoResponse>('/v1/user/info');
}

export function updateUserInfo(
  payload: UpdateUserInfoRequest,
): Promise<UpdateUserInfoResponse> {
  return http.put<unknown, UpdateUserInfoResponse>('/v1/user/info', payload);
}

export function getUserSettings(): Promise<UserSettings> {
  return http.get<unknown, UserSettings>('/v1/user/settings');
}

export function updateUserSettings(
  payload: UpdateUserSettingsRequest,
): Promise<UserSettings> {
  return http.put<unknown, UserSettings>('/v1/user/settings', payload);
}

export function getPsycheProfile(): Promise<PsycheProfile> {
  return http.get<unknown, PsycheProfile>('/v1/user/psyche-profile');
}
