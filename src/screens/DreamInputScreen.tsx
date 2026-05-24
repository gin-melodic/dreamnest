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
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamInput'>;

type EmotionType = 'joy' | 'calm' | 'anxiety' | 'nightmare' | 'neutral';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Helper function to return emotion-specific colors in React Native styles
const getEmotionStyles = (emotion: EmotionType) => {
  switch (emotion) {
    case 'nightmare':
      return {
        bg: 'rgba(224, 107, 139, 0.15)',
        border: 'rgba(224, 107, 139, 0.4)',
        text: '#E06B8B',
        icon: '👿',
        label: '夢魘',
      };
    case 'anxiety':
      return {
        bg: 'rgba(232, 155, 77, 0.15)',
        border: 'rgba(232, 155, 77, 0.4)',
        text: '#E89B4D',
        icon: '🌪️',
        label: '焦慮',
      };
    case 'calm':
      return {
        bg: 'rgba(91, 196, 160, 0.15)',
        border: 'rgba(91, 196, 160, 0.4)',
        text: '#5BC4A0',
        icon: '🍃',
        label: '平靜',
      };
    case 'joy':
      return {
        bg: 'rgba(123, 110, 246, 0.15)',
        border: 'rgba(123, 110, 246, 0.4)',
        text: '#7B6EF6',
        icon: '✨',
        label: '奇妙',
      };
    default:
      return {
        bg: 'rgba(139, 130, 176, 0.15)',
        border: 'rgba(139, 130, 176, 0.4)',
        text: '#8B82B0',
        icon: '💭',
        label: '中性',
      };
  }
};

function DreamInputScreen({ navigation }: Props): React.JSX.Element {
  useI18n();
  const [dreamContent, setDreamContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('joy');
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
      // @ts-ignore (Optional extra parameter for custom stream theme)
      emotion: selectedEmotion
    });
  };

  const injectSmartTemplate = (): void => {
    setDreamContent(
      '我夢見深夜在空無一人的深海圖書館裡。高聳的书架上擺滿了閃出發光銀砂的書卷。我踩在軟綿綿的古老羊皮紙上，前方飄落下一隻巨大的淡藍色半透明發光蝴蝶，牠在空中繞了三圈後，落到了一本大厚書的中間，上面浮游著字樣：「一切過去的，都絕非徹底逝去」...'
    );
  };

  const emotionsList: EmotionType[] = ['joy', 'calm', 'anxiety', 'nightmare', 'neutral'];

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
            <Text style={styles.kicker}>✨ 深夜沉浸寫夢池</Text>
            <Text style={styles.title}>{t('dreamInputTitle')}</Text>
            <Text style={styles.subtitle}>{t('dreamInputSubtitle')}</Text>
          </View>

          {/* Immersive input textarea container */}
          <View style={[
            styles.inputPanel,
            isFocused && styles.inputPanelFocused
          ]}>
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
                <Text style={styles.polishButtonText}>🪄 智能注入</Text>
              </Pressable>
              
              <Text style={[styles.characterCount, { color: countTone }]}>
                {characterCount}/500 {t('dreamInputCharacters')}
              </Text>
            </View>
          </View>

          {/* Emotional selection chips */}
          <View style={styles.emotionSection}>
            <View style={styles.emotionHeader}>
              <Text style={styles.emotionTitle}>🏷️ 昨夜夢境裡的主情緒是？</Text>
              <Text style={styles.emotionMeta}>彈跳微動效</Text>
            </View>

            <View style={styles.emotionGrid}>
              {emotionsList.map((emo) => {
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
                        : styles.emotionChipInactive
                    ]}
                  >
                    <Text style={styles.emotionIcon}>{emoStyle.icon}</Text>
                    <Text
                      style={[
                        styles.emotionLabel,
                        isSelected 
                          ? { color: emoStyle.text, fontWeight: '700' }
                          : styles.emotionLabelInactive
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
              🔮 引渡星宿 · 開始 AI 夢境解讀
            </Text>
          </AnimatedPressable>

          {/* Informational Hint Card */}
          <View style={styles.hintCard}>
            <Text style={styles.hintIcon}>ℹ️</Text>
            <Text style={styles.hintText}>
              解讀基於 DreamNest 腦波圖譜（L1-L3三級架構）。模型不僅將通過大語言能力拆解意象，還會與您的自我夢庫做 RAG 向量匹配。
            </Text>
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
