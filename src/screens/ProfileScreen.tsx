import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { setLanguage, t, useI18n } from '../lib/i18n';
import { useAuthStore } from '../store/authStore';
import type { LocaleKeys, SupportedLanguage } from '../types/i18n';
import { COLORS, TYPOGRAPHY } from '../types/theme';

const SETTINGS = [
  { labelKey: 'profileSettingAccount', valueKey: 'profileSettingAccountValue' },
  { labelKey: 'profileSettingStorage', valueKey: 'profileSettingStorageValue' },
  { labelKey: 'profileSettingPrivacy', valueKey: 'profileSettingPrivacyValue' },
] as const;

const LANGUAGE_OPTIONS: Array<{
  value: SupportedLanguage;
  labelKey: keyof LocaleKeys;
}> = [
  { value: 'en', labelKey: 'profileLanguageEnglish' },
  { value: 'zh-Hant', labelKey: 'profileLanguageTraditionalChinese' },
  { value: 'zh-Hans', labelKey: 'profileLanguageSimplifiedChinese' },
];

function ProfileScreen(): React.JSX.Element {
  const language = useI18n();
  const user = useAuthStore(state => state.user);
  const backendToken = useAuthStore(state => state.backendToken);
  const clear = useAuthStore(state => state.clear);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>{t('profileKicker')}</Text>
          <Text style={styles.title}>{t('profileTitle')}</Text>
          <Text style={styles.subtitle}>{t('profileSubtitle')}</Text>
        </View>

        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.email ?? 'D').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.email}>
              {user?.email ?? t('profileNotSignedIn')}
            </Text>
            <Text style={styles.tokenStatus}>
              {backendToken
                ? t('profileBackendTokenStored')
                : t('profileNoBackendToken')}
            </Text>
          </View>
        </View>

        <View style={styles.settingsPanel}>
          {SETTINGS.map(setting => (
            <View key={setting.labelKey} style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t(setting.labelKey)}</Text>
              <Text style={styles.settingValue}>{t(setting.valueKey)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.languagePanel}>
          <Text style={styles.languageTitle}>{t('profileLanguageTitle')}</Text>
          {LANGUAGE_OPTIONS.map(option => {
            const isSelected = language === option.value;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                key={option.value}
                onPress={() => setLanguage(option.value)}
                style={styles.languageOption}
              >
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}
                >
                  {isSelected ? <View style={styles.radioInner} /> : null}
                </View>
                <Text style={styles.languageLabel}>{t(option.labelKey)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={clear}
          style={styles.signOutButton}
        >
          <Text style={styles.signOutText}>{t('profileSignOut')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 24,
  },
  kicker: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  identityCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginRight: 14,
    width: 56,
  },
  avatarText: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
  },
  identityText: {
    flex: 1,
  },
  email: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  tokenStatus: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  settingsPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 18,
    paddingHorizontal: 16,
  },
  settingRow: {
    borderBottomColor: COLORS.surface2,
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  settingLabel: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
  },
  settingValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  languagePanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  languageTitle: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  languageOption: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 42,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: COLORS.textFaint,
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    marginRight: 12,
    width: 20,
  },
  radioOuterSelected: {
    borderColor: COLORS.primaryAccent,
  },
  radioInner: {
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  languageLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  signOutButton: {
    alignItems: 'center',
    borderColor: COLORS.error,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 50,
  },
  signOutText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.error,
    fontWeight: '700',
  },
});

export default ProfileScreen;
