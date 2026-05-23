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

type DreamPreview = {
  id: string;
  titleKey: keyof LocaleKeys;
  dateLabelKey: keyof LocaleKeys;
  emotionKey: keyof LocaleKeys;
  accentColor: string;
  summaryKey: keyof LocaleKeys;
};

const RECENT_DREAMS: DreamPreview[] = [
  {
    id: 'moon-garden',
    titleKey: 'dreamOneTitle',
    dateLabelKey: 'dreamOneDate',
    emotionKey: 'dreamOneEmotion',
    accentColor: COLORS.primaryAccent,
    summaryKey: 'dreamOneSummary',
  },
  {
    id: 'orange-train',
    titleKey: 'dreamTwoTitle',
    dateLabelKey: 'dreamTwoDate',
    emotionKey: 'dreamTwoEmotion',
    accentColor: COLORS.secondaryAccent,
    summaryKey: 'dreamTwoSummary',
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function HomeScreen(): React.JSX.Element {
  useI18n();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  const handleAnalyzeDream = (): void => {
    navigation.navigate('DreamInput');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>{t('appName')}</Text>
            <Text style={styles.title}>{t('homeTitle')}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakNumber}>3</Text>
            <Text style={styles.streakLabel}>{t('homeStreakLabel')}</Text>
          </View>
        </View>

        <View style={styles.heroPanel}>
          <View style={styles.orbitLarge} />
          <View style={styles.orbitSmall} />
          <Text style={styles.heroEyebrow}>{t('homeHeroEyebrow')}</Text>
          <Text style={styles.heroTitle}>{t('homeHeroTitle')}</Text>
          <Text style={styles.heroBody}>{t('homeHeroBody')}</Text>
          <AnimatedPressable
            accessibilityRole="button"
            onPress={handleAnalyzeDream}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.primaryButton, animatedButtonStyle]}
          >
            <Text style={styles.primaryButtonText}>
              {t('homeAnalyzeButton')}
            </Text>
          </AnimatedPressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('homeRecentTitle')}</Text>
          <Text style={styles.sectionMeta}>{t('homeRecentMeta')}</Text>
        </View>

        <View style={styles.dreamList}>
          {RECENT_DREAMS.map(dream => (
            <View key={dream.id} style={styles.dreamCard}>
              <View
                style={[
                  styles.emotionStrip,
                  { backgroundColor: dream.accentColor },
                ]}
              />
              <View style={styles.dreamCardContent}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle}>{t(dream.titleKey)}</Text>
                  <Text style={styles.cardDate}>{t(dream.dateLabelKey)}</Text>
                </View>
                <View
                  style={[
                    styles.emotionChip,
                    {
                      borderColor: `${dream.accentColor}66`,
                      backgroundColor: `${dream.accentColor}26`,
                    },
                  ]}
                >
                  <Text
                    style={[styles.emotionText, { color: dream.accentColor }]}
                  >
                    {t(dream.emotionKey)}
                  </Text>
                </View>
                <Text style={styles.cardSummary}>{t(dream.summaryKey)}</Text>
              </View>
            </View>
          ))}
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 22,
    paddingTop: 10,
  },
  kicker: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
    maxWidth: 250,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.textFaint,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 68,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  streakNumber: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
  },
  streakLabel: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  heroPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 260,
    overflow: 'hidden',
    padding: 22,
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.46,
    shadowRadius: 24,
  },
  orbitLarge: {
    backgroundColor: `${COLORS.primaryAccent}1F`,
    borderColor: `${COLORS.primaryAccent}4D`,
    borderRadius: 82,
    borderWidth: 1,
    height: 164,
    position: 'absolute',
    right: -38,
    top: -46,
    width: 164,
  },
  orbitSmall: {
    backgroundColor: `${COLORS.secondaryAccent}24`,
    borderColor: `${COLORS.secondaryAccent}59`,
    borderRadius: 38,
    borderWidth: 1,
    height: 76,
    position: 'absolute',
    right: 34,
    top: 48,
    width: 76,
  },
  heroEyebrow: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  heroTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    maxWidth: 260,
  },
  heroBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: 24,
    marginTop: 12,
    maxWidth: 290,
  },
  primaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryAccent,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 50,
    minWidth: 180,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  sectionHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 28,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
  },
  sectionMeta: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textFaint,
  },
  dreamList: {
    gap: 14,
  },
  dreamCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    flexDirection: 'row',
    minHeight: 146,
    overflow: 'hidden',
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  emotionStrip: {
    width: 4,
  },
  dreamCardContent: {
    flex: 1,
    padding: 16,
  },
  cardTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
    fontWeight: '700',
    paddingRight: 12,
  },
  cardDate: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textFaint,
  },
  emotionChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  emotionText: {
    ...TYPOGRAPHY.badge,
  },
  cardSummary: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
  },
});

export default HomeScreen;
