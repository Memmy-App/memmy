import React from "react";
import {Tabs} from "expo-router";
import {NativeBaseProvider} from "native-base";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import store from "../store";
import {Provider} from "react-redux";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";

const Layout = () => {
    return (
        <Provider store={store}>
            <GestureHandlerRootView style={{flex: 1}}>
                <NativeBaseProvider>
                    <ActionSheetProvider>
                        <Tabs>
                            <Tabs.Screen
                                name={"feeds"}
                                options={{
                                    headerShown: false,
                                    tabBarLabel: "Feeds",
                                }}
                            />
                            <Tabs.Screen
                                name={"servers"}
                                options={{
                                    headerShown: false,
                                    tabBarLabel: "Servers",
                                }}
                            />
                        </Tabs>
                    </ActionSheetProvider>
                </NativeBaseProvider>
            </GestureHandlerRootView>
        </Provider>
    );
};

export default Layout;