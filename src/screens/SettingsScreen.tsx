import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
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

import { signOut } from '../api/auth';
import { setLanguage, t, useI18n } from '../lib/i18n';
import { MOCK_LANGUAGE_OPTIONS, MOCK_SETTINGS } from '../mocks/appMockData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/authStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

function SettingsScreen(): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const language = useI18n();
  const user = useAuthStore(state => state.user);
  const backendToken = useAuthStore(state => state.backendToken);
  const clear = useAuthStore(state => state.clear);

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } finally {
      clear();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navigator}>
          <Pressable
            accessibilityLabel={t('commonBack')}
            accessibilityRole="button"
            onPress={navigation.goBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.title}>{t('settingsTitle')}</Text>
          <View style={styles.navigatorSpacer} />
        </View>

        {/* Account Identity details panel */}
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

        {/* Settings configurations */}
        <View style={styles.settingsPanel}>
          {MOCK_SETTINGS.map(setting => (
            <View key={setting.labelKey} style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t(setting.labelKey)}</Text>
              <Text style={styles.settingValue}>{t(setting.valueKey)}</Text>
            </View>
          ))}
        </View>

        {/* Translation locales selector */}
        <View style={styles.languagePanel}>
          <Text style={styles.languageTitle}>{t('profileLanguageTitle')}</Text>
          {MOCK_LANGUAGE_OPTIONS.map(option => {
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

        {/* Premium sign out button */}
        <Pressable
          accessibilityRole="button"
          onPress={handleSignOut}
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
    paddingBottom: 50,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  navigator: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: `${COLORS.primaryAccent}26`,
    borderColor: `${COLORS.primaryAccent}40`,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  backButtonText: {
    color: COLORS.primaryAccent,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  navigatorSpacer: {
    width: 36,
  },
  identityCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 12,
    width: 44,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  identityText: {
    flex: 1,
  },
  email: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  tokenStatus: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  settingsPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingRow: {
    borderBottomColor: COLORS.surface2,
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  settingLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  settingValue: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  languagePanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    padding: 16,
  },
  languageTitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  languageOption: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 40,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: COLORS.textFaint,
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    marginRight: 10,
    width: 18,
  },
  radioOuterSelected: {
    borderColor: COLORS.primaryAccent,
  },
  radioInner: {
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  languageLabel: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
  },
  signOutButton: {
    alignItems: 'center',
    borderColor: COLORS.error,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  signOutText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.error,
    fontWeight: '700',
  },
});

export default SettingsScreen;
