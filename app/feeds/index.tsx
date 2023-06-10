import React, {useEffect, useState} from "react";
import {FlatList, Text, View} from "native-base";
import {Settings, StyleSheet} from "react-native";
import {GetPostsResponse, LemmyHttp, Post, PostView} from "lemmy-js-client";
import ILemmyServer from "../../lemmy/types/ILemmyServer";
import FeedItem from "../../ui/FeedItem";

const FeedsIndex = () => {
    const [posts, setPosts] = useState<GetPostsResponse|null>(null);

    useEffect(() => {
        load().then();
    }, []);

    const load = async () => {
        const server = (Settings.get("servers") as ILemmyServer[])?.[0];
        const lemmy = new LemmyHttp(`https://${server.server}`);

        await lemmy.login({
            username_or_email: server.username,
            password: server.password
        });

        setPosts(await lemmy.getPosts({
            limit: 20
        }));
    };

    const postItem = ({item}: {item: PostView}) => {
        return (
            <FeedItem post={item} />
        );
    };

    return (
        <View>
            {
                (!posts || posts.posts.length === 0) ? (
                    <Text>Loading...</Text>
                ) : (
                    <FlatList data={posts.posts} renderItem={postItem} />
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default FeedsIndex;