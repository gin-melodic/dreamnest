import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useDreamStore } from '../store/dreamStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DreamResult'>;

function DreamResultScreen({ route, navigation }: Props): React.JSX.Element {
  useI18n();
  const { dreamContent } = route.params;
  const streamingContent = useDreamStore(state => state.streamingContent);
  const isStreaming = useDreamStore(state => state.isStreaming);
  const displayText = streamingContent || t('dreamResultPlaceholder');

  const handleBackHome = (): void => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>{t('dreamResultKicker')}</Text>
          <Text style={styles.title}>{t('dreamResultTitle')}</Text>
          <Text style={styles.subtitle}>{t('dreamResultSubtitle')}</Text>
        </View>

        <View style={styles.dreamPanel}>
          <Text style={styles.panelLabel}>{t('dreamResultDreamLabel')}</Text>
          <Text style={styles.dreamText}>{dreamContent}</Text>
        </View>

        <View style={styles.resultPanel}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.panelLabel}>
                {t('dreamResultInterpretationLabel')}
              </Text>
              <Text style={styles.resultStatus}>
                {isStreaming
                  ? t('dreamResultStreamingNow')
                  : t('dreamResultReadyForStream')}
              </Text>
            </View>
            <View
              style={[
                styles.statusDot,
                isStreaming && styles.statusDotStreaming,
              ]}
            />
          </View>
          <Animated.Text
            entering={FadeInDown.duration(420)}
            style={styles.streamText}
          >
            {displayText}
          </Animated.Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleBackHome}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>
            {t('dreamResultBackHome')}
          </Text>
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 22,
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
  dreamPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  panelLabel: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  dreamText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  resultPanel: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surface2,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 18,
    padding: 18,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultStatus: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
  },
  statusDot: {
    backgroundColor: COLORS.textFaint,
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  statusDotStreaming: {
    backgroundColor: COLORS.success,
  },
  streamText: {
    ...TYPOGRAPHY.stream,
    color: COLORS.textMuted,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: COLORS.primaryAccent,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 50,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});

export default DreamResultScreen;
