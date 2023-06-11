import React from "react";
import {Tabs} from "expo-router";
import {NativeBaseProvider} from "native-base";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const Layout = () => {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <NativeBaseProvider>
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
            </NativeBaseProvider>
        </GestureHandlerRootView>
    );
};

export default Layout;