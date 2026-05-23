import type { User } from '@supabase/supabase-js';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import { useAuthStore } from '../store/authStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function createDemoUser(email: string): User {
  const timestamp = new Date().toISOString();

  return {
    id: 'demo-user',
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: timestamp,
    phone: '',
    confirmed_at: timestamp,
    last_sign_in_at: timestamp,
    app_metadata: {
      provider: 'email',
      providers: ['email'],
    },
    user_metadata: {},
    identities: [],
    created_at: timestamp,
    updated_at: timestamp,
    is_anonymous: false,
  };
}

function AuthScreen(): React.JSX.Element {
  useI18n();
  const [email, setEmail] = useState('demo@dreamnest.app');
  const [password, setPassword] = useState('');
  const setUser = useAuthStore(state => state.setUser);
  const setBackendToken = useAuthStore(state => state.setBackendToken);
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = (): void => {
    buttonScale.value = withSpring(0.96, { damping: 16, stiffness: 260 });
  };

  const handlePressOut = (): void => {
    buttonScale.value = withSpring(1, { damping: 16, stiffness: 260 });
  };

  const handleContinue = (): void => {
    const normalizedEmail = email.trim() || 'demo@dreamnest.app';

    setUser(createDemoUser(normalizedEmail));
    setBackendToken('demo-backend-token');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.kicker}>{t('appName')}</Text>
            <Text style={styles.title}>{t('authTitle')}</Text>
            <Text style={styles.subtitle}>{t('authSubtitle')}</Text>
          </View>

          <View style={styles.formPanel}>
            <Text style={styles.inputLabel}>{t('authEmailLabel')}</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder={t('authEmailPlaceholder')}
              placeholderTextColor={COLORS.textFaint}
              selectionColor={COLORS.primaryAccent}
              style={styles.input}
              value={email}
            />

            <Text style={styles.inputLabel}>{t('authPasswordLabel')}</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder={t('authPasswordPlaceholder')}
              placeholderTextColor={COLORS.textFaint}
              secureTextEntry
              selectionColor={COLORS.primaryAccent}
              style={styles.input}
              value={password}
            />

            <AnimatedPressable
              accessibilityRole="button"
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.primaryButton, animatedButtonStyle]}
            >
              <Text style={styles.primaryButtonText}>{t('authContinue')}</Text>
            </AnimatedPressable>

            <Text style={styles.helperText}>{t('authHelper')}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  hero: {
    marginBottom: 28,
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
  formPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  inputLabel: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    ...TYPOGRAPHY.body,
    backgroundColor: COLORS.surface2,
    borderColor: COLORS.textFaint,
    borderRadius: 14,
    borderWidth: 1,
    color: COLORS.textPrimary,
    marginBottom: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  helperText: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textFaint,
    marginTop: 14,
    textAlign: 'center',
  },
});

export default AuthScreen;
