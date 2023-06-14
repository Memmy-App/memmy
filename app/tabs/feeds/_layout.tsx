import React from "react";
import {Stack} from "expo-router";
import {useTheme} from "native-base";

const FeedsLayout = () => {
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
                    title: "Feeds",
                }}
            />
            <Stack.Screen
                name={"post"}
                options={{
                    title: "Post"
                }}
            />
            <Stack.Screen
                name={"commentModal"}
                options={{
                    presentation: "modal",
                    title: "New Comment"
                }}
            />
            <Stack.Screen
                name={"newPost"}
                options={{
                    title: "New Post"
                }}
            />

            <Stack.Screen
                name={"[communityId]"}
                options={{
                    title: "Community"
                }}
            />
        </Stack>
    );
};

export default FeedsLayout;