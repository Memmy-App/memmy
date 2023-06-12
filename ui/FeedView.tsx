import React from "react";
import {PostView} from "lemmy-js-client";
import {FlatList, View} from "native-base";
import {RefreshControl, StyleSheet} from "react-native";
import FeedItem from "./FeedItem";
import LoadingView from "./LoadingView";
import LoadingErrorView from "./LoadingErrorView";
import {Stack} from "expo-router";

interface FeedViewProps {
    posts: PostView[],
    load: () => Promise<void>,
    loading: boolean
}

const FeedView = ({posts, load, loading}: FeedViewProps) => {
    const feedItem = ({item}: {item: PostView}) => {
        return (
            <FeedItem post={item} />
        );
    };

    const onSortPress = () => {
        const options = ["Top", "Hot", "New", "MostComments", "Cancel"];
        const cancelButtonIndex = 4;
    };

    const keyExtractor = (item) => item.post.id.toString();

    if((!posts && loading) || (posts && posts.length === 0)) {
        return <LoadingView />;
    }

    if(!posts && !loading) {
        return <LoadingErrorView onRetryPress={load} />;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen

            />
            <FlatList
                data={posts}
                renderItem={feedItem}
                keyExtractor={keyExtractor}
                maxToRenderPerBatch={4}
                initialNumToRender={4}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={load}/>}
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