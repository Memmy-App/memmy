import React, {useEffect, useState} from "react";
import {useLocalSearchParams} from "expo-router";
import {PostView, SortType} from "lemmy-js-client";
import {lemmyAuthToken, lemmyInstance} from "../../../lemmy/LemmyInstance";
import FeedView from "../../../ui/Feed/FeedView";

const FeedsCommunityScreen = () => {
    const {communityId} = useLocalSearchParams();
    const [posts, setPosts] = useState<PostView[]|null>(null);
    const [sort, setSort] = useState<SortType|null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        load().then();
    }, [sort]);

    const load = async () => {
        setLoading(true);

        try {
            const res = await lemmyInstance.getPosts({
                auth: lemmyAuthToken,
                community_id: Number(communityId),
                limit: 50,
                sort: sort
            });

            setPosts(res.posts);
        } catch(e) {
            setLoading(false);
            return;
        }
    };

    return <FeedView posts={posts} load={load} loading={loading} sort={sort} setSort={setSort} communityTitle />;
};

export default FeedsCommunityScreen;