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

import { t, useI18n } from '../lib/i18n';
import {
  MOCK_DEFAULT_DREAM_DETAIL,
  MOCK_DREAM_DETAIL_BY_ID,
  MOCK_EMOTION_STYLES,
  MOCK_LOCALIZED_DREAM_TEXT_KEYS,
} from '../mocks/appMockData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDreamStore } from '../store/dreamStore';
import type { LocaleKeys } from '../types/i18n';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamDetail'>;

const getEmotionStyles = (emotion: string) => {
  const style =
    MOCK_EMOTION_STYLES[emotion as keyof typeof MOCK_EMOTION_STYLES] ??
    MOCK_EMOTION_STYLES.neutral;

  return {
    bg: style.bg,
    text: style.text,
    tag: `${style.icon} ${t(style.labelKey)}`,
  };
};

function DreamDetailScreen({ route }: Props): React.JSX.Element {
  useI18n();
  const dream = useDreamStore(state =>
    state.history.find(record => record.id === route.params.dreamId),
  );

  const history = useDreamStore(state => state.history);
  const setHistory = useDreamStore(state => state.setHistory);

  // Helper to dynamically translate or fallback to custom strings
  const renderText = useCallback((textKey: string): string => {
    if (!textKey) return '';
    if (
      (MOCK_LOCALIZED_DREAM_TEXT_KEYS as readonly string[]).includes(textKey)
    ) {
      return t(textKey as keyof LocaleKeys);
    }
    return textKey;
  }, []);

  const handleToggleFavorite = () => {
    if (!dream) return;
    const updatedHistory = history.map(item => {
      if (item.id === dream.id) {
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

    if (dream.symbolism) return dream.symbolism;

    const detail =
      MOCK_DREAM_DETAIL_BY_ID[
        dream.id as keyof typeof MOCK_DREAM_DETAIL_BY_ID
      ] ?? MOCK_DEFAULT_DREAM_DETAIL;

    return detail.symbols.map(symbol => ({
      symbol: t(symbol.symbolKey),
      meaning: t(symbol.meaningKey),
    }));
  };

  const getTheme = () => {
    if (!dream) return '';
    if (dream.interpretationKey) return renderText(dream.interpretationKey);
    return renderText(dream.titleKey);
  };

  const isFavorite = dream ? !!dream.isFavorite : false;
  const dreamDetail = dream
    ? MOCK_DREAM_DETAIL_BY_ID[
        dream.id as keyof typeof MOCK_DREAM_DETAIL_BY_ID
      ] ?? MOCK_DEFAULT_DREAM_DETAIL
    : MOCK_DEFAULT_DREAM_DETAIL;
  const confidenceScore = dream?.confidenceScore || dreamDetail.confidenceScore;

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
              <Text style={styles.kicker}>
                {t('dreamDetailImmersiveKicker')}
              </Text>
              <Text style={styles.title}>{renderText(dream.titleKey)}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleToggleFavorite}
              style={[styles.favButton, isFavorite && styles.favButtonActive]}
            >
              <Text
                style={[styles.favIcon, isFavorite && styles.favIconActive]}
              >
                {isFavorite ? '★' : '☆'}
              </Text>
            </Pressable>
          </View>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <Text style={styles.metaDate}>
              {renderText(dream.createdAtKey)} · {dreamDetail.createdTime}
            </Text>

            <View
              style={[styles.emotionChip, { backgroundColor: emoStyle.bg }]}
            >
              <Text style={[styles.emotionText, { color: emoStyle.text }]}>
                {emoStyle.tag}
              </Text>
            </View>
          </View>

          {/* Content panel */}
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>{t('dreamDetailPanelLabel')}</Text>
            <Text style={styles.bodyText}>
              {renderText(dream.dreamContentKey)}
            </Text>
          </View>

          {/* AI report panel */}
          <View style={styles.aiPanel}>
            <View style={styles.aiPanelHeader}>
              <View style={styles.aiPanelTitleRow}>
                <Text style={styles.aiSparkle}>✨</Text>
                <Text style={styles.aiPanelTitle}>
                  {t('dreamDetailAiReportTitle')}
                </Text>
              </View>
              <Text style={styles.aiConfidence}>
                {t('dreamDetailConfidencePrefix')} {confidenceScore}%
              </Text>
            </View>

            {/* Core theme */}
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionLabel}>
                {t('dreamDetailCoreThemeLabel')}
              </Text>
              <Text style={styles.aiSectionValue}>{getTheme()}</Text>
            </View>

            {/* Symbolisms */}
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionLabel}>
                {t('dreamDetailSymbolismLabel')}
              </Text>
              <View style={styles.symbolsList}>
                {getSymbolisms().map(
                  (sym: { symbol: string; meaning: string }, idx: number) => (
                    <View key={idx} style={styles.symbolCard}>
                      <Text style={styles.symbolTitle}>「{sym.symbol}」</Text>
                      <Text style={styles.symbolMeaning}>{sym.meaning}</Text>
                    </View>
                  ),
                )}
              </View>
            </View>

            {/* Guidance */}
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionLabel}>
                {t('dreamDetailGuidanceLabel')}
              </Text>
              <View style={styles.guidanceCard}>
                <Text style={styles.guidanceText}>
                  {t(dreamDetail.guidanceKey)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>⚠️</Text>
          <Text style={styles.notFoundTitle}>
            {t('dreamDetailNotFoundTitle')}
          </Text>
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
