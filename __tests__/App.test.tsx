/**
 * @format
 */

import React from 'react';
import { NativeModules } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    getString: jest.fn(),
    remove: jest.fn(),
    set: jest.fn(),
  }),
}));

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    createAnimatedComponent: (component: unknown) => component,
    View: 'View',
  },
  Easing: {
    linear: jest.fn(),
  },
  useAnimatedStyle: jest.fn(() => ({})),
  useSharedValue: jest.fn((value: unknown) => ({ value })),
  withRepeat: jest.fn((value: unknown) => value),
  withSequence: jest.fn((value: unknown) => value),
  withSpring: jest.fn((value: unknown) => value),
  withTiming: jest.fn((value: unknown) => value),
}));

NativeModules.RNCConfig = {
  API_BASE_URL_DEV: 'http://localhost:8000/api',
  API_BASE_URL_PROD: 'https://example.com/api',
  SUPABASE_ANON_KEY: 'test-supabase-anon-key',
  SUPABASE_URL: 'https://example.supabase.co',
};

const App = require('../App').default as typeof import('../App').default;

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
