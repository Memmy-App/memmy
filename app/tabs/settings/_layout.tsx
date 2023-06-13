import React from "react";
import {Stack} from "expo-router";

const SettingsLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name={"index"}
                options={{
                    title: "Settings"
                }}
            />
        </Stack>
    );
};

export default SettingsLayout;