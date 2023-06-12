import React from "react";
import {Stack} from "expo-router";

const OnboardingLayout = () => {
    return (
        <Stack>
            <Stack.Screen name={"index"} options={{title: "Welcome"}} />
            <Stack.Screen name={"createAccount"} options={{title: "Create Account"}} />
            <Stack.Screen name={"addAccount"} options={{title: "Add Account"}} />
        </Stack>
    );
};

export default OnboardingLayout;