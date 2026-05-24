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

import { setLanguage, t, useI18n } from '../lib/i18n';
import { useAuthStore } from '../store/authStore';
import type { LocaleKeys, SupportedLanguage } from '../types/i18n';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type ArchetypeKey = 'self' | 'persona' | 'shadow' | 'anima' | 'sage';

// type Props = {
//   onNavigateToTab?: (tab: 'Home' | 'Journal' | 'Profile') => void;
// };

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
      title: "自性核心 (The Self)",
      ratio: "84%",
      text: "心靈結構的中心與整合起點。在您的夢境中常以「黃金巨鹿」、「巨鯨」等強大溫柔守護者或宿命神兆投影。代表您正逐漸調和外在面具與內在本能，心靈秩序高度平衡。",
      color: "#F0A86E",
      border: "rgba(240, 168, 110, 0.4)",
      bg: "rgba(240, 168, 110, 0.08)",
    },
    persona: {
      title: "人格面具 (Persona)",
      ratio: "65%",
      text: "適應外界與社會社交的防禦外殼。常用夢中的「制服」、「面具」、「舞臺」或「水晶牆壁」安全邊界來體現。當前指標中等，反映您在社交中既能良好應對，又未迷失真我。",
      color: "#7B6EF6",
      border: "rgba(123, 110, 246, 0.4)",
      bg: "rgba(123, 110, 246, 0.08)",
    },
    shadow: {
      title: "心理陰影 (The Shadow)",
      ratio: "48%",
      text: "潛意識中被理性、文明排斥壓抑的本能或恐懼。在夢中表現為「追趕的黑影子」、「失去扶手的險峻階梯」或「深淵赤紅崩塌」。接納陰影被視為自我強大創造力的源泉。",
      color: "#E06B8B",
      border: "rgba(224, 107, 139, 0.4)",
      bg: "rgba(224, 107, 139, 0.08)",
    },
    anima: {
      title: "阿尼瑪 (Anima)",
      ratio: "72%",
      text: "生命中陰陽和能量共振的安全通路。在梦中，常被隱喻為「身披星紗的指引女神」或「深海玻璃溫室中目標深邃的同伴」。驅策著您的靈性、美學感受能力向外舒展開展。",
      color: "#5BC4A0",
      border: "rgba(91, 196, 160, 0.4)",
      bg: "rgba(91, 196, 160, 0.08)",
    },
    sage: {
      title: "智慧智者 (The Sage)",
      ratio: "58%",
      text: "永恆本源與精神指引的代名詞。在近期梦境中多以「古老浩瀚圖書館」、「淡藍色發光蝴蝶」或「記住潮汐方向」的聲音印刻。提示您近期重大決策時可多信任內在直覺。",
      color: "#E89B4D",
      border: "rgba(232, 155, 77, 0.4)",
      bg: "rgba(232, 155, 77, 0.08)",
    },
  };

  const activeA = archetypes[selectedArchetype];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>心理學自性中心</Text>
          <View style={styles.brandRow}>
            <Text style={styles.title}>榮格心靈整合盤</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>PSI v1.2</Text>
            </View>
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

          {/* Glowing central Miracle奇点 orb */}
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
              <Text style={styles.integrationLabel}>潛意識自我統合比例 (PSI Coherence)</Text>
            </View>
            <Text style={[styles.integrationValue, { color: COLORS.success }]}>偏高 (HIGH)</Text>
          </View>
          
          <View style={styles.integrationBarBg}>
            <View style={[styles.integrationBarFill, { width: '84%' }]} />
          </View>
          
          <Text style={styles.integrationDescription}>
            您的夢絮在 RAG 知識網格中展示出較低的內部衝突。智慧精靈（阿尼瑪）引渡良好，焦慮投射逐步下降，內在自性核心（Self）正在重塑、聚合中。
          </Text>
        </View>

        {/* Archetypes selectors and details breakout */}
        <View style={styles.archetypeSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✦ 點選探秘心靈原型</Text>
            <Text style={styles.sectionMeta}>榮格潛意識對齊</Text>
          </View>

          {/* Tab Selector buttons */}
          <View style={styles.archetypeTabsGrid}>
            {[
              { key: 'self', label: '自性', emoji: '✨' },
              { key: 'persona', label: '人格', emoji: '🎭' },
              { key: 'shadow', label: '陰影', emoji: '👿' },
              { key: 'anima', label: '阿尼', emoji: '🍃' },
              { key: 'sage', label: '智者', emoji: '🦉' },
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
                  潛意識占比 {activeA.ratio}
                </Text>
              </View>
            </View>
            <Text style={styles.detailDescription}>{activeA.text}</Text>
          </View>
        </View>

        {/* Separator line */}
        <View style={styles.divider} />

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
          {SETTINGS.map(setting => (
            <View key={setting.labelKey} style={styles.settingRow}>
              <Text style={styles.settingLabel}>{t(setting.labelKey)}</Text>
              <Text style={styles.settingValue}>{t(setting.valueKey)}</Text>
            </View>
          ))}
        </View>

        {/* Translation locales selector */}
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

        {/* Premium sign out button */}
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
  versionBadge: {
    backgroundColor: `${COLORS.primaryAccent}26`,
    borderColor: `${COLORS.primaryAccent}40`,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  versionText: {
    fontSize: 9,
    fontFamily: 'monospace',
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
  divider: {
    height: 1,
    backgroundColor: COLORS.surface2,
    marginVertical: 14,
    opacity: 0.5,
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

export default ProfileScreen;
