import React from "react";
import {Stack, useRouter} from "expo-router";
import {Button} from "react-native";

const FeedsLayout = () => {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen
                name={"index"}
                options={{
                    title: "Feeds",
                    headerRight: () => (
                        <Button title={"New Post"} onPress={() => router.push("/feeds/newPost")} />
                    )
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
        </Stack>
    );
};

export default FeedsLayout;