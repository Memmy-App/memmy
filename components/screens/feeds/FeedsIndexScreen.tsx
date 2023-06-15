import React, {useEffect} from "react";
import FeedView from "../../ui/Feed/FeedView";
import FeedHeaderDropdown from "../../ui/Feed/FeedHeaderDropdown";
import {useFeed} from "../../hooks/feeds/feedsHooks";
import {initialize, lemmyInstance} from "../../../lemmy/LemmyInstance";
import {getServers} from "../../../helpers/SettingsHelper";
import {useAppDispatch} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const FeedsIndexScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
    navigation.setOptions({
        headerTitle: () => <FeedHeaderDropdown title={sortFix()} enabled={true} />,
    });

    const feed = useFeed();

    const dispatch = useAppDispatch();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        if(!lemmyInstance) {
            try {
                const servers = await getServers();

                if(!servers || servers.length < 1) {
                    navigation.replace("Onboarding");
                    return;
                }

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

    return <FeedView posts={feed.posts} loading={feed.loading} load={feed.load} setSort={feed.setSort} titleDropsdown={true} setListingType={feed.setListingType} />;
};

export default FeedsIndexScreen;