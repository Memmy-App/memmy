import React, { useEffect, useRef, useState } from "react";
import { ListingType, SortType } from "lemmy-js-client";
import { useTheme, useToast, View } from "native-base";
import { Button, RefreshControl, StyleSheet } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { FlashList } from "@shopify/flash-list";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FeedItem from "./FeedItem";
import LoadingView from "../Loading/LoadingView";
import SortIconType from "../../../types/SortIconType";
import CIconButton from "../CIconButton";
import FeedHeaderDropdownDrawer from "./FeedHeaderDropdownDrawer";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectFeed, setDropdownVisible } from "../../../slices/feed/feedSlice";
import { UseFeed } from "../../hooks/feeds/feedsHooks";
import LoadingFooter from "../Loading/LoadingFooter";
import LoadingErrorFooter from "../Loading/LoadingErrorFooter";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import LoadingErrorView from "../Loading/LoadingErrorView";
import CompactFeedItem from "./CompactFeedItem";
import { selectSettings } from "../../../slices/settings/settingsSlice";

interface FeedViewProps {
  feed: UseFeed;
  community?: boolean;
  header?: () => JSX.Element | null;
}

function FeedView({ feed, community = false, header }: FeedViewProps) {
  // State Props
  const [endReached, setEndReached] = useState(false);
  const [, setSortIcon] = useState(SortIconType[feed.sort]);

  // Global state props
  const { dropdownVisible } = useAppSelector(selectFeed);
  const { compactView } = useAppSelector(selectSettings);

  // Refs
  const communityId = useRef(0);
  const communityName = useRef("");
  const flashList = useRef<FlashList<any>>();

  // Other Hooks
  const toast = useToast();
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useAppDispatch();

  useScrollToTop(flashList);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight(),
    });
  }, [feed.sort]);

  useEffect(() => {
    if (!feed.posts || communityId.current !== 0) return;
    communityId.current = feed.posts[0].community.id;
    communityName.current = feed.posts[0].community.name;
  }, [feed.posts]);

  const onSortPress = () => {
    const options = [
      "Top Day",
      "Top Week",
      "Hot",
      "Active",
      "New",
      "Most Comments",
      "Cancel",
    ];
    const cancelButtonIndex = 6;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (index: number) => {
        if (index === cancelButtonIndex) return;

        if (index === 0) {
          feed.setSort(SortType.TopDay);
        } else if (index === 1) {
          feed.setSort(SortType.TopWeek);
        } else if (index === 5) {
          feed.setSort(SortType.MostComments);
        } else {
          feed.setSort(options[index] as SortType);
        }

        setSortIcon(SortIconType[index]);
        flashList?.current?.scrollToOffset({ animated: true, offset: 0 });
      }
    );
  };

  const onEllipsisButtonPress = () => {
    if (community) {
      const options = ["Block Community", "Cancel"];
      const cancelButtonIndex = 1;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (index: number) => {
          if (index === cancelButtonIndex) return;

          if (index === 0) {
            trigger("impactMedium");
            toast.show({
              title: `Blocked ${communityName.current}`,
              duration: 3000,
            });

            lemmyInstance
              .blockCommunity({
                auth: lemmyAuthToken,
                community_id: communityId.current,
                block: true,
              })
              .then();
          }
        }
      );
    } else {
      const options = ["All", "Local", "Subscribed", "Cancel"];
      const cancelButtonIndex = 3;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (index: number) => {
          if (index === cancelButtonIndex) return;

          feed.setListingType(options[index] as ListingType);
          flashList?.current?.scrollToOffset({ animated: true, offset: 0 });
        }
      );
    }
  };

  const feedItem = ({ item }) => {
    if (compactView) {
      return <CompactFeedItem post={item} />;
    }

    return <FeedItem post={item} />;
  };

  const headerRight = () => {
    if (dropdownVisible) {
      return (
        <Button title="Cancel" onPress={() => dispatch(setDropdownVisible())} />
      );
    }

    return (
      <>
        <CIconButton name={SortIconType[feed.sort]} onPress={onSortPress} />
        <CIconButton
          name="ellipsis-horizontal-outline"
          onPress={onEllipsisButtonPress}
        />
      </>
    );
  };

  const keyExtractor = (item) => item.post.id.toString();
  const refreshControl = (
    <RefreshControl
      refreshing={feed.postsLoading}
      onRefresh={() => feed.doLoad(true)}
      tintColor={theme.colors.screen[300]}
    />
  );

  const footer = () => {
    if ((feed.postsLoading && feed.posts.length > 0) || endReached) {
      return <LoadingFooter message="Loading more posts..." />;
    }
    if (feed.postsError) {
      if (!feed.posts || feed.posts.length < 1) {
        return <LoadingErrorView onRetryPress={feed.doLoad} />;
      }

      return (
        <LoadingErrorFooter
          onRetryPress={() => feed.doLoad(true)}
          message="Failed to load posts :("
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container} backgroundColor="screen.900">
      <FeedHeaderDropdownDrawer />

      {(feed.postsLoading && !feed.posts && <LoadingView />) ||
        (feed.postsError && !feed.posts && (
          <LoadingErrorView onRetryPress={() => feed.doLoad(true)} />
        )) || (
          <FlashList
            ListHeaderComponent={header}
            data={feed.posts}
            extraData={feed.refreshList}
            renderItem={feedItem}
            keyExtractor={keyExtractor}
            refreshControl={refreshControl}
            onEndReachedThreshold={0.8}
            estimatedItemSize={compactView ? 100 : 500}
            ListFooterComponent={footer}
            onEndReached={() => setEndReached(true)}
            ref={flashList}
            onMomentumScrollEnd={() => {
              if (endReached) {
                feed.doLoad();
                setEndReached(false);
              }
            }}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FeedView;
