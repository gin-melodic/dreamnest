import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
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
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type ArchetypeKey = 'self' | 'persona' | 'shadow' | 'anima' | 'sage';

function ProfileScreen(): React.JSX.Element {
  useI18n();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Selected Jungian Archetype
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeKey>('self');

  // Animation hooks
  const mandalaRotation = useSharedValue(0);
  const coreScale = useSharedValue(1);

  const animatedMandalaStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${mandalaRotation.value}deg` }],
  }));

  const animatedCoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
  }));

  useEffect(() => {
    // Spin Mandala Outer Ring
    mandalaRotation.value = withRepeat(
      withTiming(360, {
        duration: 35000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Pulse core
    coreScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 2000 }),
        withTiming(1.0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, [mandalaRotation, coreScale]);

  // Archetypes definitions
  const archetypes = {
    self: {
      title: t('profileArchetypeSelfTitle'),
      ratio: "84%",
      text: t('profileArchetypeSelfText'),
      color: "#F0A86E",
      border: "rgba(240, 168, 110, 0.4)",
      bg: "rgba(240, 168, 110, 0.08)",
    },
    persona: {
      title: t('profileArchetypePersonaTitle'),
      ratio: "65%",
      text: t('profileArchetypePersonaText'),
      color: "#7B6EF6",
      border: "rgba(123, 110, 246, 0.4)",
      bg: "rgba(123, 110, 246, 0.08)",
    },
    shadow: {
      title: t('profileArchetypeShadowTitle'),
      ratio: "48%",
      text: t('profileArchetypeShadowText'),
      color: "#E06B8B",
      border: "rgba(224, 107, 139, 0.4)",
      bg: "rgba(224, 107, 139, 0.08)",
    },
    anima: {
      title: t('profileArchetypeAnimaTitle'),
      ratio: "72%",
      text: t('profileArchetypeAnimaText'),
      color: "#5BC4A0",
      border: "rgba(91, 196, 160, 0.4)",
      bg: "rgba(91, 196, 160, 0.08)",
    },
    sage: {
      title: t('profileArchetypeSageTitle'),
      ratio: "58%",
      text: t('profileArchetypeSageText'),
      color: "#E89B4D",
      border: "rgba(232, 155, 77, 0.4)",
      bg: "rgba(232, 155, 77, 0.08)",
    },
  };

  const activeA = archetypes[selectedArchetype];
  const handleOpenSettings = (): void => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>{t('profileMandalaKicker')}</Text>
          <View style={styles.brandRow}>
            <Text style={styles.title}>{t('profileMandalaTitle')}</Text>
            <Pressable
              accessibilityLabel={t('commonSettings')}
              accessibilityRole="button"
              onPress={handleOpenSettings}
              style={styles.settingsButton}
            >
              <Text style={styles.settingsButtonIcon}>⚙︎</Text>
            </Pressable>
          </View>
        </View>

        {/* Concentric Rotating Star Self Mandala */}
        <View style={styles.mandalaWrapper}>
          {/* Animated concentric rings */}
          <Animated.View style={[styles.mandalaOuterRing, animatedMandalaStyle]} />
          <Animated.View style={[styles.mandalaInnerRing, animatedMandalaStyle, { transform: [{ rotate: '-60deg' }] }]} />

          {/* Archetype static nodes on rings */}
          <View style={styles.nodesContainer}>
            {/* Persona Node */}
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedArchetype('persona')}
              style={[
                styles.archetypeNode,
                { top: 10 },
                selectedArchetype === 'persona' && styles.archetypeNodeActive
              ]}
            >
              <Text style={styles.nodeEmoji}>🎭</Text>
            </Pressable>

            {/* Shadow Node */}
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedArchetype('shadow')}
              style={[
                styles.archetypeNode,
                { bottom: 10 },
                selectedArchetype === 'shadow' && styles.archetypeNodeActive
              ]}
            >
              <Text style={styles.nodeEmoji}>👿</Text>
            </Pressable>

            {/* Anima Node */}
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedArchetype('anima')}
              style={[
                styles.archetypeNode,
                { left: 10 },
                selectedArchetype === 'anima' && styles.archetypeNodeActive
              ]}
            >
              <Text style={styles.nodeEmoji}>🍃</Text>
            </Pressable>

            {/* Sage Node */}
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedArchetype('sage')}
              style={[
                styles.archetypeNode,
                { right: 10 },
                selectedArchetype === 'sage' && styles.archetypeNodeActive
              ]}
            >
              <Text style={styles.nodeEmoji}>🦉</Text>
            </Pressable>
          </View>

          {/* Glowing central mandala core orb */}
          <Animated.View style={[styles.mandalaCore, animatedCoreStyle]}>
            <View style={styles.mandalaCoreInner}>
              <Text style={styles.coreSparkle}>✨</Text>
              <Text style={styles.corePercentage}>84%</Text>
            </View>
          </Animated.View>
        </View>

        {/* Coherence integration meter */}
        <View style={styles.integrationPanel}>
          <View style={styles.integrationHeader}>
            <View style={styles.coherenceRow}>
              <View style={[styles.coherenceIndicatorDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.integrationLabel}>{t('profileIntegrationLabel')}</Text>
            </View>
            <Text style={[styles.integrationValue, { color: COLORS.success }]}>{t('profileIntegrationValue')}</Text>
          </View>

          <View style={styles.integrationBarBg}>
            <View style={[styles.integrationBarFill, { width: '84%' }]} />
          </View>

          <Text style={styles.integrationDescription}>
            {t('profileIntegrationDescription')}
          </Text>
        </View>

        {/* Archetypes selectors and details breakout */}
        <View style={styles.archetypeSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('profileArchetypeSectionTitle')}</Text>
            <Text style={styles.sectionMeta}>{t('profileArchetypeSectionMeta')}</Text>
          </View>

          {/* Tab Selector buttons */}
          <View style={styles.archetypeTabsGrid}>
            {[
              { key: 'self', label: t('profileArchetypeSelfTab'), emoji: '✨' },
              { key: 'persona', label: t('profileArchetypePersonaTab'), emoji: '🎭' },
              { key: 'shadow', label: t('profileArchetypeShadowTab'), emoji: '👿' },
              { key: 'anima', label: t('profileArchetypeAnimaTab'), emoji: '🍃' },
              { key: 'sage', label: t('profileArchetypeSageTab'), emoji: '🦉' },
            ].map(tab => (
              <Pressable
                accessibilityRole="button"
                key={tab.key}
                onPress={() => setSelectedArchetype(tab.key as ArchetypeKey)}
                style={[
                  styles.archetypeTab,
                  selectedArchetype === tab.key && styles.archetypeTabActive
                ]}
              >
                <Text style={styles.archetypeTabEmoji}>{tab.emoji}</Text>
                <Text style={styles.archetypeTabLabel}>{tab.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Active Detail break card */}
          <View style={[
            styles.archetypeDetailCard,
            { borderColor: activeA.border, backgroundColor: activeA.bg }
          ]}>
            <View style={styles.detailCardHeader}>
              <Text style={[styles.detailTitle, { color: activeA.color }]}>
                {activeA.title}
              </Text>
              <View style={styles.detailCardBadge}>
                <Text style={[styles.detailCardBadgeText, { color: activeA.color }]}>
                  {t('profileArchetypeRatioPrefix')} {activeA.ratio}
                </Text>
              </View>
            </View>
            <Text style={styles.detailDescription}>{activeA.text}</Text>
          </View>
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
    paddingBottom: 50,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  kicker: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: `${COLORS.primaryAccent}26`,
    borderColor: `${COLORS.primaryAccent}40`,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    borderRadius: 8,
    width: 36,
  },
  settingsButtonIcon: {
    fontSize: 18,
    color: COLORS.primaryAccent,
    fontWeight: '700',
  },
  mandalaWrapper: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  mandalaOuterRing: {
    position: 'absolute',
    width: 184,
    height: 184,
    borderRadius: 92,
    borderColor: 'rgba(123, 110, 246, 0.15)',
    borderWidth: 1.5,
  },
  mandalaInnerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderColor: 'rgba(240, 168, 110, 0.2)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  nodesContainer: {
    position: 'absolute',
    width: 184,
    height: 184,
    justifyContent: 'center',
    alignItems: 'center',
  },
  archetypeNode: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderColor: 'rgba(123, 110, 246, 0.3)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  archetypeNodeActive: {
    borderColor: COLORS.primaryAccent,
    transform: [{ scale: 1.15 }],
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  nodeEmoji: {
    fontSize: 13,
  },
  mandalaCore: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 6,
    backgroundColor: 'rgba(123, 110, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  mandalaCoreInner: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    backgroundColor: COLORS.surface2,
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coreSparkle: {
    fontSize: 16,
    marginBottom: 2,
  },
  corePercentage: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  integrationPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  coherenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  coherenceIndicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  integrationLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  integrationValue: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  integrationBarBg: {
    height: 6,
    backgroundColor: COLORS.surface2,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  integrationBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  integrationDescription: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  archetypeSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sectionMeta: {
    fontSize: 9,
    color: COLORS.textFaint,
  },
  archetypeTabsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 12,
  },
  archetypeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    opacity: 0.6,
  },
  archetypeTabActive: {
    backgroundColor: COLORS.surface2,
    opacity: 1.0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  archetypeTabEmoji: {
    fontSize: 14,
    marginBottom: 2,
  },
  archetypeTabLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  archetypeDetailCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    minHeight: 120,
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  detailCardBadge: {
    backgroundColor: COLORS.surface2,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  detailCardBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  detailDescription: {
    fontSize: 10.5,
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
});

export default ProfileScreen;
