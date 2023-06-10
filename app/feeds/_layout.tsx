import React from "react";
import {Stack} from "expo-router";

const FeedsLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name={"index"}
                options={{
                    title: "Feeds"
                }}
            />
            <Stack.Screen
                name={"post"}
                options={{
                    title: "Post"
                }}
            />
        </Stack>
    );
};

export default FeedsLayout;