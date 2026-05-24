import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '../lib/i18n';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDreamStore } from '../store/dreamStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamDetail'>;

const getEmotionStyles = (emotion: string) => {
  switch (emotion) {
    case 'nightmare':
      return { bg: 'rgba(224, 107, 139, 0.15)', text: '#E06B8B', tag: '👿 夢魘' };
    case 'anxiety':
      return { bg: 'rgba(232, 155, 77, 0.15)', text: '#E89B4D', tag: '🌪️ 焦慮' };
    case 'calm':
      return { bg: 'rgba(91, 196, 160, 0.15)', text: '#5BC4A0', tag: '🍃 平靜' };
    case 'joy':
      return { bg: 'rgba(123, 110, 246, 0.15)', text: '#7B6EF6', tag: '✨ 奇妙' };
    default:
      return { bg: 'rgba(139, 130, 176, 0.15)', text: '#8B82B0', tag: '💭 中性' };
  }
};

function DreamDetailScreen({ route }: Props): React.JSX.Element {
  const dream = useDreamStore(state =>
    state.history.find(record => record.id === route.params.dreamId),
  );
  
  const history = useDreamStore(state => state.history);
  const setHistory = useDreamStore(state => state.setHistory);

  // Helper to dynamically translate or fallback to custom strings
  const renderText = useCallback((textKey: string): string => {
    if (!textKey) return '';
    const localizedKeys = [
      'dreamOneTitle', 'dreamOneDate', 'dreamOneEmotion', 'dreamOneSummary', 'dreamOneContent', 'dreamOneInterpretation',
      'dreamTwoTitle', 'dreamTwoDate', 'dreamTwoEmotion', 'dreamTwoSummary', 'dreamTwoContent', 'dreamTwoInterpretation',
      'dreamDetailKicker', 'dreamDetailNotFoundTitle', 'dreamDetailDreamLabel', 'dreamDetailInterpretationLabel', 'dreamDetailMissingBody'
    ];
    if (localizedKeys.includes(textKey)) {
      return t(textKey as any);
    }
    return textKey;
  }, []);

  const handleToggleFavorite = () => {
    if (!dream) return;
    const updatedHistory = history.map(item => {
      if (item.id === dream.id) {
        // @ts-ignore
        const isFav = !item.isFavorite;
        return { ...item, isFavorite: isFav };
      }
      return item;
    });
    setHistory(updatedHistory);
  };

  // Predefined high-fidelity symbolisms fallback for seeds
  const getSymbolisms = () => {
    if (!dream) return [];
    
    // @ts-ignore
    if (dream.symbolism) return dream.symbolism;

    if (dream.id === 'moon-garden') {
      return [
        { symbol: '鎖著的門', meaning: '代表心靈邊界，暗示某些個人隱私或尚未準備好被大眾窺視的特質。' },
        { symbol: '紫色月光', meaning: '映射深層直覺與神秘心境，提示夢者可能正經歷某種溫和的感性覺察。' },
        { symbol: '玫瑰花叢', meaning: '象徵渴望與潛在的自我表露，暗示玫瑰深處有事物在等待你被發掘。' }
      ];
    }

    if (dream.id === 'orange-train') {
      return [
        { symbol: '黎明火車', meaning: '轉變的載體，預示生活方向或職涯情感正在進行悄然的重塑與提速。' },
        { symbol: '童年街道', meaning: '潛意識對安全感與歸屬感的歸航，說明現實中某些抉擇在尋求源頭指引。' },
        { symbol: '無垠海面', meaning: '情感能量的浩瀚無垠，暗示需要包容、梳理複雜的心靈波瀾。' }
      ];
    }

    // Default basic fallback
    return [
      { symbol: '夢絮載體', meaning: '意象在潛意識中激盪，預示著大腦正在對白天的零碎記憶進行修剪與提純。' }
    ];
  };

  const getTheme = () => {
    if (!dream) return '';
    // @ts-ignore
    if (dream.interpretationKey) return renderText(dream.interpretationKey);
    return renderText(dream.titleKey);
  };

  // @ts-ignore
  const isFavorite = dream ? !!dream.isFavorite : false;
  // @ts-ignore
  const confidenceScore = dream?.confidenceScore || (dream?.id === 'moon-garden' ? 92 : 88);

  const emoStyle = dream ? getEmotionStyles(dream.emotionKey) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {dream && emoStyle ? (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Custom detail header */}
          <View style={styles.headerBlock}>
            <View style={styles.headerBlockLeft}>
              <Text style={styles.kicker}>✨ 夢之本源細節檔案</Text>
              <Text style={styles.title}>{renderText(dream.titleKey)}</Text>
            </View>
            
            <Pressable
              accessibilityRole="button"
              onPress={handleToggleFavorite}
              style={[
                styles.favButton,
                isFavorite && styles.favButtonActive
              ]}
            >
              <Text style={[styles.favIcon, isFavorite && styles.favIconActive]}>
                {isFavorite ? '★' : '☆'}
              </Text>
            </Pressable>
          </View>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <Text style={styles.metaDate}>
              {renderText(dream.createdAtKey)} · 07:02 AM
            </Text>
            
            <View style={[styles.emotionChip, { backgroundColor: emoStyle.bg }]}>
              <Text style={[styles.emotionText, { color: emoStyle.text }]}>
                {emoStyle.tag}
              </Text>
            </View>
          </View>

          {/* Content panel */}
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>昨夜夢絮</Text>
            <Text style={styles.bodyText}>{renderText(dream.dreamContentKey)}</Text>
          </View>

          {/* AI report panel */}
          <View style={styles.aiPanel}>
            <View style={styles.aiPanelHeader}>
              <View style={styles.aiPanelTitleRow}>
                <Text style={styles.aiSparkle}>✨</Text>
                <Text style={styles.aiPanelTitle}>AI 深層釋義報告 (L3精選款)</Text>
              </View>
              <Text style={styles.aiConfidence}>置信度: {confidenceScore}%</Text>
            </View>

            {/* Core theme */}
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionLabel}>✦ 釋夢心核主題</Text>
              <Text style={styles.aiSectionValue}>{getTheme()}</Text>
            </View>

            {/* Symbolisms */}
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionLabel}>✦ 潛意識象徵解體</Text>
              <View style={styles.symbolsList}>
                {getSymbolisms().map((sym: { symbol: string; meaning: string }, idx: number) => (
                  <View key={idx} style={styles.symbolCard}>
                    <Text style={styles.symbolTitle}>「{sym.symbol}」</Text>
                    <Text style={styles.symbolMeaning}>{sym.meaning}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Guidance */}
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionLabel}>✦ 心靈整合指引</Text>
              <View style={styles.guidanceCard}>
                <Text style={styles.guidanceText}>
                  {dream.id === 'moon-garden'
                    ? '建議清晨手寫夢境碎片，通過鑰匙隱喻嘗試解答現實中未決的一道關卡，將潛在直覺帶入白天事務。'
                    : dream.id === 'orange-train'
                    ? '火車方向明確但軌跡奇特。多信任你的直覺，本週可嘗試與舊友取得聯繫，藉助回溯找尋靈感。'
                    : '您正在向某種靈性思維或創作轉型。建議每天早晨靜坐5分鐘重塑精神核心。'}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>⚠️</Text>
          <Text style={styles.notFoundTitle}>{t('dreamDetailNotFoundTitle')}</Text>
          <Text style={styles.notFoundText}>{t('dreamDetailMissingBody')}</Text>
        </View>
      )}
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
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerBlockLeft: {
    flex: 1,
    paddingRight: 16,
  },
  kicker: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  favButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favButtonActive: {
    borderColor: 'rgba(240, 168, 110, 0.35)',
  },
  favIcon: {
    fontSize: 18,
    color: COLORS.textFaint,
  },
  favIconActive: {
    color: COLORS.secondaryAccent,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
  },
  emotionChip: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  emotionText: {
    fontSize: 9,
    fontWeight: '700',
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  panelLabel: {
    fontSize: 9,
    color: COLORS.textFaint,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  bodyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  aiPanel: {
    backgroundColor: 'rgba(30, 26, 46, 0.4)',
    borderColor: 'rgba(123, 110, 246, 0.2)',
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 16,
  },
  aiPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface2,
    paddingBottom: 10,
    marginBottom: 14,
  },
  aiPanelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSparkle: {
    fontSize: 12,
    marginRight: 6,
  },
  aiPanelTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryAccent,
  },
  aiConfidence: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: COLORS.success,
  },
  aiSection: {
    marginBottom: 16,
  },
  aiSectionLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  aiSectionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 16,
  },
  symbolsList: {
    gap: 8,
    marginTop: 4,
  },
  symbolCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  symbolTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondaryAccent,
    marginBottom: 2,
  },
  symbolMeaning: {
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
  guidanceCard: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.success,
    paddingLeft: 10,
    marginTop: 4,
  },
  guidanceText: {
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  notFoundIcon: {
    fontSize: 32,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default DreamDetailScreen;
