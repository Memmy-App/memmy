import React, { useEffect, useRef, useState } from "react";
import { ListingType, PostView, SortType } from "lemmy-js-client";
import { HStack, useTheme, useToast, View } from "native-base";
import { Button, RefreshControl, StyleSheet } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { FlashList } from "@shopify/flash-list";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconBolt,
  IconCalendar,
  IconClockHour4,
  IconDots,
  IconFlame,
  IconMessage,
} from "tabler-icons-react-native";
import FeedItem from "./FeedItem";
import LoadingView from "../Loading/LoadingView";
import FeedHeaderDropdownDrawer from "./FeedHeaderDropdownDrawer";
import { useAppDispatch, useAppSelector } from "../../../store";
import { selectFeed, setDropdownVisible } from "../../../slices/feed/feedSlice";
import { UseFeed } from "../../hooks/feeds/useFeed";
import LoadingFooter from "../Loading/LoadingFooter";
import LoadingErrorFooter from "../Loading/LoadingErrorFooter";
import { lemmyAuthToken, lemmyInstance } from "../../../lemmy/LemmyInstance";
import LoadingErrorView from "../Loading/LoadingErrorView";
import CompactFeedItem from "./CompactFeedItem/CompactFeedItem";
import { selectSettings } from "../../../slices/settings/settingsSlice";
import NoPostsView from "./NoPostsView";
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import HeaderIconButton from "../buttons/HeaderIconButton";

interface FeedViewProps {
  feed: UseFeed;
  community?: boolean;
  header?: () => JSX.Element | null;
}

const SortIconType = {
  TopDay: <IconCalendar />,
  TopWeek: <IconCalendar />,
  Hot: <IconFlame />,
  Active: <IconBolt />,
  New: <IconClockHour4 />,
  MostComments: <IconMessage />,
};

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
  const recycled = useRef({});

  // Other Hooks
  const toast = useToast();
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useAppDispatch();

  useScrollToTop(flashList);

  useEffect(
    () => () => {
      recycled.current = null;
    },
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight(),
    });
  }, [feed.sort]);

  useEffect(() => {
    if (!feed.posts || feed.posts.length < 1 || communityId.current !== 0)
      return;
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
        userInterfaceStyle: theme.config.initialColorMode,
      },
      (index: number) => {
        if (index === cancelButtonIndex) return;

        if (index === 0) {
          feed.setSort("TopDay");
        } else if (index === 1) {
          feed.setSort("TopWeek");
        } else if (index === 5) {
          feed.setSort("MostComments");
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
          userInterfaceStyle: theme.config.initialColorMode,
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
          userInterfaceStyle: theme.config.initialColorMode,
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
    if (feed.community && feed.community.counts.posts < 1) {
      return <NoPostsView />;
    }

    if (compactView) {
      return <CompactFeedItem post={item} setPosts={feed.setPosts} />;
    }

    return (
      <FeedItem post={item} setPosts={feed.setPosts} recycled={recycled} />
    );
  };

  const getItemType = (item: PostView, index: number): string | undefined => {
    const linkType = getLinkInfo(item.post.url);

    if (linkType.extType === ExtensionType.GENERIC && item.post.thumbnail_url) {
      return "thumbnail_link";
    }
    if (linkType.extType === ExtensionType.IMAGE) {
      return "image";
    }
    return undefined;
  };

  const headerRight = () => {
    if (dropdownVisible) {
      return (
        <Button title="Cancel" onPress={() => dispatch(setDropdownVisible())} />
      );
    }

    return (
      <HStack space={1}>
        <HeaderIconButton
          icon={SortIconType[feed.sort]}
          onPress={onSortPress}
        />
        <HeaderIconButton icon={<IconDots />} onPress={onEllipsisButtonPress} />
      </HStack>
    );
  };

  const keyExtractor = (item) => item.post.id.toString();
  const refreshControl = (
    <RefreshControl
      refreshing={feed.postsLoading}
      onRefresh={() => feed.doLoad(true)}
      tintColor={theme.colors.app.textSecondary}
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

  const HeaderComponent = header;

  return (
    <View style={styles.container} backgroundColor={theme.colors.app.bg}>
      <FeedHeaderDropdownDrawer />

      {(feed.postsLoading && !feed.posts && <LoadingView />) ||
        (feed.postsError && !feed.posts && (
          <LoadingErrorView onRetryPress={() => feed.doLoad(true)} />
        )) ||
        (feed.community && feed.community.counts.posts < 1 && (
          <>
            <HeaderComponent />
            <NoPostsView />
          </>
        )) || (
          <FlashList
            ListHeaderComponent={header}
            data={feed.posts}
            extraData={feed.refreshList}
            renderItem={feedItem}
            keyExtractor={keyExtractor}
            refreshControl={refreshControl}
            onEndReachedThreshold={0.5}
            estimatedItemSize={compactView ? 100 : 500}
            ListFooterComponent={footer}
            onEndReached={() => feed.doLoad()}
            ref={flashList}
            getItemType={getItemType}
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
