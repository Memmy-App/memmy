import React, {useEffect} from "react";
import FeedView from "../../../ui/Feed/FeedView";
import {Stack} from "expo-router";
import FeedHeaderDropdown from "../../../ui/Feed/FeedHeaderDropdown";
import {useFeed} from "../../../componentHelpers/feeds/feedsHooks";
import {initialize, lemmyInstance} from "../../../lemmy/LemmyInstance";
import {getServers} from "../../../helpers/SettingsHelper";
import {useAppDispatch} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";

const FeedsIndexScreen = () => {
    const feed = useFeed();

    const dispatch = useAppDispatch();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        if(!lemmyInstance) {
            try {
                const servers = await getServers();
                await initialize(servers[0]);

                feed.load(false);
                dispatch(getSubscribedCommunities());
                dispatch(getAllCommunities());
            } catch (e) {
                console.log("Error", e);
            }
        }
    };

    const sortFix = () => {
        if(feed.sort === "MostComments") return "Most Comments";
        else if(feed.sort === "TopDay") return "Top Day";
        else if(feed.sort === "TopWeek") return "Top Week";

        return feed.sort;
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <FeedHeaderDropdown title={sortFix()} enabled={true} />
                    )
                }}
            />

            <FeedView posts={feed.posts} loading={feed.loading} load={feed.load} setSort={feed.setSort} titleDropsdown={true} setListingType={feed.setListingType} />
        </>
    );
};

export default FeedsIndexScreen;