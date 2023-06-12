import React from "react";
import {Stack} from "expo-router";

const ServersLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name={"index"}
                options={{
                    title: "Servers"
                }}
            />
            <Stack.Screen
                name={"addServer"}
                options={{
                    title: "Add Server"
                }}
            />
        </Stack>
    );
};

export default ServersLayout;