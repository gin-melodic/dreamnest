import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t, useI18n } from '../lib/i18n';
import AuthScreen from '../screens/AuthScreen';
import DreamDetailScreen from '../screens/DreamDetailScreen';
import DreamInputScreen from '../screens/DreamInputScreen';
import DreamResultScreen from '../screens/DreamResultScreen';
import HomeScreen from '../screens/HomeScreen';
import JournalScreen from '../screens/JournalScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAuthStore } from '../store/authStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  DreamInput: undefined;
  DreamResult: { dreamContent: string; emotion?: string };
  DreamDetail: { dreamId: string };
  Settings: undefined;
};

type TabKey = 'Home' | 'Journal' | 'DreamGraph' | 'Profile';

const Stack = createNativeStackNavigator<RootStackParamList>();

const VISIBLE_TABS: Array<{
  key: Exclude<TabKey, 'DreamGraph'>;
  labelKey: 'tabHome' | 'tabJournal' | 'tabProfile';
}> = [
  { key: 'Home', labelKey: 'tabHome' },
  { key: 'Journal', labelKey: 'tabJournal' },
  { key: 'Profile', labelKey: 'tabProfile' },
];

const RESERVED_TABS: TabKey[] = ['Home', 'Journal', 'DreamGraph', 'Profile'];

function MainTabsScreen(): React.JSX.Element {
  useI18n();
  const [activeTab, setActiveTab] =
    useState<Exclude<TabKey, 'DreamGraph'>>('Home');

  const renderActiveTab = (): React.JSX.Element => {
    switch (activeTab) {
      case 'Journal':
        return <JournalScreen onNavigateToTab={setActiveTab} />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Home':
      default:
        return <HomeScreen onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <View style={styles.tabShell}>
      <View style={styles.tabContent}>{renderActiveTab()}</View>
      <SafeAreaView edges={['bottom']} style={styles.tabBarSafeArea}>
        <View accessibilityElementsHidden style={styles.hiddenGraphSlot}>
          <Text>
            {RESERVED_TABS.includes('DreamGraph') ? 'DreamGraph' : ''}
          </Text>
        </View>
        <View style={styles.tabBar}>
          {VISIBLE_TABS.map(tab => {
            const isActive = activeTab === tab.key;

            const getEmoji = (): string => {
              switch (tab.key) {
                case 'Home':
                  return '🌙';
                case 'Journal':
                  return '📖';
                case 'Profile':
                  return '👤';
                default:
                  return '💭';
              }
            };

            return (
              <Pressable
                accessibilityRole="button"
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={styles.tabButton}
              >
                <View style={styles.emojiContainer}>
                  <Text
                    style={[styles.tabEmoji, isActive && styles.tabEmojiActive]}
                  >
                    {getEmoji()}
                  </Text>
                  {isActive && <View style={styles.activeDot} />}
                </View>
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {t(tab.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

function renderHeaderButton(
  navigation: { goBack: () => void },
  label: string,
): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={navigation.goBack}
      style={styles.headerButton}
    >
      <Text style={styles.headerButtonText}>{label}</Text>
    </Pressable>
  );
}

function AppNavigator(): React.JSX.Element {
  useI18n();
  const user = useAuthStore(state => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          contentStyle: styles.stackContent,
          headerBackTitle: t('commonBack'),
          headerShadowVisible: false,
          headerStyle: styles.stackHeader,
          headerTintColor: COLORS.primaryAccent,
          headerTitleStyle: styles.stackHeaderTitle,
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DreamInput"
              component={DreamInputScreen}
              options={({ navigation }) => ({
                animation: 'slide_from_bottom',
                headerLeft: () =>
                  renderHeaderButton(navigation, t('commonClose')),
                title: t('navDreamInput'),
              })}
            />
            <Stack.Screen
              name="DreamResult"
              component={DreamResultScreen}
              options={{
                title: t('navDreamResult'),
              }}
            />
            <Stack.Screen
              name="DreamDetail"
              component={DreamDetailScreen}
              options={{
                title: t('navDreamDetail'),
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabShell: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stackContent: {
    backgroundColor: COLORS.background,
  },
  stackHeader: {
    backgroundColor: COLORS.background,
  },
  stackHeaderTitle: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  headerButton: {
    minHeight: 36,
    justifyContent: 'center',
    paddingRight: 12,
  },
  headerButtonText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.primaryAccent,
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
  },
  tabBarSafeArea: {
    backgroundColor: `${COLORS.background}FA`,
    borderTopColor: COLORS.surface2,
    borderTopWidth: 1,
  },
  hiddenGraphSlot: {
    height: 0,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
  },
  emojiContainer: {
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  tabEmoji: {
    fontSize: 20,
    opacity: 0.5,
  },
  tabEmojiActive: {
    opacity: 1.0,
    transform: [{ scale: 1.1 }],
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primaryAccent,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primaryAccent,
  },
});

export default AppNavigator;
