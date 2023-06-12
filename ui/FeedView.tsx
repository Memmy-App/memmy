import React from "react";
import {PostView} from "lemmy-js-client";
import {FlatList, View} from "native-base";
import {RefreshControl, StyleSheet} from "react-native";
import FeedItem from "./FeedItem";

interface FeedViewProps {
    posts: PostView[],
    refreshing: boolean,
    setRefreshing?: () => void|Promise<void>,
    refresh: () => Promise<void>
}

const FeedView = ({posts, refreshing, refresh}: FeedViewProps) => {
    const feedItem = ({item}: {item: PostView}) => {
        return (
            <FeedItem post={item} />
        );
    };

    const keyExtractor = (item) => item.post.id.toString();

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={feedItem}
                keyExtractor={keyExtractor}
                maxToRenderPerBatch={4}
                initialNumToRender={4}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh}/>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default FeedView;