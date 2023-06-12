import React, {useEffect} from "react";
import {Settings} from "react-native";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {initialize, lemmyAuthToken} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/FeedView";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectPosts, setLoading, setPosts} from "../../../slices/posts/postsSlice";
import {getPosts} from "../../../slices/posts/postsActions";

const FeedsIndex = () => {
    const dispatch = useAppDispatch();

    const {posts, loading, error, sort} = useAppSelector(selectPosts);

    useEffect(() => {
        load().then();
    }, [sort]);

    const load = async () => {
        try {
            await initialize((Settings.get("servers") as ILemmyServer[])?.[0]);
        } catch(e) {
            setPosts(null);
            setLoading(false);
            return;
        }

        dispatch(getPosts({
            auth: lemmyAuthToken,
            limit: 50,
            sort
        }));
    };

    return <FeedView posts={posts} loading={loading} load={load} sort={sort} />;
};

export default FeedsIndex;