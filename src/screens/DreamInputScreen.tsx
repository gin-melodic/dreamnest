import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
import {
  MOCK_DREAM_EMOTIONS,
  MOCK_EMOTION_STYLES,
  type MockDreamEmotion,
} from '../mocks/appMockData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamInput'>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Helper function to return emotion-specific colors in React Native styles
const getEmotionStyles = (emotion: MockDreamEmotion) => {
  const style = MOCK_EMOTION_STYLES[emotion];

  return {
    ...style,
    label: t(style.labelKey),
  };
};

function DreamInputScreen({ navigation }: Props): React.JSX.Element {
  useI18n();
  const [dreamContent, setDreamContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] =
    useState<MockDreamEmotion>('joy');
  const [isFocused, setIsFocused] = useState(false);

  const buttonScale = useSharedValue(1);
  const characterCount = dreamContent.length;
  const canAnalyze = characterCount > 0;

  const countTone = useMemo(() => {
    if (characterCount === 0) {
      return COLORS.textFaint;
    }

    if (characterCount < 50 || characterCount > 200) {
      return COLORS.secondaryAccent;
    }

    return COLORS.success;
  }, [characterCount]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = (): void => {
    if (canAnalyze) {
      buttonScale.value = withSpring(0.96, { damping: 16, stiffness: 260 });
    }
  };

  const handlePressOut = (): void => {
    buttonScale.value = withSpring(1, { damping: 16, stiffness: 260 });
  };

  const handleAnalyze = (): void => {
    const trimmedDream = dreamContent.trim();

    if (!trimmedDream) {
      return;
    }

    // Navigate and pass both the content and selected emotion
    navigation.navigate('DreamResult', {
      dreamContent: trimmedDream,
      emotion: selectedEmotion,
    });
  };

  const injectSmartTemplate = (): void => {
    setDreamContent(t('dreamInputSmartTemplate'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.kicker}>
              ✨ {t('dreamInputImmersiveKicker')}
            </Text>
            <Text style={styles.title}>{t('dreamInputTitle')}</Text>
            <Text style={styles.subtitle}>{t('dreamInputSubtitle')}</Text>
          </View>

          {/* Immersive input textarea container */}
          <View
            style={[styles.inputPanel, isFocused && styles.inputPanelFocused]}
          >
            <TextInput
              multiline
              onChangeText={setDreamContent}
              placeholder={t('dreamInputPlaceholder')}
              placeholderTextColor={COLORS.textFaint}
              selectionColor={COLORS.primaryAccent}
              style={styles.input}
              textAlignVertical="top"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={dreamContent}
              maxLength={500}
            />

            <View style={styles.inputFooter}>
              <Pressable
                accessibilityRole="button"
                onPress={injectSmartTemplate}
                style={styles.polishButton}
              >
                <Text style={styles.polishButtonText}>
                  🪄 {t('dreamInputSmartInject')}
                </Text>
              </Pressable>

              <Text style={[styles.characterCount, { color: countTone }]}>
                {characterCount}/500 {t('dreamInputCharacters')}
              </Text>
            </View>
          </View>

          {/* Emotional selection chips */}
          <View style={styles.emotionSection}>
            <View style={styles.emotionHeader}>
              <Text style={styles.emotionTitle}>
                {t('dreamInputEmotionQuestion')}
              </Text>
              <Text style={styles.emotionMeta}>
                {t('dreamInputEmotionMotion')}
              </Text>
            </View>

            <View style={styles.emotionGrid}>
              {MOCK_DREAM_EMOTIONS.map(emo => {
                const isSelected = selectedEmotion === emo;
                const emoStyle = getEmotionStyles(emo);

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={emo}
                    onPress={() => setSelectedEmotion(emo)}
                    style={[
                      styles.emotionChip,
                      isSelected
                        ? {
                            backgroundColor: emoStyle.bg,
                            borderColor: emoStyle.border,
                            transform: [{ scale: 1.05 }],
                          }
                        : styles.emotionChipInactive,
                    ]}
                  >
                    <Text style={styles.emotionIcon}>{emoStyle.icon}</Text>
                    <Text
                      style={[
                        styles.emotionLabel,
                        isSelected
                          ? { color: emoStyle.text, fontWeight: '700' }
                          : styles.emotionLabelInactive,
                      ]}
                    >
                      {emoStyle.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Submit button with CTA */}
          <AnimatedPressable
            accessibilityRole="button"
            disabled={!canAnalyze}
            onPress={handleAnalyze}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.primaryButton,
              !canAnalyze && styles.primaryButtonDisabled,
              animatedButtonStyle,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {t('dreamInputPrimaryCta')}
            </Text>
          </AnimatedPressable>

          {/* Informational Hint Card */}
          <View style={styles.hintCard}>
            <Text style={styles.hintIcon}>ℹ️</Text>
            <Text style={styles.hintText}>{t('dreamInputHint')}</Text>
          </View>
        </ScrollView>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 24,
  },
  kicker: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
    marginTop: 10,
    lineHeight: 18,
  },
  inputPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 24,
    borderWidth: 1.5,
    minHeight: 252,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  inputPanelFocused: {
    borderColor: `${COLORS.primaryAccent}80`,
  },
  input: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
    minHeight: 160,
    lineHeight: 24,
  },
  inputFooter: {
    alignItems: 'center',
    borderTopColor: COLORS.surface2,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
  },
  polishButton: {
    backgroundColor: COLORS.surface2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderColor: `${COLORS.secondaryAccent}40`,
    borderWidth: 1,
  },
  polishButtonText: {
    fontSize: 10,
    color: COLORS.secondaryAccent,
    fontWeight: '700',
  },
  characterCount: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  emotionSection: {
    marginTop: 24,
  },
  emotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  emotionTitle: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emotionMeta: {
    fontSize: 9,
    color: COLORS.textFaint,
    fontFamily: 'monospace',
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionChip: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    flex: 1,
    minWidth: 56,
  },
  emotionChipInactive: {
    backgroundColor: `${COLORS.surface2}80`,
    borderColor: COLORS.surface2,
  },
  emotionIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  emotionLabel: {
    fontSize: 10,
  },
  emotionLabelInactive: {
    color: COLORS.textMuted,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 52,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.surface2,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hintCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'flex-start',
  },
  hintIcon: {
    fontSize: 14,
    marginRight: 10,
    marginTop: 2,
  },
  hintText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
});

export default DreamInputScreen;
