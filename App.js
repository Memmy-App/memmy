/* eslint-disable react/jsx-filename-extension */
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NativeBaseProvider } from "native-base";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import React from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Stack from "./Stack";
import darkTheme from "./theme/theme";
import store from "./store";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
    "Inter-BlackItalic": require("./assets/fonts/Inter-BlackItalic.otf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.otf"),
    "Inter-BoldItalic": require("./assets/fonts/Inter-BoldItalic.otf"),
    "Inter-ExtraBold": require("./assets/fonts/Inter-ExtraBold.otf"),
    "Inter-ExtraBoldItalic": require("./assets/fonts/Inter-ExtraBoldItalic.otf"),
    "Inter-ExtraLight": require("./assets/fonts/Inter-ExtraLight.otf"),
    "Inter-ExtraLightItalic": require("./assets/fonts/Inter-ExtraLightItalic.otf"),
    "Inter-Italic": require("./assets/fonts/Inter-Italic.otf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.otf"),
    "Inter-Light": require("./assets/fonts/Inter-Light.otf"),
    "Inter-LightItalic": require("./assets/fonts/Inter-LightItalic.otf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.otf"),
    "Inter-MediumItalic": require("./assets/fonts/Inter-MediumItalic.otf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.otf"),
    "Inter-SemiBoldItalic": require("./assets/fonts/Inter-SemiBoldItalic.otf"),
    "Inter-Thin": require("./assets/fonts/Inter-Thin.otf"),
    "Inter-ThinItalic": require("./assets/fonts/Inter-ThinItalic.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }
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
