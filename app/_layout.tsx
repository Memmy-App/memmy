import React from "react";
import {Tabs} from "expo-router";
import {NativeBaseProvider} from "native-base";

const Layout = () => {
    return (
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
    );
};

export default Layout;