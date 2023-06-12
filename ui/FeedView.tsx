import React, {useState} from "react";
import {PostView, SortType} from "lemmy-js-client";
import {FlatList, View} from "native-base";
import {Button, RefreshControl, StyleSheet} from "react-native";
import FeedItem from "./FeedItem";
import LoadingView from "./LoadingView";
import LoadingErrorView from "./LoadingErrorView";
import {Stack} from "expo-router";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {FlashList} from "@shopify/flash-list";

interface FeedViewProps {
    posts: PostView[],
    load: () => Promise<void>,
    loading: boolean,
    sort: SortType,
    setSort: React.Dispatch<React.SetStateAction<SortType>>;
}

const FeedView = ({posts, load, loading, sort, setSort}: FeedViewProps) => {
    const {showActionSheetWithOptions} = useActionSheet();

    const feedItem = ({item}: {item: PostView}) => {
        return (
            <FeedItem post={item} />
        );
    };

    const onSortPress = () => {
        const options = ["Top Day", "Top Week", "Hot", "New", "Most Comments", "Cancel"];
        const cancelButtonIndex = 4;

        showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (index: number) => {
            if(index === cancelButtonIndex) return;

            if(index === 0) {
                setSort("TopDay");
            } else if(index === 1) {
                setSort("TopWeek");
            } else if(index === 4) {
                setSort("MostComments");
            } else {
                setSort(options[index] as SortType);
            }
        });
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
                options={{
                    headerLeft: () => (
                        <Button title={sort} onPress={onSortPress} />
                    )
                }}
            />
            <FlashList
                data={posts}
                renderItem={feedItem}
                keyExtractor={keyExtractor}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={load}/>}
                estimatedItemSize={200}
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