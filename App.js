/* eslint-disable react/jsx-filename-extension */
/* eslint-disable  global-require */
import { Provider } from "react-redux";
import React from "react";

import { useFonts } from "expo-font";
import { enableFreeze } from "react-native-screens";
import store from "./store";
import Start from "./Start";

export default function App() {
  enableFreeze(true); // Enable freezing of screens for better performance

  const [fontsLoaded] = useFonts({
    // Load custom fonts using Expo Fonts
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
    // Wait for fonts to be loaded before rendering the app
    return null;
  }

  return (
    <Provider store={store}>
      {/* Provide the Redux store to the app */}
      <Start /> {/* Render the Start component */}
    </Provider>
  );
}
