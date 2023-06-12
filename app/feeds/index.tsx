import React, {useEffect, useState} from "react";
import {FlatList, View} from "native-base";
import {Settings, StyleSheet} from "react-native";
import {GetPostsResponse, PostView} from "lemmy-js-client";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import FeedItem from "../../ui/FeedItem";
import {useRouter} from "expo-router";
import {initialize, lemmyAuthToken, lemmyInstance} from "../../lemmy/LemmyInstance";
import LoadingView from "../../ui/LoadingView";
import LoadingErrorView from "../../ui/LoadingErrorView";

const FeedsIndex = () => {
    const [posts, setPosts] = useState<GetPostsResponse|null|false>(null);

    const router = useRouter();

    useEffect(() => {
        load().then();
    }, []);

    const load = async () => {
        setPosts(null);

        try {
            await initialize((Settings.get("servers") as ILemmyServer[])?.[1]);
        } catch(e) {
            setPosts(false);
            return;
        }

        try {
            const res = await lemmyInstance.getPosts({
                auth: lemmyAuthToken,
                limit: 50
            });

            setPosts(res);
        } catch(e) {
            setPosts(false);
        }
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

    const keyExtractor = (item) => item.post.id.toString();

    if(posts === null || (posts && posts.posts.length === 0)) {
        return <LoadingView />;
    }

    if(posts === false) {
        return <LoadingErrorView onRetryPress={load} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts.posts}
                renderItem={postItem}
                keyExtractor={keyExtractor}
                maxToRenderPerBatch={4}
                initialNumToRender={4}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default FeedsIndex;