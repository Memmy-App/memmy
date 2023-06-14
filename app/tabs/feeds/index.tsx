import React, {useEffect, useState} from "react";
import {initialize, lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/Feed/FeedView";
import {useAppDispatch, useAppSelector} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";
import {PostView, SortType} from "lemmy-js-client";
import {clearUpdateVote, selectFeed} from "../../../slices/feed/feedSlice";
import {getServers} from "../../../helpers/SettingsHelper";

const FeedsIndexScreen = () => {
    const dispatch = useAppDispatch();

    const [posts, setPosts] = useState<PostView[]|null>(null);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState<SortType>("Hot");

    const {updateVote, listingType} = useAppSelector(selectFeed);

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

        try {
            const servers = await getServers();
            await initialize(servers[0]);
        } catch(e) {
            console.log("Error: ", e);
            setPosts(null);
            setLoading(false);
            return;
        }

        try {
            const res = await lemmyInstance.getPosts({
                auth: lemmyAuthToken,
                limit: 20,
                page: !posts ? 1 : (posts.length / 20) + 1,
                sort: sort,
                type_: listingType,
            });

            if(!posts || refresh) {
                setPosts(res.posts);
            } else {
                setPosts([...posts, ...res.posts]);
            }

            setLoading(false);
        } catch(e) {
            setPosts(null);
            setLoading(false);
        }

        dispatch(getAllCommunities());
        dispatch(getSubscribedCommunities());
    };

    return <FeedView posts={posts} loading={loading} load={load} setSort={setSort} titleDropsdown={true} />;
};

export default FeedsIndexScreen;