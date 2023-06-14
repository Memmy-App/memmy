import React from "react";
import {Stack} from "expo-router";
import FeedHeaderDropdown from "../../../ui/Feed/FeedHeaderDropdown";
import {useAppSelector} from "../../../store";
import {selectFeed} from "../../../slices/feed/feedSlice";
import {useTheme} from "native-base";

const FeedsLayout = () => {
    const {category} = useAppSelector(selectFeed);

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
                    headerTitle: () => (
                        <FeedHeaderDropdown title={category.name} enabled={true} />
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