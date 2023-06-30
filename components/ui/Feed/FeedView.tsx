import React, { useEffect, useMemo, useRef, useState } from "react";
import { ListingType, PostView, SortType } from "lemmy-js-client";
import { HStack, useTheme, View } from "native-base";
import { Button, RefreshControl, StyleSheet } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { trigger } from "react-native-haptic-feedback";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  IconBolt,
  IconBookmark,
  IconCalendar,
  IconClockHour4,
  IconDots,
  IconFlame,
  IconMapPin,
  IconMessage,
  IconWorld,
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
import { ExtensionType, getLinkInfo } from "../../../helpers/LinkHelper";
import HeaderIconButton from "../buttons/HeaderIconButton";
import { IconCalendarWeek } from "../customIcons";
import { showToast } from "../../../slices/toast/toastSlice";
import NoResultView from "../common/NoResultView";
import { Community, FeedOverflowButton } from "./FeedOverflowButton";
import { FeedSortButton } from "./FeedSortButton";

interface FeedViewProps {
  feed: UseFeed;
  community?: boolean;
  header?: () => JSX.Element | null;
}

const SortIconType = {
  TopDay: <IconCalendar />,
  TopWeek: <IconCalendarWeek />,
  Hot: <IconFlame />,
  Active: <IconBolt />,
  New: <IconClockHour4 />,
  MostComments: <IconMessage />,
};

const ContextualMenuIconType = {
  Ellipses: <IconDots />,
  All: <IconWorld />,
  Local: <IconMapPin />,
  Subscribed: <IconBookmark />,
};

function FeedView({ feed, community = false, header }: FeedViewProps) {
  // State Props
  // TODO Handle this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endReached, setEndReached] = useState(false);

  // Global state props
  const { dropdownVisible } = useAppSelector(selectFeed);
  const { compactView } = useAppSelector(selectSettings);

  // Refs
  const flashList = useRef<FlashList<any>>();
  const recycled = useRef({});

  // Other Hooks
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
  }, [feed.sort, feed.listingType]);

  const firstPost = (feed.posts?.length ?? 0) > 0 ? feed.posts[0] : undefined;

  const postCommunity: Community = useMemo(() => {
    if (!firstPost || !community) return undefined;

    return {
      id: firstPost.community.id,
      name: firstPost.community.name,
    };
  }, [firstPost, community]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (dropdownVisible) {
          return (
            <Button
              title="Cancel"
              onPress={() => dispatch(setDropdownVisible())}
            />
          );
        }

        return (
          <HStack space={1}>
            <FeedSortButton
              feed={feed}
              onSortUpdate={() =>
                flashList?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                })
              }
            />
            <FeedOverflowButton
              feed={feed}
              community={postCommunity}
              onPress={() =>
                flashList?.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                })
              }
            />
          </HStack>
        );
      },
    });
  }, [feed, postCommunity, dropdownVisible]);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<PostView>) => {
      if (feed.community && feed.community.counts.posts < 1) {
        return <NoResultView type="posts" />;
      }

      if (compactView) {
        return <CompactFeedItem post={item} setPosts={feed.setPosts} />;
      }

      return (
        <FeedItem post={item} setPosts={feed.setPosts} recycled={recycled} />
      );
    },
    [feed.community, compactView]
  );

  const onEndReached = React.useCallback(
    () => feed.posts && feed.doLoad(),
    [feed]
  );

  const getItemType = React.useCallback(
    (item: PostView): string | undefined => {
      const linkType = getLinkInfo(item.post.url);

      if (
        linkType.extType === ExtensionType.GENERIC &&
        item.post.thumbnail_url
      ) {
        return "thumbnail_link";
      }
      if (linkType.extType === ExtensionType.IMAGE) {
        return "image";
      }
      return undefined;
    },
    []
  );
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
        <HeaderIconButton
          icon={
            community
              ? ContextualMenuIconType.Ellipses
              : ContextualMenuIconType[feed.listingType]
          }
          onPress={onContextualMenuButtonPress}
        />
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
            <NoResultView type="posts" />
          </>
        )) || (
          <FlashList
            ListHeaderComponent={header}
            data={feed.posts}
            extraData={feed.refreshList}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            refreshControl={refreshControl}
            onEndReachedThreshold={0.5}
            estimatedItemSize={compactView ? 100 : 500}
            ListFooterComponent={footer}
            ListEmptyComponent={<NoResultView type="posts" />}
            onEndReached={onEndReached}
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
