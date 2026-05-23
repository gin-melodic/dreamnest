import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDreamStore } from '../store/dreamStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamDetail'>;

function DreamDetailScreen({ route }: Props): React.JSX.Element {
  useI18n();
  const dream = useDreamStore(state =>
    state.history.find(record => record.id === route.params.dreamId),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>{t('dreamDetailKicker')}</Text>
        <Text style={styles.title}>
          {dream ? t(dream.titleKey) : t('dreamDetailNotFoundTitle')}
        </Text>

        {dream ? (
          <>
            <View
              style={[
                styles.emotionChip,
                {
                  borderColor: `${dream.emotionColor}66`,
                  backgroundColor: `${dream.emotionColor}26`,
                },
              ]}
            >
              <Text style={[styles.emotionText, { color: dream.emotionColor }]}>
                {t(dream.emotionKey)} · {t(dream.createdAtKey)}
              </Text>
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelLabel}>
                {t('dreamDetailDreamLabel')}
              </Text>
              <Text style={styles.bodyText}>{t(dream.dreamContentKey)}</Text>
            </View>

            <View style={styles.panel}>
              <Text style={styles.panelLabel}>
                {t('dreamDetailInterpretationLabel')}
              </Text>
              <Text style={styles.streamText}>
                {t(dream.interpretationKey)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.panel}>
            <Text style={styles.bodyText}>{t('dreamDetailMissingBody')}</Text>
          </View>
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
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
  emotionChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  emotionText: {
    ...TYPOGRAPHY.badge,
  },
  panel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 18,
    padding: 18,
  },
  panelLabel: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  bodyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  streamText: {
    ...TYPOGRAPHY.stream,
    color: COLORS.textMuted,
  },
});

export default DreamDetailScreen;
