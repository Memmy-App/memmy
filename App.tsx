import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";

import tguiConfig from "./tamagui.config";
import Stack from "@src/components/Stack";
import { enableFreeze } from "react-native-screens";

export default function App(): React.JSX.Element {
  enableFreeze(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tguiConfig}>
        <Stack />
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
