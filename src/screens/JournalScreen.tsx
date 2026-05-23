import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { DreamRecord } from '../store/dreamStore';
import { useDreamStore } from '../store/dreamStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

function JournalScreen(): React.JSX.Element {
  const language = useI18n();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const history = useDreamStore(state => state.history);

  const renderItem = useCallback(
    ({ item }: { item: DreamRecord }): React.JSX.Element => (
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('DreamDetail', { dreamId: item.id })}
        style={styles.dreamCard}
      >
        <View
          style={[styles.emotionStrip, { backgroundColor: item.emotionColor }]}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
            <Text style={styles.cardDate}>{t(item.createdAtKey)}</Text>
          </View>
          <View
            style={[
              styles.emotionChip,
              {
                borderColor: `${item.emotionColor}66`,
                backgroundColor: `${item.emotionColor}26`,
              },
            ]}
          >
            <Text style={[styles.emotionText, { color: item.emotionColor }]}>
              {t(item.emotionKey)}
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.cardSummary}>
            {t(item.interpretationKey)}
          </Text>
        </View>
      </Pressable>
    ),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>{t('journalKicker')}</Text>
            <Text style={styles.title}>{t('journalTitle')}</Text>
            <Text style={styles.subtitle}>{t('journalSubtitle')}</Text>
          </View>
        }
        contentContainerStyle={styles.content}
        data={history}
        extraData={language}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 8,
  },
  kicker: {
    ...TYPOGRAPHY.badge,
    color: COLORS.secondaryAccent,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    ...TYPOGRAPHY.display,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 12,
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
  cardContent: {
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

export default JournalScreen;
