import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSupabaseAuthBootstrap } from './src/hooks/useSupabaseAuthBootstrap';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  useSupabaseAuthBootstrap();

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
