import { NativeModules } from 'react-native';
import { useSyncExternalStore } from 'react';

import type { LocaleKeys, SupportedLanguage } from '../types/i18n';
import { getString, setString } from './storage';
import { en } from './locales/en';
import { zhHans } from './locales/zh-Hans';
import { zhHant } from './locales/zh-Hant';

export const LANG_PREF_KEY = 'lang_pref';

type Listener = () => void;

const LOCALES: Record<SupportedLanguage, LocaleKeys> = {
  en,
  'zh-Hant': zhHant,
  'zh-Hans': zhHans,
};

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'zh-Hant', 'zh-Hans'];
const listeners = new Set<Listener>();

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

function getDeviceLocaleIdentifier(): string | null {
  const nativeI18n = NativeModules.I18nManager as
    | { localeIdentifier?: unknown }
    | undefined;
  const localeIdentifier = nativeI18n?.localeIdentifier;

  return typeof localeIdentifier === 'string' ? localeIdentifier : null;
}

function detectLanguage(): SupportedLanguage {
  const normalizedLocale = (getDeviceLocaleIdentifier() ?? '')
    .replace('_', '-')
    .toLowerCase();

  if (!normalizedLocale.startsWith('zh')) {
    return 'en';
  }

  if (
    normalizedLocale.includes('hant') ||
    normalizedLocale.includes('tw') ||
    normalizedLocale.includes('hk') ||
    normalizedLocale.includes('mo')
  ) {
    return 'zh-Hant';
  }

  return 'zh-Hans';
}

function getInitialLanguage(): SupportedLanguage {
  const persistedLanguage = getString(LANG_PREF_KEY);

  if (isSupportedLanguage(persistedLanguage)) {
    return persistedLanguage;
  }

  return detectLanguage();
}

let currentLanguage = getInitialLanguage();

function emitLanguageChange(): void {
  listeners.forEach(listener => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getCurrentLanguage(): SupportedLanguage {
  return currentLanguage;
}

export function setLanguage(language: SupportedLanguage): void {
  if (language === currentLanguage) {
    setString(LANG_PREF_KEY, language);
    return;
  }

  currentLanguage = language;
  setString(LANG_PREF_KEY, language);
  emitLanguageChange();
}

export function t(key: keyof LocaleKeys): string {
  return LOCALES[currentLanguage][key] ?? en[key];
}

export function useI18n(): SupportedLanguage {
  return useSyncExternalStore(
    subscribe,
    getCurrentLanguage,
    getCurrentLanguage,
  );
}
