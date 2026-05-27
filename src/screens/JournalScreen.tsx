import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import {
  MOCK_EMOTION_STYLES,
  MOCK_JOURNAL_FILTERS,
  MOCK_LOCALIZED_DREAM_TEXT_KEYS,
  type MockEmotionFilter,
} from '../mocks/appMockData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { DreamRecord } from '../store/dreamStore';
import { useDreamStore } from '../store/dreamStore';
import type { LocaleKeys } from '../types/i18n';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = {
  onNavigateToTab?: (tab: 'Home' | 'Journal' | 'Profile') => void;
};

// Helper function to return emotion-specific colors
const getEmotionStyles = (emotion: string) => {
  const style =
    MOCK_EMOTION_STYLES[emotion as keyof typeof MOCK_EMOTION_STYLES] ??
    MOCK_EMOTION_STYLES.neutral;

  return {
    ...style,
    tag: `${style.icon} ${t(style.labelKey)}`,
  };
};

function JournalScreen({ onNavigateToTab }: Props): React.JSX.Element {
  const language = useI18n();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const history = useDreamStore(state => state.history);
  const setHistory = useDreamStore(state => state.setHistory);

  // States for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] =
    useState<MockEmotionFilter>('all');

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

  const handleToggleFavorite = useCallback(
    (id: string) => {
      const updatedHistory = history.map(item => {
        if (item.id === id) {
          const isFav = !item.isFavorite;
          return { ...item, isFavorite: isFav };
        }
        return item;
      });
      setHistory(updatedHistory);
    },
    [history, setHistory],
  );

  const handleDeleteDream = useCallback(
    (id: string) => {
      setHistory(history.filter(item => item.id !== id));
    },
    [history, setHistory],
  );

  // Filtered entries list
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const title = renderText(item.titleKey).toLowerCase();
      const content = renderText(item.dreamContentKey).toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = title.includes(query) || content.includes(query);
      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      return (item.emotionKey as string) === (selectedFilter as string);
    });
  }, [history, searchQuery, selectedFilter, renderText]);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: DreamRecord;
      index: number;
    }): React.JSX.Element => {
      const emoStyle = getEmotionStyles(item.emotionKey);

      const keywords = item.aiKeywords || [
        t('journalKeywordSubconscious'),
        t('journalKeywordDreamSymbol'),
      ];
      const isFavorite: boolean = !!item.isFavorite;

      return (
        <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('DreamDetail', { dreamId: item.id })
            }
            style={[styles.dreamCard, { borderLeftColor: emoStyle.colorCode }]}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardDate}>
                  {renderText(item.createdAtKey)}
                </Text>

                <View style={styles.actionButtons}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleToggleFavorite(item.id)}
                    style={styles.cardActionIcon}
                  >
                    <Text
                      style={[
                        styles.starEmoji,
                        isFavorite && styles.starEmojiActive,
                      ]}
                    >
                      {isFavorite ? '★' : '☆'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleDeleteDream(item.id)}
                    style={styles.cardActionIcon}
                  >
                    <Text style={styles.trashEmoji}>🗑️</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.cardMetaRow}>
                <Text style={styles.cardTitle}>
                  {renderText(item.titleKey)}
                </Text>
                <View
                  style={[
                    styles.emotionChip,
                    {
                      backgroundColor: emoStyle.bg,
                      borderColor: emoStyle.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.emotionText, { color: emoStyle.colorCode }]}
                  >
                    {emoStyle.tag}
                  </Text>
                </View>
              </View>

              <Text numberOfLines={2} style={styles.cardSummary}>
                {renderText(item.interpretationKey)}
              </Text>

              {/* Bottom tag chips */}
              <View style={styles.cardFooter}>
                <View style={styles.tagsContainer}>
                  {keywords.map(tag => (
                    <View key={tag} style={styles.tagBadge}>
                      <Text style={styles.tagBadgeText}>
                        #{renderText(tag)}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.modelTierText}>
                  {t('journalModelTier')}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      );
    },
    [navigation, handleToggleFavorite, handleDeleteDream, renderText],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header bar */}
      <View style={styles.header}>
        <Text style={styles.kicker}>{t('journalKicker')}</Text>
        <Text style={styles.title}>{t('journalTitle')}</Text>
        <Text style={styles.subtitle}>{t('journalSubtitle')}</Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchPanel}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          onChangeText={setSearchQuery}
          placeholder={t('journalSearchPlaceholder')}
          placeholderTextColor={COLORS.textFaint}
          style={styles.searchInput}
          value={searchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchBtn}
          >
            <Text style={styles.clearSearchBtnText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Emotion filter chips */}
      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MOCK_JOURNAL_FILTERS}
          contentContainerStyle={styles.filterList}
          keyExtractor={item => item.key}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item.key;
            return (
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelectedFilter(item.key)}
                style={[
                  styles.filterChip,
                  isSelected
                    ? styles.filterChipActive
                    : styles.filterChipInactive,
                ]}
              >
                <Text style={styles.filterEmoji}>{item.emoji}</Text>
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}
                >
                  {item.labelKey ? t(item.labelKey) : item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Main List */}
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredHistory}
        extraData={language}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>{t('journalEmptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('journalEmptySubtitle')}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => onNavigateToTab?.('Home')}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>{t('journalEmptyButton')}</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    gap: 14,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 16,
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
  },
  subtitle: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 18,
  },
  searchPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    height: 48,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
    color: COLORS.textMuted,
  },
  searchInput: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    flex: 1,
    height: '100%',
  },
  clearSearchBtn: {
    padding: 6,
  },
  clearSearchBtnText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  filterWrapper: {
    marginBottom: 16,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.primaryAccent,
  },
  filterChipInactive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
  },
  filterEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: COLORS.textPrimary,
  },
  dreamCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.background,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 4,
    borderLeftWidth: 4,
    minHeight: 146,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 9,
    color: COLORS.textFaint,
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardActionIcon: {
    padding: 4,
  },
  starEmoji: {
    fontSize: 14,
    color: COLORS.textFaint,
  },
  starEmojiActive: {
    color: COLORS.secondaryAccent,
  },
  trashEmoji: {
    fontSize: 12,
    opacity: 0.6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
    flex: 1,
    paddingRight: 10,
  },
  emotionChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  emotionText: {
    fontSize: 9,
    fontWeight: '600',
  },
  cardSummary: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.surface2,
    paddingTop: 10,
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  tagBadge: {
    backgroundColor: `${COLORS.surface2}80`,
    borderColor: 'rgba(123, 110, 246, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 8,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  modelTierText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primaryAccent,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: COLORS.primaryAccent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  emptyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});

export default JournalScreen;
