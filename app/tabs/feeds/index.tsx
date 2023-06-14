import React, {useEffect, useState} from "react";
import {initialize, lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/Feed/FeedView";
import {useAppDispatch, useAppSelector} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";
import {ListingType, PostView, SortType} from "lemmy-js-client";
import {clearUpdateVote, selectFeed} from "../../../slices/feed/feedSlice";
import {getServers} from "../../../helpers/SettingsHelper";
import {selectSettings} from "../../../slices/settings/settingsSlice";
import {Stack} from "expo-router";
import FeedHeaderDropdown from "../../../ui/Feed/FeedHeaderDropdown";
import {removeDuplicatePosts} from "../../../lemmy/LemmyHelpers";

const FeedsIndexScreen = () => {
    const dispatch = useAppDispatch();

    const settings = useAppSelector(selectSettings);

    const [posts, setPosts] = useState<PostView[]|null>(null);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState<SortType>(settings.defaultSort);
    const [listingType, setListingType] = useState<ListingType>(settings.defaultListingType);

    const {updateVote} = useAppSelector(selectFeed);

    useEffect(() => {
        if(updateVote) {
            setPosts(posts?.map(post => {
                if(post.post.id === updateVote.postId) {
                    post.my_vote = updateVote.vote;
                }

                return post;
            }));
            dispatch(clearUpdateVote());
        }
    }, [updateVote]);

    useEffect(() => {
        load(true).then();
    }, [sort, listingType]);

    const load = async (refresh = false) => {
        setLoading(true);

        if(!lemmyInstance) {
            try {
                const servers = await getServers();
                await initialize(servers[0]);
            } catch (e) {
                console.log("Error: ", e);
                setPosts(null);
                setLoading(false);
                return;
            }
        }

        try {
            const res = await lemmyInstance.getPosts({
                auth: lemmyAuthToken,
                limit: 20,
                page: (!posts || refresh) ? 1 : (posts.length / 20) + 1,
                sort: sort,
                type_: listingType,
            });

            if(!posts || refresh) {
                setPosts(res.posts);
            } else {
                setPosts(prev => [...prev, ...removeDuplicatePosts(prev.slice(0, 50), res.posts)]);
            }

            setLoading(false);
        } catch(e) {
            setPosts(null);
            setLoading(false);
        }

        dispatch(getAllCommunities());
        dispatch(getSubscribedCommunities());
    };

    const sortFix = () => {
        if(sort === "MostComments") return "Most Comments";
        else if(sort === "TopDay") return "Top Day";
        else if(sort === "TopWeek") return "Top Week";

        return sort;
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

            <FeedView posts={posts} loading={loading} load={load} setSort={setSort} titleDropsdown={true} setListingType={setListingType} />
        </>
    );
};

export default FeedsIndexScreen;