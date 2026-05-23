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
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { LocaleKeys } from '../types/i18n';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamInput'>;

const PROMPT_SUGGESTION_KEYS: Array<keyof LocaleKeys> = [
  'dreamInputSuggestionBegin',
  'dreamInputSuggestionAppear',
  'dreamInputSuggestionFeeling',
] as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function DreamInputScreen({ navigation }: Props): React.JSX.Element {
  useI18n();
  const [dreamContent, setDreamContent] = useState('');
  const buttonScale = useSharedValue(1);
  const characterCount = dreamContent.trim().length;
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

    navigation.navigate('DreamResult', { dreamContent: trimmedDream });
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
            <Text style={styles.kicker}>{t('dreamInputKicker')}</Text>
            <Text style={styles.title}>{t('dreamInputTitle')}</Text>
            <Text style={styles.subtitle}>{t('dreamInputSubtitle')}</Text>
          </View>

          <View style={styles.inputPanel}>
            <TextInput
              multiline
              onChangeText={setDreamContent}
              placeholder={t('dreamInputPlaceholder')}
              placeholderTextColor={COLORS.textFaint}
              selectionColor={COLORS.primaryAccent}
              style={styles.input}
              textAlignVertical="top"
              value={dreamContent}
            />
            <View style={styles.inputFooter}>
              <Text style={[styles.characterCount, { color: countTone }]}>
                {characterCount} {t('dreamInputCharacters')}
              </Text>
              <Text style={styles.guideText}>{t('dreamInputGuide')}</Text>
            </View>
          </View>

          <View style={styles.suggestionRow}>
            {PROMPT_SUGGESTION_KEYS.map(suggestionKey => (
              <View key={suggestionKey} style={styles.suggestionChip}>
                <Text style={styles.suggestionText}>{t(suggestionKey)}</Text>
              </View>
            ))}
          </View>

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
              {t('dreamInputAnalyze')}
            </Text>
          </AnimatedPressable>
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 22,
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
  inputPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 252,
    padding: 16,
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42,
    shadowRadius: 22,
  },
  input: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
    minHeight: 178,
  },
  inputFooter: {
    alignItems: 'center',
    borderTopColor: COLORS.surface2,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  characterCount: {
    ...TYPOGRAPHY.badge,
  },
  guideText: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  suggestionChip: {
    backgroundColor: `${COLORS.primaryAccent}26`,
    borderColor: `${COLORS.primaryAccent}4D`,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionText: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textPrimary,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 50,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.surface2,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});

export default DreamInputScreen;
