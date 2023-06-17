import React, {useEffect, useRef, useState} from "react";
import {ListingType, PostView, SortType} from "lemmy-js-client";
import {useTheme, useToast, View} from "native-base";
import {Button, RefreshControl, StyleSheet} from "react-native";
import FeedItem from "./FeedItem";
import LoadingView from "../Loading/LoadingView";
import LoadingErrorView from "../Loading/LoadingErrorView";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {FlashList} from "@shopify/flash-list";
import SortIconType from "../../../types/SortIconType";
import CIconButton from "../CIconButton";
import FeedHeaderDropdownDrawer from "./FeedHeaderDropdownDrawer";
import {useAppDispatch, useAppSelector} from "../../../store";
import {selectFeed, setDropdownVisible} from "../../../slices/feed/feedSlice";
import {subscribeToCommunity} from "../../../slices/communities/communitiesActions";
import {isSubscribed} from "../../../lemmy/LemmyHelpers";
import {selectCommunities} from "../../../slices/communities/communitiesSlice";
import {useNavigation} from "@react-navigation/native";
import {trigger} from "react-native-haptic-feedback";

interface FeedViewProps {
    posts: PostView[],
    load: (refresh?: boolean) => Promise<void>,
    loading: boolean,
    titleDropsdown?: boolean,
    setSort:  React.Dispatch<React.SetStateAction<SortType>>,
    setListingType?: React.Dispatch<React.SetStateAction<ListingType>>,
    community?: boolean
}

const FeedView = (
    {
        posts,
        load,
        loading,
        setSort,
        setListingType,
        titleDropsdown = true,
        community = false,
    }: FeedViewProps) =>
{
    const navigation = useNavigation();

    const toast = useToast();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if(dropdownVisible) {
                    return <Button title={"Cancel"} onPress={() => dispatch(setDropdownVisible())} />;
                }

                return (
                    <>
                        <CIconButton name={sortIcon} onPress={onSortPress} />
                        <CIconButton name={"ellipsis-horizontal-outline"} onPress={onEllipsisButtonPress} />
                    </>
                );
            }
        });
    }, []);

    const [sortIcon, setSortIcon] = useState(SortIconType[2]);

    const flashList = useRef<FlashList<any>>();

    const {dropdownVisible} = useAppSelector(selectFeed);
    const {subscribedCommunities} = useAppSelector(selectCommunities);

    const {showActionSheetWithOptions} = useActionSheet();
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const feedItem = ({item}: {item: PostView}) => {
        return (
            <FeedItem post={item} />
        );
    };

    const onSortPress = () => {
        const options = ["Top Day", "Top Week", "Hot", "Active", "New", "Most Comments", "Cancel"];
        const cancelButtonIndex = 6;

        showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (index: number) => {
            if(index === cancelButtonIndex) return;

            if(index === 0) {
                setSort("TopDay");
            } else if(index === 1) {
                setSort("TopWeek");
            } else if(index === 5) {
                setSort("MostComments");
            } else {
                setSort(options[index] as SortType);
            }

            setSortIcon(SortIconType[index]);
            flashList?.current?.scrollToOffset({animated: true, offset: 0});
        });
    };

    const onEllipsisButtonPress = () => {
        if(community) {
            const subscribed = isSubscribed(posts[0].community.id, subscribedCommunities);

            const options = [subscribed ? "Unsubscribe" : "Subscribe", "Cancel"];
            const cancelButtonIndex = 1;

            showActionSheetWithOptions({
                options,
                cancelButtonIndex
            }, (index: number) => {
                if (index === cancelButtonIndex) return;

                if (index === 0) {
                    trigger("impactMedium");
                    toast.show({
                        title: `${!subscribed ? "Subscribed to" : "Unsubscribed from"} ${posts[0].community.name}`,
                        duration: 3000
                    });

                    dispatch(subscribeToCommunity({
                        communityId: posts[0].community.id,
                        subscribe: !subscribed
                    }));
                }
            });
        } else {
            const options = ["All", "Local", "Subscribed", "Cancel"];
            const cancelButtonIndex = 3;

            showActionSheetWithOptions({
                options,
                cancelButtonIndex
            }, (index: number) => {
                if(index === cancelButtonIndex) return;

                setListingType(options[index] as ListingType);
                flashList?.current?.scrollToOffset({animated: true, offset: 0});
            });
        }
    };

    const keyExtractor = (item) => item.post.id.toString();
    const refreshControl = <RefreshControl
        refreshing={loading}
        onRefresh={() => load(true)}
        tintColor={theme.colors.screen[300]}
    />;

    if((!posts && loading) || (posts && posts.length === 0)) {
        return <LoadingView />;
    }

    if(!posts && !loading) {
        return <LoadingErrorView onRetryPress={load} />;
    }

    return (
        <View style={styles.container} backgroundColor={"screen.900"}>
            <FeedHeaderDropdownDrawer />

            <FlashList
                data={feed.posts}
                renderItem={feedItem}
                keyExtractor={keyExtractor}
                refreshControl={refreshControl}
                onEndReachedThreshold={0.8}
                estimatedItemSize={300}
                estimatedListSize={{height: 50, width: 1}}
                ListFooterComponent={feed.postsLoading ? <LoadingView /> : null}
                onEndReached={() => setEndReached(true)}
                ref={flashList}
                onMomentumScrollEnd={() => {
                    if(endReached) {
                        feed.doLoad();
                        setEndReached(false);
                    }
                }}
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