import React, {useEffect, useState} from "react";
import {FlatList, View} from "native-base";
import {Alert, Settings, StyleSheet} from "react-native";
import {GetPostsResponse, LemmyHttp, Post, PostView} from "lemmy-js-client";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import FeedItem from "../../ui/FeedItem";
import {useRouter} from "expo-router";
import {initialize, lemmyInstance} from "../../lemmy/LemmyInstance";
import LoadingView from "../../ui/LoadingView";
import {FlashList} from "@shopify/flash-list";

const FeedsIndex = () => {
    const [posts, setPosts] = useState<GetPostsResponse|null>(null);

    const router = useRouter();

    useEffect(() => {
        load().then();
    }, []);

    const load = async () => {
        try {
            await initialize((Settings.get("servers") as ILemmyServer[])?.[1]);
        } catch(e) {
            Alert.alert("Connection Error", "Error connecting to server. Try again?", [
                {
                    text: "Retry",
                    onPress: load
                },
                {
                    text: "Cancel"
                }
            ]);

            return;
        }

        setPosts(await lemmyInstance.getPosts({
            limit: 50
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
        <View style={styles.container}>
            <FlashList
                data={posts.posts}
                renderItem={postItem}
                keyExtractor={item => item.post.id.toString()}
                estimatedItemSize={100}
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