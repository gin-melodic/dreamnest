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
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDreamStore } from '../store/dreamStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamResult'>;

type EmotionType = 'joy' | 'calm' | 'anxiety' | 'nightmare' | 'neutral';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const getEmotionStyles = (emotion: EmotionType) => {
  switch (emotion) {
    case 'nightmare':
      return {
        bg: 'rgba(224, 107, 139, 0.15)',
        border: 'rgba(224, 107, 139, 0.4)',
        text: '#E06B8B',
        tag: '👿 夢魘',
        colorCode: '#E06B8B',
      };
    case 'anxiety':
      return {
        bg: 'rgba(232, 155, 77, 0.15)',
        border: 'rgba(232, 155, 77, 0.4)',
        text: '#E89B4D',
        tag: '🌪️ 焦慮',
        colorCode: '#E89B4D',
      };
    case 'calm':
      return {
        bg: 'rgba(91, 196, 160, 0.15)',
        border: 'rgba(91, 196, 160, 0.4)',
        text: '#5BC4A0',
        tag: '🍃 平靜',
        colorCode: '#5BC4A0',
      };
    case 'joy':
      return {
        bg: 'rgba(123, 110, 246, 0.15)',
        border: 'rgba(123, 110, 246, 0.4)',
        text: '#7B6EF6',
        tag: '✨ 奇妙',
        colorCode: '#7B6EF6',
      };
    default:
      return {
        bg: 'rgba(139, 130, 176, 0.15)',
        border: 'rgba(139, 130, 176, 0.4)',
        text: '#8B82B0',
        tag: '💭 中性',
        colorCode: '#8B82B0',
      };
  }
};

