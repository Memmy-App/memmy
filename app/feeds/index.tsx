import React, {useEffect, useState} from "react";
import {FlatList, Text, View} from "native-base";
import {Settings, StyleSheet} from "react-native";
import {GetPostsResponse, LemmyHttp, Post, PostView} from "lemmy-js-client";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import FeedItem from "../../ui/FeedItem";
import {useRouter} from "expo-router";
import {initialize, lemmyInstance} from "../../lemmy/LemmyInstance";
import LoadingView from "../../ui/LoadingView";

const FeedsIndex = () => {
    const [posts, setPosts] = useState<GetPostsResponse|null>(null);

    const router = useRouter();

    useEffect(() => {
        load().then();
    }, []);

    const load = async () => {
        await initialize((Settings.get("servers") as ILemmyServer[])?.[1]);

        setPosts(await lemmyInstance.getPosts({
            limit: 20
        }));
    };

    const onPostPress = (postId: number) => {
        router.push({
            pathname: "/feeds/post",
            params: {
                postId: postId
            }
        });
    };

    const postItem = ({item}: {item: PostView}) => {
        return (
            <FeedItem post={item} onPress={onPostPress} />
        );
    };

    if(!posts || posts.posts.length === 0) {
        return <LoadingView />;
    }

    return (
        <View>
            <FlatList data={posts.posts} renderItem={postItem} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default FeedsIndex;