import React from "react";
import {Stack} from "expo-router";
import {useTheme} from "native-base";

const OnboardingLayout = () => {
    const theme = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.screen[900]
                },
                headerTitleStyle: {
                    color: theme.colors.lightText,
                }
            }}
        >
            <Stack.Screen name={"index"} options={{title: "Welcome"}} />
            <Stack.Screen name={"createAccount"} options={{title: "Create Account"}} />
            <Stack.Screen name={"addAccount"} options={{title: "Add Account"}} />
        </Stack>
    );
};

export default OnboardingLayout;