import React, {useState} from "react";
import {PostView, SortType} from "lemmy-js-client";
import {View} from "native-base";
import {RefreshControl, StyleSheet} from "react-native";
import FeedItem from "./FeedItem";
import LoadingView from "../LoadingView";
import LoadingErrorView from "../LoadingErrorView";
import {Stack} from "expo-router";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {FlashList} from "@shopify/flash-list";
import SortIconType from "../../types/SortIconType";
import CIconButton from "../CIconButton";
import FeedHeaderDropdownDrawer from "./FeedHeaderDropdownDrawer";

interface FeedViewProps {
    posts: PostView[],
    load: () => Promise<void>,
    loading: boolean,
    sort: SortType,
    titleDropsdown?: boolean,
    setSort:  React.Dispatch<React.SetStateAction<SortType>>,
}

const FeedView = ({posts, load, loading, setSort, sort, titleDropsdown = true}: FeedViewProps) => {
    const [sortIcon, setSortIcon] = useState(SortIconType[2]);

    const {showActionSheetWithOptions} = useActionSheet();

    const feedItem = ({item}: {item: PostView}) => {
        return (
            <FeedItem post={item} />
        );
    };

    const onSortPress = () => {
        const options = ["Top Day", "Top Week", "Hot", "New", "Most Comments", "Cancel"];
        const cancelButtonIndex = 5;

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

            setSortIcon(SortIconType[index]);
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
                    headerRight: () => (
                        <CIconButton name={sortIcon} onPress={onSortPress} />
                    )
                }}
            />

            <FeedHeaderDropdownDrawer />

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