import React from "react";
import {Tabs} from "expo-router";
import {Icon, useTheme} from "native-base";
import {Ionicons} from "@expo/vector-icons";

const Layout = () => {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme.colors.screen[900]
                }
            }}
        >
            <Tabs.Screen
                name={"feeds"}
                options={{
                    headerShown: false,
                    tabBarLabel: "Feeds",
                    tabBarIcon: (({color}) => (
                        <Icon as={Ionicons} name={"list-outline"} size={7} color={color} />
                    ))
                }}
            />
            <Tabs.Screen
                name={"settings"}
                options={{
                    headerShown:false,
                    tabBarLabel: "Settings",
                    tabBarIcon: (({color}) => (
                        <Icon as={Ionicons} name={"cog-outline"} size={7} color={color} />
                    ))
                }}
            />
        </Tabs>
    );
};

export default Layout;