function DreamResultScreen({ route, navigation }: Props): React.JSX.Element {
  useI18n();
  const { dreamContent } = route.params;
  
  // @ts-ignore (Retrieve selected emotion from params if present)
  const emotionParam: EmotionType = route.params?.emotion || 'joy';
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

  // Mock symbolism data matching the input emotion
  const generatedAnalysis = useMemo(() => {
    if (emotionParam === 'joy') {
      return {
        title: '懸浮雲境與極光巨鯨的靈性洗禮',
        theme: '水晶宮殿的靈性覺醒與心理探索邊界',
        symbolism: [
          { symbol: '水晶牆壁', meaning: '代表心靈深處的絕對透明性，暗示試圖探尋毫無掩飾的內在真實自我。' },
          { symbol: '唱歌巨鯨', meaning: '海洋巨獸吟唱通常象徵古老的集體無意識，預示深層靈感或療癒正悄然萌發生根。' },
          { symbol: '藍寶石鑰匙', meaning: '對自我心理鎖扣的終極命名權。藍色映射的是理性、智慧與深層靈感通道。' },
          { symbol: '階梯墜落', meaning: '驚醒的催化劑，往往來自超高腦波轉換。這是一種自發性的機體預警機制，保護不被夢境過深吞噬。' }
        ],
        keywords: ['雲境宮殿', '巨鯨', '星紗人'],
        confidence: 94,
      };
    } else if (emotionParam === 'calm') {
      return {
        title: '深海溫室與發光植物的寧靜避難所',
        theme: '潛意識防禦機制的消解與生命本源能量的自我修復',
        symbolism: [
          { symbol: '深海玻璃溫室', meaning: '象徵溫柔安全的自我隔離邊界，代表內心深處渴望遠離喧囂的寧靜港灣。' },
          { symbol: '發光植物', meaning: '心靈深處悄然復甦的生命直覺，預示著被忽視的潛能正開始為你指明方向。' },
          { symbol: '漫步的古鯨', meaning: '象徵靈魂深處的睿智守護者，它無聲的游弋映射著你情緒波瀾的逐步平復。' }
        ],
        keywords: ['海底溫室', '發光植物', '古鯨'],
        confidence: 96,
      };
    } else {
      return {
        title: '迷失鐘錶與倒轉時空的心理象徵',
        theme: '對現實秩序失控的焦慮表徵與自性整合的機體自愈',
        symbolism: [
          { symbol: '倒轉鐘錶', meaning: '代表對時間流逝與掌控力丧失的焦慮，折射出生活節奏可能出現的混亂感。' },
          { symbol: '迷失深淵', meaning: '象徵短暫迷失在集體無意識中，提示需要審視在清醒世界裡被壓抑的焦慮。' },
          { symbol: '微弱蝴蝶', meaning: '指引心靈復歸的微光，象徵雖然處於秩序失控，但重塑核心秩序的動力並未熄滅。' }
        ],
        keywords: ['迷失', '鐘錶倒轉', '微光蝴蝶'],
        confidence: 90,
      };
    }
  }, [emotionParam]);

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
      setStreamText('❖ [L1 引擎] 捕獲模式錨點：分析核心意象 ' + 
        generatedAnalysis.symbolism.map((s: { symbol: string }) => `[${s.symbol}]`).join('、') + 
        `... 匹配機制契合百分比: ${generatedAnalysis.confidence}%\n`
      );
    }, 400);

    // Step 2: L2 neural network resolve (1100ms)
    const t2 = setTimeout(() => {
      setStreamProgress(2);
      progressBarWidth.value = withTiming(50, { duration: 700 });
      setStreamText(prev => prev + '❖ [L2 神經] 初階神經網路腦區解波完成：捕獲情緒峰值：平穩喜悅中夾雜瞬時驚亂。自我狀態：快速眼動期 (REM)...\n');
    }, 1100);

    // Step 3: L3 knowledge graph (1900ms)
    const t3 = setTimeout(() => {
      setStreamProgress(3);
      progressBarWidth.value = withTiming(75, { duration: 800 });
      setStreamText(prev => prev + '❖ [L3 甲骨] 正在啟動 DreamNest 夢境知識圖譜核心關聯器（覆蓋 12,000+ 星網心靈節點）...\n\n');
    }, 1900);

    // Step 4: Stream text rendering of theme (2800ms)
    let interval: any;
    const textToAnimate = `【夢境主體核心】：${generatedAnalysis.theme}\n\n【夢境意象剝離】：\n`;
    
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
          clearInterval(interval);
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
        titleKey: generatedAnalysis.title as any, // Typed so it will bypass localization and render directly
        dreamContentKey: dreamContent as any,
        interpretationKey: generatedAnalysis.theme as any,
        emotionKey: emotionParam as any,
        emotionColor: emoStyle.colorCode,
        createdAtKey: '今天' as any,
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
  }, [dreamContent, emoStyle.colorCode, emotionParam, generatedAnalysis, history, progressBarWidth, setHistory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>✨ AI 星軌多維推導</Text>
          <Text style={styles.title}>{t('dreamResultTitle')}</Text>
          <Text style={styles.subtitle}>
            {isStreaming ? '星軌連通解析中，請保持呼吸安穩...' : 'RAG 星軌解析連通成功'}
          </Text>
        </View>

        {/* Stepper tracker (PhoneSimulator logic) */}
        <View style={styles.stepperCard}>
          <View style={styles.stepperHeader}>
            <Text style={styles.stepperHeaderText}>三級夢魂神經網路算力調度：</Text>
            {isStreaming && <Text style={styles.stepperStatusText}>流式接收中...</Text>}
          </View>
          
          <View style={styles.stepperBubblesRow}>
            {/* Progress Line */}
            <View style={styles.progressBackgroundLine} />
            <Animated.View style={[styles.progressActiveLine, animatedProgressStyle]} />

            {/* Bubble 1: L1 */}
            <View style={styles.bubbleCol}>
              <View style={[
                styles.bubbleCircle,
                streamProgress >= 1 ? styles.bubbleCircleActive : styles.bubbleCircle
              ]}>
                <Text style={[styles.bubbleText, streamProgress >= 1 && styles.bubbleTextActive]}>
                  {streamProgress >= 2 ? '✓' : 'L1'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>意象匹配</Text>
            </View>

            {/* Bubble 2: L2 */}
            <View style={styles.bubbleCol}>
              <View style={[
                styles.bubbleCircle,
                streamProgress >= 2 ? styles.bubbleCircleActive : styles.bubbleCircle
              ]}>
                <Text style={[styles.bubbleText, streamProgress >= 2 && styles.bubbleTextActive]}>
                  {streamProgress >= 3 ? '✓' : 'L2'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>腦波分析</Text>
            </View>

            {/* Bubble 3: L3 */}
            <View style={styles.bubbleCol}>
              <View style={[
                styles.bubbleCircle,
                streamProgress >= 3 ? styles.bubbleCircleActive : styles.bubbleCircle
              ]}>
                <Text style={[styles.bubbleText, streamProgress >= 3 && styles.bubbleTextActive]}>
                  {streamProgress >= 4 ? '✓' : 'L3'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>圖譜對齊</Text>
            </View>

            {/* Bubble 4: Done */}
            <View style={styles.bubbleCol}>
              <View style={[
                styles.bubbleCircle,
                (streamProgress >= 4 && !isStreaming) ? styles.bubbleCircleSuccess : styles.bubbleCircle
              ]}>
                <Text style={[
                  styles.bubbleText,
                  (streamProgress >= 4 && !isStreaming) && styles.bubbleTextSuccess
                ]}>
                  {(streamProgress >= 4 && !isStreaming) ? '✓' : 'Done'}
                </Text>
              </View>
              <Text style={styles.bubbleLabel}>解讀就位</Text>
            </View>
          </View>
        </View>

        {/* Score Dial & Theme (Floating cards) */}
        <View style={styles.metersRow}>
          <View style={styles.meterCardSmall}>
            <Text style={styles.meterSmallLabel}>夢境明晰度</Text>
            <Text style={[styles.meterSmallValue, { color: emoStyle.colorCode }]}>
              ✨ 高 (HIGH)
            </Text>
          </View>
          
          <View style={styles.meterCardLarge}>
            <Text style={styles.meterLargeLabel}>潛意識置信水準</Text>
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
              {confidenceDial}% (極強配比)
            </Text>
          </View>
        </View>

        {/* Typewriter chronicle terminal window */}
        <View style={styles.terminalPanel}>
          <View style={styles.terminalHeader}>
            <View style={[styles.terminalPulseDot, { backgroundColor: emoStyle.colorCode }]} />
            <Text style={styles.terminalHeaderText}>❖ INTERPRETER CHRONICLE:</Text>
          </View>
          
          <Text style={styles.terminalText}>
            {streamText || '❖ 正在引渡昨夜的星雲，請維持呼吸平順。腦電波 REM 模型序列正在連接...'}
          </Text>

          {/* Symbolism breakdown revealed one by one */}
          {!isStreaming && (
            <View style={styles.symbolsSection}>
              <Text style={styles.symbolsTitle}>🔍 核心自性意象剝離</Text>
              
              <View style={styles.symbolsList}>
                {generatedAnalysis.symbolism.map((sym: { symbol: string; meaning: string }, idx: number) => {
                  const isVisible = idx <= revealedSymbolIdx;
                  if (!isVisible) return null;
                  
                  return (
                    <Animated.View
                      entering={FadeInDown.duration(400)}
                      key={idx}
                      style={styles.symbolCard}
                    >
                      <View style={styles.symbolCardHeader}>
                        <View style={[styles.symbolDot, { backgroundColor: COLORS.primaryAccent }]} />
                        <Text style={styles.symbolName}>{sym.symbol}</Text>
                      </View>
                      <Text style={styles.symbolMeaning}>{sym.meaning}</Text>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Premium locker and final actions */}
        {!isStreaming && (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.actionBlock}>
            {/* 29 Diamonds Premium Locker Banner */}
            <View style={styles.premiumBanner}>
              <View style={styles.premiumLeft}>
                <View style={styles.premiumBadgeRow}>
                  <Text style={styles.premiumBadgeText}>L3 占星學者深度腦圖</Text>
                  <Text style={styles.premiumLockEmoji}>🔒</Text>
                </View>
                <Text style={styles.premiumSubtitle}>
                  採用主力百億LLM深度推演夢境在心理治療中與當前執念的深層糾結，提供專屬睡前解憂音頻。
                </Text>
              </View>
              
              <Pressable accessibilityRole="button" style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>解鎖 29 鑽</Text>
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
              <Text style={styles.saveButtonText}>儲存至夢境日記本並結束</Text>
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
