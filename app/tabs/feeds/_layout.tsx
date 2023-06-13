import React from "react";
import {Stack} from "expo-router";
import FeedHeaderRightButton from "../../../ui/Feed/FeedHeaderRightButton";
import FeedHeaderDropdown from "../../../ui/Feed/FeedHeaderDropdown";
import {useAppSelector} from "../../../store";
import {selectFeed} from "../../../slices/feed/feedSlice";

const FeedsLayout = () => {
    const {category} = useAppSelector(selectFeed);

    return (
        <Stack>
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