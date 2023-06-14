import React from "react";
import {Stack} from "expo-router";
import {useTheme} from "native-base";

const SettingsLayout = () => {
    const theme = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle:{
                    backgroundColor: theme.colors.screen["900"]
                },
                headerTitleStyle: {
                    color: theme.colors.lightText
                }
            }}
        >
            <Stack.Screen
                name={"index"}
                options={{
                    title: "Settings"
                }}
            />
            <Stack.Screen
                name={"editAccount"}
                options={{
                    title: "Edit Account"
                }}
            />
        </Stack>
    );
};

export default SettingsLayout;