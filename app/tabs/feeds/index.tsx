import React, {useEffect} from "react";
import {Settings} from "react-native";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {initialize, lemmyAuthToken} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/Feed/FeedView";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectPosts, setLoading, setPosts} from "../../../slices/posts/postsSlice";
import {getPosts} from "../../../slices/posts/postsActions";
import {setCategory} from "../../../slices/feed/feedSlice";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";

const FeedsIndex = () => {
    const dispatch = useAppDispatch();

    const {posts, loading, sort} = useAppSelector(selectPosts);

    useEffect(() => {
        load().then();
    }, [sort]);

    const load = async () => {
        try {
            await initialize((Settings.get("servers") as ILemmyServer[])?.[0]);
        } catch(e) {
            console.log("Error: ", e);
            dispatch(setPosts(null));
            dispatch(setLoading(false));
            return;
        }

        dispatch(getPosts({
            auth: lemmyAuthToken,
            limit: 50,
            sort
        }));

        dispatch(setCategory({
            name: "All",
            type: "global"
        }));

        dispatch(getAllCommunities());
        dispatch(getSubscribedCommunities());
    };

    return <FeedView posts={posts} loading={loading} load={load} sort={sort} titleDropsdown={true} />;
};

export default FeedsIndex;