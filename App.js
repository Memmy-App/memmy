import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NativeBaseProvider } from "native-base";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import React from "react";
import darkTheme from "./theme/theme";
import store from "./store";
import Stack from "./Stack";
import { createIfDontExist } from "./helpers/LogHelper";

// eslint-disable-next-line no-undef
if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Enabled."));
}

export default function App() {
  createIfDontExist().then();

  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NativeBaseProvider theme={darkTheme}>
            <ActionSheetProvider>
              <Stack />
            </ActionSheetProvider>
          </NativeBaseProvider>
        </GestureHandlerRootView>
      </Provider>
    </>
  );
}
