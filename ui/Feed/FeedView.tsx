import React, {useRef, useState} from "react";
import {PostView, SortType} from "lemmy-js-client";
import {FlatList, View} from "native-base";
import {Button, RefreshControl, StyleSheet} from "react-native";
import FeedItem from "./FeedItem";
import LoadingView from "../LoadingView";
import LoadingErrorView from "../LoadingErrorView";
import {Stack} from "expo-router";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {FlashList} from "@shopify/flash-list";
import SortIconType from "../../types/SortIconType";
import CIconButton from "../CIconButton";
import FeedHeaderDropdownDrawer from "./FeedHeaderDropdownDrawer";
import {useAppDispatch, useAppSelector} from "../../store";
import {selectFeed, setDropdownVisible} from "../../slices/feed/feedSlice";
import {subscribeToCommunity} from "../../slices/communities/communitiesActions";
import {isSubscribed} from "../../lemmy/LemmyHelpers";
import {selectCommunities} from "../../slices/communities/communitiesSlice";

interface FeedViewProps {
    posts: PostView[],
    load: (refresh?: boolean) => Promise<void>,
    loading: boolean,
    titleDropsdown?: boolean,
    setSort:  React.Dispatch<React.SetStateAction<SortType>>,
    communityTitle?: boolean
}

const FeedView = ({posts, load, loading, setSort, titleDropsdown = true, communityTitle = false}: FeedViewProps) => {
    const [sortIcon, setSortIcon] = useState(SortIconType[2]);

    const flashList = useRef<FlashList<any>>();

    const {dropdownVisible} = useAppSelector(selectFeed);
    const {subscribedCommunities} = useAppSelector(selectCommunities);

    const {showActionSheetWithOptions} = useActionSheet();
    const dispatch = useAppDispatch();

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
            flashList?.current?.scrollToOffset({animated: true, offset: 0});
        });
    };

    const onCommunityHeaderPress = () => {
        const subscribed = isSubscribed(posts[0].community.id, subscribedCommunities);

        const options = [subscribed ? "Unsubscribe" : "Subscribe", "Cancel"];
        const cancelButtonIndex = 1;

        showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (index: number) => {
            if(index === cancelButtonIndex) return;

            if(index === 0) {
                dispatch(subscribeToCommunity({
                    communityId: posts[0].community.id,
                    subscribe: !subscribed
                }));
            }
        });
    };

    const keyExtractor = (item) => item.post.id.toString();
    const refreshControl = <RefreshControl refreshing={loading} onRefresh={() => load(true)}/>;
    const onEndReached = ({distanceFromEnd}) => {
        if(distanceFromEnd < 0) return;
    };

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
                    headerRight: () => {
                        if(dropdownVisible) {
                            return <Button title={"Cancel"} onPress={() => dispatch(setDropdownVisible())} />;
                        }

                        return (
                            <>
                                <CIconButton name={sortIcon} onPress={onSortPress} />
                                {
                                    communityTitle && (
                                        <CIconButton name={"ellipsis-horizontal-outline"} onPress={onCommunityHeaderPress} />
                                    )
                                }
                            </>
                        );
                    },
                    title: communityTitle ? posts[0].community.name : null
                }}
            />

            <FeedHeaderDropdownDrawer />

            <FlashList
                data={posts}
                renderItem={feedItem}
                keyExtractor={keyExtractor}
                refreshControl={refreshControl}
                onEndReachedThreshold={0.95}
                estimatedItemSize={300}
                estimatedListSize={{height: 50, width: 1}}
                disableScrollViewPanResponder={true}
                ListFooterComponent={loading ? <LoadingView /> : null}
                onEndReached={load}
                ref={flashList}
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