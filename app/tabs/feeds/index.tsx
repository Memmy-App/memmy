import React, {useEffect, useState} from "react";
import {Settings} from "react-native";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {initialize, lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/Feed/FeedView";
import {useAppDispatch, useAppSelector} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";
import {PostView, SortType} from "lemmy-js-client";
import {clearUpdateVote, selectFeed} from "../../../slices/feed/feedSlice";

const FeedsIndexScreen = () => {
    const dispatch = useAppDispatch();

    const [posts, setPosts] = useState<PostView[]|null>(null);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState<SortType>("Hot");

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
    }, [sort]);

    const load = async (refresh = false) => {
        setLoading(true);

        try {
            await initialize((Settings.get("servers") as ILemmyServer[])?.[0]);
        } catch(e) {
            console.log("Error: ", e);
            setPosts(null);
            setLoading(false);
            return;
        }

        try {
            const res = await lemmyInstance.getPosts({
                auth: lemmyAuthToken,
                limit: 50,
                page: !posts ? 1 : (posts.length / 50) + 1,
                sort: sort
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