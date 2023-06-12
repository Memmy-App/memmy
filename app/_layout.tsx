import React from "react";
import store from "../store";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import {Provider} from "react-redux";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {NativeBaseProvider} from "native-base";
import {Stack} from "expo-router";

const Layout = () => {
    return (
        <Provider store={store}>
            <GestureHandlerRootView style={{flex: 1}}>
                <NativeBaseProvider>
                    <ActionSheetProvider>
                        <Stack
                            screenOptions={{
                                headerShown: false
                            }}
                        >
                            <Stack.Screen name={"index"} options={{title: "Home"}} />
                        </Stack>
                    </ActionSheetProvider>
                </NativeBaseProvider>
            </GestureHandlerRootView>
        </Provider>
    );
};

export default Layout;