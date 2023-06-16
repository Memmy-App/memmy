import { StatusBar } from "expo-status-bar";
import {Provider} from "react-redux";
import store from "./store";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {NativeBaseProvider, useTheme} from "native-base";
import darkTheme from "./theme/theme";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import React from "react";
import Stack from "./Stack";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function App() {


    return (
        <>
            <StatusBar style={"light"} />
            <Provider store={store}>
                <GestureHandlerRootView style={{flex: 1}}>
                    <NativeBaseProvider theme={darkTheme}>
                        <ActionSheetProvider>
                            <Stack />
                        </ActionSheetProvider>
                    </NativeBaseProvider>
                </GestureHandlerRootView>
            </Provider>
        </>
    );
};