import React, {useEffect} from "react";
import FeedView from "../../ui/Feed/FeedView";
import {selectFeed} from "../../../slices/feed/feedSlice";
import {useAppDispatch, useAppSelector} from "../../../store";
import {Text, VStack} from "native-base";
import {getBaseUrl} from "../../../helpers/LinkHelper";
import {useFeed} from "../../hooks/feeds/feedsHooks";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const FeedsCommunityScreen = ({route, navigation}: {route: any, navigation: NativeStackNavigationProp<any>}) => {
    const {communityId, communityName, actorId} = route.params;

    const feed = useFeed(Number(communityId));

    const {updateVote} = useAppSelector(selectFeed);
    const dispatch = useAppDispatch();

    navigation.setOptions({
        headerTitle: () => (
            <VStack alignItems={"center"}>
                <Text fontSize={16} fontWeight={"semibold"}>{communityName.toString()}</Text>
                <Text fontSize={12}>@{getBaseUrl(actorId.toString())}</Text>
            </VStack>
        ),
        title: communityName
    });

    useEffect(() => {
        feed.load();
    }, []);

    return (
        <FeedView
            posts={feed.posts}
            load={feed.load}
            loading={feed.loading}
            setSort={feed.setSort}
            community
        />
    );
};

export default FeedsCommunityScreen;