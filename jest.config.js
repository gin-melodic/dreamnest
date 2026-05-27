module.exports = {
  preset: '@react-native/jest-preset',
  testPathIgnorePatterns: ['/node_modules/', '/.kilo/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-mmkv|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-worklets|@supabase)/)',
  ],
};
