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
import { useAuthStore } from '../store/authStore';
import { COLORS, TYPOGRAPHY } from '../types/theme';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  DreamInput: undefined;
  DreamResult: { dreamContent: string };
  DreamDetail: { dreamId: string };
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
        return <JournalScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Home':
      default:
        return <HomeScreen />;
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

            return (
              <Pressable
                accessibilityRole="button"
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
              >
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
    backgroundColor: `${COLORS.background}D9`,
    borderTopColor: COLORS.surface2,
    borderTopWidth: 1,
  },
  hiddenGraphSlot: {
    height: 0,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.surface2,
  },
  tabLabel: {
    ...TYPOGRAPHY.badge,
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
  },
});

export default AppNavigator;
