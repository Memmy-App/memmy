import React from "react";
import {Tabs} from "expo-router";

const Layout = () => {
    return (
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
    );
};

export default Layout;