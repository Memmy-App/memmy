import React, {useEffect, useState} from "react";
import {Stack, useLocalSearchParams} from "expo-router";
import {PostView, SortType} from "lemmy-js-client";
import {lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/Feed/FeedView";
import {clearUpdateVote, selectFeed} from "../../../slices/feed/feedSlice";
import {useAppDispatch, useAppSelector} from "../../../store";
import {Text, VStack} from "native-base";
import {getBaseUrl} from "../../../helpers/LinkHelper";
import {removeDuplicatePosts} from "../../../lemmy/LemmyHelpers";
import {useFeed} from "../../../componentHelpers/feeds/feedsHooks";

const FeedsCommunityScreen = () => {
    const {communityId, communityName, actorId} = useLocalSearchParams();

    const feed = useFeed(Number(communityId));

    const {updateVote} = useAppSelector(selectFeed);

    const dispatch = useAppDispatch();

    useEffect(() => {
        feed.load();
    }, []);

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <VStack alignItems={"center"}>
                            <Text fontSize={16} fontWeight={"semibold"}>{communityName.toString()}</Text>
                            <Text fontSize={12}>@{getBaseUrl(actorId.toString())}</Text>
                        </VStack>
                    )
                }}
            />
            <FeedView
                posts={feed.posts}
                load={feed.load}
                loading={feed.loading}
                setSort={feed.setSort}
                community
            />
        </>
    );
};

export default FeedsCommunityScreen;