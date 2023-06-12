import React from "react";
import {Stack} from "expo-router";

const OnboardingLayout = () => {
    return (
        <Stack>
            <Stack.Screen name={"index"} options={{title: "Welcome"}} />
        </Stack>
    );
};

export default OnboardingLayout;