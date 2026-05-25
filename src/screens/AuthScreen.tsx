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
import { MOCK_AUTH } from '../mocks/appMockData';
import { useAuthStore } from '../store/authStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function createDemoUser(email: string): User {
  const timestamp = new Date().toISOString();

  return {
    id: MOCK_AUTH.demoUserId,
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
  const [email, setEmail] = useState<string>(MOCK_AUTH.defaultEmail);
  const [password, setPassword] = useState('');
  const setUser = useAuthStore(state => state.setUser);
  const setBackendToken = useAuthStore(state => state.setBackendToken);
  const buttonScale = useSharedValue(1);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
    const normalizedEmail = email.trim() || MOCK_AUTH.fallbackEmail;

    setUser(createDemoUser(normalizedEmail));
    setBackendToken(MOCK_AUTH.backendToken);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Immersive Space Nebula Ambient Glows */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.glowLeft} />
        <View style={styles.glowRight} />
        <View style={[styles.dustParticle, { top: '15%', left: '20%' }]} />
        <View
          style={[
            styles.dustParticle,
            { top: '40%', right: '15%', width: 6, height: 6 },
          ]}
        />
        <View
          style={[
            styles.dustParticle,
            { bottom: '25%', left: '30%', width: 3, height: 3 },
          ]}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.kicker}>{t('appName')} ✨</Text>
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
              style={[styles.input, isEmailFocused && styles.inputFocused]}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              value={email}
            />

            <Text style={styles.inputLabel}>{t('authPasswordLabel')}</Text>
            <TextInput
              onChangeText={setPassword}
              placeholder={t('authPasswordPlaceholder')}
              placeholderTextColor={COLORS.textFaint}
              secureTextEntry
              selectionColor={COLORS.primaryAccent}
              style={[styles.input, isPasswordFocused && styles.inputFocused]}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              value={password}
            />

            <AnimatedPressable
              accessibilityRole="button"
              onPress={handleContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.primaryButton, animatedButtonStyle]}
            >
              <Text style={styles.primaryButtonText}>
                {t('authContinue')} 🔮
              </Text>
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
  glowLeft: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: `${COLORS.primaryAccent}0D`,
  },
  glowRight: {
    position: 'absolute',
    bottom: -150,
    right: -150,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: `${COLORS.secondaryAccent}08`,
  },
  dustParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: `${COLORS.textPrimary}1A`,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  hero: {
    marginBottom: 32,
  },
  kicker: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
    lineHeight: 40,
  },
  subtitle: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
    marginTop: 12,
    lineHeight: 20,
  },
  formPanel: {
    backgroundColor: COLORS.surface,
    borderColor: `${COLORS.primaryAccent}1F`,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  inputLabel: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  input: {
    ...TYPOGRAPHY.body,
    backgroundColor: COLORS.surface2,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1.5,
    color: COLORS.textPrimary,
    marginBottom: 18,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: `${COLORS.primaryAccent}80`,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 6,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  helperText: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textFaint,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AuthScreen;
