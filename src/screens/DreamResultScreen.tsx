import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import {
  MOCK_DREAM_ANALYSIS,
  MOCK_EMOTION_STYLES,
  type MockDreamEmotion,
} from '../mocks/appMockData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDreamStore } from '../store/dreamStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamResult'>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const getEmotionStyles = (emotion: MockDreamEmotion) => {
  const style = MOCK_EMOTION_STYLES[emotion];

  return {
    ...style,
    tag: `${style.icon} ${t(style.labelKey)}`,
  };
};

function DreamResultScreen({ route, navigation }: Props): React.JSX.Element {
  const language = useI18n();
  const { dreamContent } = route.params;

  const emotionParam = (
    route.params.emotion && route.params.emotion in MOCK_EMOTION_STYLES
      ? route.params.emotion
      : 'joy'
  ) as MockDreamEmotion;
  const emoStyle = getEmotionStyles(emotionParam);

  const history = useDreamStore(state => state.history);
  const setHistory = useDreamStore(state => state.setHistory);

  // States mirroring PhoneSimulator.tsx
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamProgress, setStreamProgress] = useState(0); // 0 to 4 steps
  const [streamText, setStreamText] = useState('');
  const [revealedSymbolIdx, setRevealedSymbolIdx] = useState(-1);
  const [confidenceDial, setConfidenceDial] = useState(0);

  const scrollRef = useRef<ScrollView>(null);
  const buttonScale = useSharedValue(1);
  const progressBarWidth = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value}%`,
  }));

  const handlePressIn = (): void => {
    buttonScale.value = withSpring(0.96, { damping: 16, stiffness: 260 });
  };

  const handlePressOut = (): void => {
    buttonScale.value = withSpring(1, { damping: 16, stiffness: 260 });
  };

  const handleBackHome = (): void => {
    navigation.popToTop();
  };

  const generatedAnalysis = useMemo(() => {
    const symbolJoiner = language === 'en' ? ', ' : '、';
    const mockAnalysis =
      emotionParam === 'joy' || emotionParam === 'calm'
        ? MOCK_DREAM_ANALYSIS[emotionParam]
        : MOCK_DREAM_ANALYSIS.default;

    return {
      title: t(mockAnalysis.titleKey),
      theme: t(mockAnalysis.themeKey),
      symbolism: mockAnalysis.symbolKeys.map(symbol => ({
        symbol: t(symbol.symbolKey),
        meaning: t(symbol.meaningKey),
      })),
      keywords: mockAnalysis.keywordKeys.map(keywordKey => t(keywordKey)),
      symbolJoiner,
      confidence: mockAnalysis.confidence,
    };
  }, [emotionParam, language]);

  // Client-Side Simulated SSE Streaming
  useEffect(() => {
    setIsStreaming(true);
    setStreamProgress(0);
    setStreamText('');
    setRevealedSymbolIdx(-1);
    setConfidenceDial(0);
    progressBarWidth.value = withTiming(0, { duration: 100 });

    // Step 1: L1 template match sequence (400ms)
    const t1 = setTimeout(() => {
      setStreamProgress(1);
      progressBarWidth.value = withTiming(25, { duration: 600 });
      setStreamText(
        t('dreamResultStreamL1Prefix') +
          generatedAnalysis.symbolism
            .map((s: { symbol: string }) => `[${s.symbol}]`)
            .join(generatedAnalysis.symbolJoiner) +
          `${t('dreamResultStreamL1Middle')}${generatedAnalysis.confidence}${t(
            'dreamResultStreamL1Suffix',
          )}`,
      );
    }, 400);

    // Step 2: L2 neural network resolve (1100ms)
    const t2 = setTimeout(() => {
      setStreamProgress(2);
      progressBarWidth.value = withTiming(50, { duration: 700 });
      setStreamText(prev => prev + t('dreamResultStreamL2'));
    }, 1100);

    // Step 3: L3 knowledge graph (1900ms)
    const t3 = setTimeout(() => {
      setStreamProgress(3);
      progressBarWidth.value = withTiming(75, { duration: 800 });
      setStreamText(prev => prev + t('dreamResultStreamL3'));
    }, 1900);

    // Step 4: Stream text rendering of theme (2800ms)
    let interval: ReturnType<typeof setInterval> | undefined;
    const textToAnimate = `${t('dreamResultStreamThemeLabel')}${
      generatedAnalysis.theme
    }\n\n${t('dreamResultStreamSymbolsLabel')}\n`;

    const t4 = setTimeout(() => {
      setStreamProgress(4);
      progressBarWidth.value = withTiming(100, { duration: 2000 });
      let idx = 0;
      interval = setInterval(() => {
        if (idx < textToAnimate.length) {
          setStreamText(prev => prev + textToAnimate[idx]);
          idx++;
          scrollRef.current?.scrollToEnd({ animated: true });
        } else {
          if (interval) {
            clearInterval(interval);
          }
          revealSymbolisms();
        }
      }, 15);
    }, 2800);

    const revealSymbolisms = () => {
      let symIdx = 0;
      const symInterval = setInterval(() => {
        if (symIdx < generatedAnalysis.symbolism.length) {
          setRevealedSymbolIdx(symIdx);
          symIdx++;
          scrollRef.current?.scrollToEnd({ animated: true });
        } else {
          clearInterval(symInterval);
          // Rise confidence dial
          let count = 0;
          const dialInterval = setInterval(() => {
            if (count <= generatedAnalysis.confidence) {
              setConfidenceDial(count);
              count += 2;
            } else {
              setConfidenceDial(generatedAnalysis.confidence);
              clearInterval(dialInterval);
              setIsStreaming(false);
              saveDreamRecord();
            }
          }, 20);
        }
      }, 750);
    };

    const saveDreamRecord = () => {
      // Append the newly interpreted dream to the global store history dynamically
      const newRecord = {
        id: String(Date.now()),
        titleKey: generatedAnalysis.title,
        dreamContentKey: dreamContent,
        interpretationKey: generatedAnalysis.theme,
        emotionKey: emotionParam,
        emotionColor: emoStyle.colorCode,
        createdAtKey: 'commonToday',
        // Extra payload metadata matching PhoneSimulator
        aiKeywords: generatedAnalysis.keywords,
        symbolism: generatedAnalysis.symbolism,
        confidenceScore: generatedAnalysis.confidence,
      };

      // Store tozustand history
      setHistory([newRecord, ...history]);
    };

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (interval) clearInterval(interval);
    };
  }, [
    dreamContent,
    emoStyle.colorCode,
    emotionParam,
    generatedAnalysis,
    history,
    progressBarWidth,
    setHistory,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>
            ✨ {t('dreamResultImmersiveKicker')}
          </Text>
          <Text style={styles.title}>{t('dreamResultTitle')}</Text>
          <Text style={styles.subtitle}>
            {isStreaming
              ? t('dreamResultStreamingSubtitle')
              : t('dreamResultCompleteSubtitle')}
          </Text>
        </View>

        {/* Stepper tracker (PhoneSimulator logic) */}
        <View style={styles.stepperCard}>
          <View style={styles.stepperHeader}>
            <Text style={styles.stepperHeaderText}>
              {t('dreamResultStepperTitle')}
            </Text>
            {isStreaming && (
              <Text style={styles.stepperStatusText}>
                {t('dreamResultStreamingStatus')}
              </Text>
            )}
          </View>

          <View style={styles.stepperBubblesRow}>
            {/* Progress Line */}
            <View style={styles.progressBackgroundLine} />
            <Animated.View
              style={[styles.progressActiveLine, animatedProgressStyle]}
            />

            {/* Bubble 1: L1 */}
            <View style={styles.bubbleCol}>
              <View
                style={[
                  styles.bubbleCircle,
                  streamProgress >= 1
                    ? styles.bubbleCircleActive
                    : styles.bubbleCircle,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    streamProgress >= 1 && styles.bubbleTextActive,
                  ]}
                >
                  {streamProgress >= 2 ? '✓' : 'L1'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>
                {t('dreamResultStepImageMatch')}
              </Text>
            </View>

            {/* Bubble 2: L2 */}
            <View style={styles.bubbleCol}>
              <View
                style={[
                  styles.bubbleCircle,
                  streamProgress >= 2
                    ? styles.bubbleCircleActive
                    : styles.bubbleCircle,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    streamProgress >= 2 && styles.bubbleTextActive,
                  ]}
                >
                  {streamProgress >= 3 ? '✓' : 'L2'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>
                {t('dreamResultStepBrainwave')}
              </Text>
            </View>

            {/* Bubble 3: L3 */}
            <View style={styles.bubbleCol}>
              <View
                style={[
                  styles.bubbleCircle,
                  streamProgress >= 3
                    ? styles.bubbleCircleActive
                    : styles.bubbleCircle,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    streamProgress >= 3 && styles.bubbleTextActive,
                  ]}
                >
                  {streamProgress >= 4 ? '✓' : 'L3'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>
                {t('dreamResultStepGraphAlign')}
              </Text>
            </View>

            {/* Bubble 4: Done */}
            <View style={styles.bubbleCol}>
              <View
                style={[
                  styles.bubbleCircle,
                  streamProgress >= 4 && !isStreaming
                    ? styles.bubbleCircleSuccess
                    : styles.bubbleCircle,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    streamProgress >= 4 &&
                      !isStreaming &&
                      styles.bubbleTextSuccess,
                  ]}
                >
                  {streamProgress >= 4 && !isStreaming ? '✓' : 'Done'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>{t('dreamResultStepDone')}</Text>
            </View>
          </View>
        </View>

        {/* Score Dial & Theme (Floating cards) */}
        <View style={styles.metersRow}>
          <View style={styles.meterCardSmall}>
            <Text style={styles.meterSmallLabel}>
              {t('dreamResultLucidityLabel')}
            </Text>
            <Text
              style={[styles.meterSmallValue, { color: emoStyle.colorCode }]}
            >
              {t('dreamResultLucidityValue')}
            </Text>
          </View>

          <View style={styles.meterCardLarge}>
            <Text style={styles.meterLargeLabel}>
              {t('dreamResultConfidenceLabel')}
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${confidenceDial}%`,
                    backgroundColor: emoStyle.colorCode,
                  },
                ]}
              />
            </View>
            <Text style={[styles.meterLargeValue, { color: COLORS.success }]}>
              {confidenceDial}% {t('dreamResultConfidenceSuffix')}
            </Text>
          </View>
        </View>

        {/* Typewriter chronicle terminal window */}
        <View style={styles.terminalPanel}>
          <View style={styles.terminalHeader}>
            <View
              style={[
                styles.terminalPulseDot,
                { backgroundColor: emoStyle.colorCode },
              ]}
            />
            <Text style={styles.terminalHeaderText}>
              {t('dreamResultTerminalHeader')}
            </Text>
          </View>

          <Text style={styles.terminalText}>
            {streamText || t('dreamResultTerminalPlaceholder')}
          </Text>

          {/* Symbolism breakdown revealed one by one */}
          {!isStreaming && (
            <View style={styles.symbolsSection}>
              <Text style={styles.symbolsTitle}>
                {t('dreamResultSymbolsTitle')}
              </Text>

              <View style={styles.symbolsList}>
                {generatedAnalysis.symbolism.map(
                  (sym: { symbol: string; meaning: string }, idx: number) => {
                    const isVisible = idx <= revealedSymbolIdx;
                    if (!isVisible) return null;

                    return (
                      <Animated.View
                        entering={FadeInDown.duration(400)}
                        key={idx}
                        style={styles.symbolCard}
                      >
                        <View style={styles.symbolCardHeader}>
                          <View
                            style={[
                              styles.symbolDot,
                              { backgroundColor: COLORS.primaryAccent },
                            ]}
                          />
                          <Text style={styles.symbolName}>{sym.symbol}</Text>
                        </View>
                        <Text style={styles.symbolMeaning}>{sym.meaning}</Text>
                      </Animated.View>
                    );
                  },
                )}
              </View>
            </View>
          )}
        </View>

        {/* Premium locker and final actions */}
        {!isStreaming && (
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.actionBlock}
          >
            {/* 29 Diamonds Premium Locker Banner */}
            <View style={styles.premiumBanner}>
              <View style={styles.premiumLeft}>
                <View style={styles.premiumBadgeRow}>
                  <Text style={styles.premiumBadgeText}>
                    {t('dreamResultPremiumTitle')}
                  </Text>
                  <Text style={styles.premiumLockEmoji}>🔒</Text>
                </View>
                <Text style={styles.premiumSubtitle}>
                  {t('dreamResultPremiumSubtitle')}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                style={styles.premiumButton}
              >
                <Text style={styles.premiumButtonText}>
                  {t('dreamResultPremiumButton')}
                </Text>
              </Pressable>
            </View>

            {/* Back home save button */}
            <AnimatedPressable
              accessibilityRole="button"
              onPress={handleBackHome}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.saveButton, animatedButtonStyle]}
            >
              <Text style={styles.saveIcon}>✓</Text>
              <Text style={styles.saveButtonText}>
                {t('dreamResultSaveButton')}
              </Text>
            </AnimatedPressable>
          </Animated.View>
        )}
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
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
    marginTop: 8,
    lineHeight: 18,
  },
  stepperCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  stepperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepperHeaderText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  stepperStatusText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: COLORS.primaryAccent,
  },
  stepperBubblesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    height: 48,
  },
  progressBackgroundLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 14,
    height: 2,
    backgroundColor: COLORS.surface2,
  },
  progressActiveLine: {
    position: 'absolute',
    left: 20,
    top: 14,
    height: 2,
    backgroundColor: COLORS.primaryAccent,
  },
  bubbleCol: {
    alignItems: 'center',
    width: 60,
  },
  bubbleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface2,
    marginBottom: 6,
  },
  bubbleCircleActive: {
    backgroundColor: COLORS.primaryAccent,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleCircleSuccess: {
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  bubbleTextActive: {
    color: COLORS.textPrimary,
  },
  bubbleTextSuccess: {
    color: COLORS.background,
  },
  bubbleLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  meterCardSmall: {
    flex: 1.1,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meterSmallLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  meterSmallValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  meterCardLarge: {
    flex: 2,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'center',
  },
  meterLargeLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.surface2,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  meterLargeValue: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  terminalPanel: {
    backgroundColor: 'rgba(22, 19, 35, 0.9)',
    borderColor: 'rgba(123, 110, 246, 0.15)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 18,
    minHeight: 180,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface2,
    paddingBottom: 8,
    marginBottom: 12,
  },
  terminalPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  terminalHeaderText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  terminalText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  symbolsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface2,
    paddingTop: 16,
  },
  symbolsTitle: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    fontWeight: '700',
    marginBottom: 12,
  },
  symbolsList: {
    gap: 10,
  },
  symbolCard: {
    backgroundColor: COLORS.surface2,
    borderColor: 'rgba(123, 110, 246, 0.15)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  symbolCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  symbolDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  symbolName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  symbolMeaning: {
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 16,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(123, 110, 246, 0.2)',
  },
  actionBlock: {
    gap: 16,
  },
  premiumBanner: {
    backgroundColor: COLORS.surface,
    borderColor: 'rgba(240, 168, 110, 0.35)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  premiumLeft: {
    flex: 1,
  },
  premiumBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondaryAccent,
    letterSpacing: 0.5,
  },
  premiumLockEmoji: {
    fontSize: 10,
    marginLeft: 4,
  },
  premiumSubtitle: {
    fontSize: 9,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
  premiumButton: {
    backgroundColor: COLORS.secondaryAccent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.background,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface2,
    borderColor: 'rgba(123, 110, 246, 0.25)',
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 52,
    gap: 8,
  },
  saveIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
  saveButtonText: {
    ...TYPOGRAPHY.secondary,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});

export default DreamResultScreen;
