import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
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
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import { MOCK_HOME_EMOTION_WAVES } from '../mocks/appMockData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { LocaleKeys } from '../types/i18n';
import { COLORS, TYPOGRAPHY } from '../types/theme';
import { useDreamStore } from '../store/dreamStore';

type Props = {
  onNavigateToTab?: (tab: 'Home' | 'Journal' | 'Profile') => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function HomeScreen({ onNavigateToTab }: Props): React.JSX.Element {
  const language = useI18n();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const history = useDreamStore(state => state.history);

  // Animation hooks
  const buttonScale = useSharedValue(1);
  const sparkleRotation = useSharedValue(0);
  const breathScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const animatedSparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const animatedBreathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
  }));

  useEffect(() => {
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 8000 }),
      -1,
      false,
    );
    breathScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2500 }),
        withTiming(1.0, { duration: 2500 }),
      ),
      -1,
      true,
    );
  }, [sparkleRotation, breathScale]);

  const handlePressIn = (): void => {
    buttonScale.value = withSpring(0.96, { damping: 16, stiffness: 260 });
  };

  const handlePressOut = (): void => {
    buttonScale.value = withSpring(1, { damping: 16, stiffness: 260 });
  };

  const handleAnalyzeDream = (): void => {
    navigation.navigate('DreamInput');
  };

  const renderMockText = (textKey: string): string =>
    t(textKey as keyof LocaleKeys);

  // Helper to format today's date in a premium way
  const getPremiumDateString = (): string => {
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(today);
    return `${formattedDate} · ${t('homeDateSuffix')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Immersive Space Nebula Ambient Glows */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />
        <View
          style={[
            styles.dustParticle,
            { top: '25%', right: '20%', opacity: 0.15 },
          ]}
        />
        <View
          style={[
            styles.dustParticle,
            { bottom: '35%', left: '15%', opacity: 0.2, width: 3, height: 3 },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profile */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerDate}>{getPremiumDateString()}</Text>
            <View style={styles.brandRow}>
              <Text style={styles.title}>{t('appName')}</Text>
              <Text style={styles.sparkleEmoji}>✨</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => onNavigateToTab?.('Profile')}
            style={styles.avatarContainer}
          >
            <Animated.View
              style={[styles.avatarGradientBorder, animatedBreathStyle]}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
            </Animated.View>
            <View style={styles.onlineIndicator} />
          </Pressable>
        </View>

        {/* Floating Recording CTA Header Box */}
        <AnimatedPressable
          accessibilityRole="button"
          onPress={handleAnalyzeDream}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.gradientCTA, animatedButtonStyle]}
        >
          <View style={styles.ctaHeader}>
            <View style={styles.ctaTagContainer}>
              <Text style={styles.ctaTag}>{t('homeCtaTag')}</Text>
            </View>
            <Animated.View
              style={[styles.sparkleSpinner, animatedSparkleStyle]}
            >
              <Text style={styles.sparkleSpinnerText}>✨</Text>
            </Animated.View>
          </View>

          <Text style={styles.ctaTitle}>{t('homeCtaTitle')}</Text>
          <Text style={styles.ctaSubtitle}>{t('homeCtaSubtitle')}</Text>

          <View style={styles.ctaFooter}>
            <Text style={styles.ctaFooterText}>{t('homeCtaFooter')}</Text>
            <Text style={styles.ctaChevron}>›</Text>
          </View>
        </AnimatedPressable>

        {/* Today's Recommendation Box */}
        {history.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('DreamDetail', { dreamId: history[0].id })
            }
            style={styles.recommendationCard}
          >
            <View style={styles.recHeader}>
              <View style={styles.recLabelRow}>
                <Text style={styles.recIcon}>🌙</Text>
                <Text style={styles.recLabel}>
                  {t('homeRecommendationLabel')}
                </Text>
              </View>
              <Text style={styles.recScore}>
                {t('homeRecommendationScore')}
              </Text>
            </View>

            <Text style={styles.recTitle}>
              {renderMockText(history[0].titleKey)}
            </Text>
            <Text style={styles.recBody} numberOfLines={2}>
              {renderMockText(history[0].interpretationKey)}
            </Text>

            <View style={styles.recFooter}>
              <Text
                style={[styles.recEmotion, { color: history[0].emotionColor }]}
              >
                {t('homeRecommendationEmotionPrefix')}
                {renderMockText(history[0].emotionKey)}
              </Text>
              <Text style={styles.recTier}>{t('homeRecommendationTier')}</Text>
            </View>
          </Pressable>
        )}

        {/* Trend Chart (Subconscious emotional waves) */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleRow}>
              <Text style={styles.chartIcon}>📈</Text>
              <Text style={styles.chartTitle}>{t('homeChartTitle')}</Text>
            </View>
            <Text style={styles.chartMeta}>{t('homeChartMeta')}</Text>
          </View>

          <View style={styles.chartPanel}>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>{t('homeChartBadge')}</Text>
            </View>

            {/* Grid Line simulation */}
            <View style={styles.chartGrid}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            <View style={styles.barsContainer}>
              {MOCK_HOME_EMOTION_WAVES.map((item, idx) => (
                <View key={idx} style={styles.barColumn}>
                  <View style={styles.barBackground}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${item.height}%`,
                          backgroundColor: item.color,
                        },
                        'highlight' in item &&
                          item.highlight &&
                          styles.highlightedBarFill,
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.barLabel,
                      'highlight' in item &&
                        item.highlight &&
                        styles.highlightedBarLabel,
                    ]}
                  >
                    {'labelKey' in item ? t(item.labelKey) : item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Horizontal Carousel for History */}
        <View style={styles.carouselSection}>
          <Text style={styles.carouselTitle}>
            {t('homeCarouselTitle')} ({history.length})
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {history.map(item => (
              <Pressable
                accessibilityRole="button"
                key={item.id}
                onPress={() =>
                  navigation.navigate('DreamDetail', { dreamId: item.id })
                }
                style={styles.carouselCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>
                    {renderMockText(item.createdAtKey)}
                  </Text>
                  <Text style={styles.cardStar}>★</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {renderMockText(item.titleKey)}
                </Text>
                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.emotionTag,
                      { backgroundColor: `${item.emotionColor}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.emotionTagText,
                        { color: item.emotionColor },
                      ]}
                    >
                      {renderMockText(item.emotionKey)}
                    </Text>
                  </View>
                  <Text style={styles.lucidityLabel}>
                    {t('homeLucidityHigh')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glowTopLeft: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: `${COLORS.primaryAccent}0C`,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -150,
    right: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: `${COLORS.secondaryAccent}05`,
  },
  dustParticle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.textPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerDate: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  sparkleEmoji: {
    fontSize: 20,
    marginLeft: 6,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarGradientBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    backgroundColor: COLORS.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  gradientCTA: {
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  ctaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ctaTagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ctaTag: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 1.0,
  },
  sparkleSpinner: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleSpinnerText: {
    fontSize: 18,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  ctaSubtitle: {
    ...TYPOGRAPHY.secondary,
    color: 'rgba(237, 232, 255, 0.85)',
    lineHeight: 18,
    marginBottom: 16,
  },
  ctaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaFooterText: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  ctaChevron: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 6,
    top: -1,
  },
  recommendationCard: {
    backgroundColor: COLORS.surface,
    borderColor: `${COLORS.primaryAccent}33`,
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  recLabel: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    fontWeight: '700',
  },
  recScore: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: COLORS.textMuted,
  },
  recTitle: {
    ...TYPOGRAPHY.secondary,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  recBody: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.surface2,
    paddingTop: 10,
  },
  recEmotion: {
    fontSize: 10,
    fontWeight: '600',
  },
  recTier: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryAccent,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  chartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chartTitle: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartMeta: {
    fontSize: 10,
    color: COLORS.success,
    fontFamily: 'monospace',
  },
  chartPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    position: 'relative',
    height: 160,
    justifyContent: 'flex-end',
  },
  chartBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: `${COLORS.primaryAccent}1F`,
    borderColor: `${COLORS.primaryAccent}4D`,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  chartBadgeText: {
    fontSize: 8,
    fontFamily: 'monospace',
    color: COLORS.primaryAccent,
  },
  chartGrid: {
    position: 'absolute',
    top: 40,
    bottom: 36,
    left: 16,
    right: 16,
    justifyContent: 'space-between',
    opacity: 0.05,
  },
  gridLine: {
    height: 1,
    backgroundColor: COLORS.textPrimary,
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barBackground: {
    height: 80,
    width: 8,
    backgroundColor: COLORS.surface2,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  highlightedBarFill: {
    shadowColor: COLORS.secondaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  barLabel: {
    fontSize: 8,
    color: COLORS.textFaint,
    marginTop: 6,
    fontFamily: 'monospace',
  },
  highlightedBarLabel: {
    color: COLORS.secondaryAccent,
    fontWeight: '700',
  },
  carouselSection: {
    marginBottom: 10,
  },
  carouselTitle: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  carouselScroll: {
    paddingRight: 20,
    gap: 12,
  },
  carouselCard: {
    width: 146,
    height: 105,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
  },
  cardStar: {
    fontSize: 10,
    color: COLORS.secondaryAccent,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginVertical: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emotionTag: {
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  emotionTagText: {
    fontSize: 8,
    fontWeight: '700',
  },
  lucidityLabel: {
    fontSize: 8,
    color: COLORS.textFaint,
  },
});

export default HomeScreen;
