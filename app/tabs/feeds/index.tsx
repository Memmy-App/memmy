import React, {useEffect, useState} from "react";
import {Settings} from "react-native";
import ILemmyServer from "../../../lemmy/types/ILemmyServer";
import {initialize, lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/Feed/FeedView";
import {useAppDispatch} from "../../../store";
import {getAllCommunities, getSubscribedCommunities} from "../../../slices/communities/communitiesActions";
import {PostView, SortType} from "lemmy-js-client";

const FeedsIndexScreen = () => {
    const dispatch = useAppDispatch();

    const [posts, setPosts] = useState<PostView[]|null>(null);
    const [loading, setLoading] = useState(false);
    const [sort, setSort] = useState<SortType>("Hot");

    useEffect(() => {
        load().then();
    }, [sort]);

    const load = async () => {
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
                limit: 50
            });

            setPosts(res.posts);
            setLoading(false);
        } catch(e) {
            setPosts(null);
            setLoading(false);
        }

        dispatch(getAllCommunities());
        dispatch(getSubscribedCommunities());
    };

    return <FeedView posts={posts} loading={loading} load={load} sort={sort} titleDropsdown={true} />;
};

export default FeedsIndexScreen;