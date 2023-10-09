import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider, Theme } from 'tamagui';

import tguiConfig from './tamagui.config';
import Stack from '@components/Navigation/Stack';
import { enableFreeze } from 'react-native-screens';

export default function App(): React.JSX.Element {
  enableFreeze(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tguiConfig}>
        <Theme name={'lightTheme'}>
          <Stack />
        </Theme>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
